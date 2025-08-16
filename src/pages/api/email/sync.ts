
import type { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';
import { getFirestore, doc, getDoc, writeBatch, serverTimestamp, Timestamp } from 'firebase/firestore';
import { app } from '@/lib/firebase-admin';
import { Integration, CustomerMessage, Conversation } from '@/services/firestore-service';

const db = getFirestore(app);

// Helper function to decode base64url
const base64UrlDecode = (input: string) => {
    let base64 = input.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
        base64 += '=';
    }
    return Buffer.from(base64, 'base64').toString('utf-8');
};

// Helper to get a header value
const getHeader = (headers: any[], name: string) => {
    const header = headers.find(h => h.name.toLowerCase() === name.toLowerCase());
    return header ? header.value : '';
};

// Robustly parse sender's name and email
const parseSender = (fromHeader: string): { name: string; email: string } => {
    const match = fromHeader.match(/(?:"?([^"]*)"?\s)?<?(.+@[^>]+)>?/);
    if (match) {
        const name = match[1] || match[2].split('@')[0];
        const email = match[2];
        return { name: name.trim(), email: email.trim() };
    }
    if (fromHeader.includes('@')) {
        return { name: fromHeader.split('@')[0], email: fromHeader };
    }
    return { name: fromHeader, email: '' };
};

// Find the body of the email
const getBody = (payload: any): string => {
    if (payload.body?.data) {
        return base64UrlDecode(payload.body.data);
    }
    if (payload.parts) {
        const textPart = payload.parts.find((part: any) => part.mimeType === 'text/plain');
        if (textPart && textPart.body?.data) {
            return base64UrlDecode(textPart.body.data);
        }
        const htmlPart = payload.parts.find((part: any) => part.mimeType === 'text/html');
        if (htmlPart && htmlPart.body?.data) {
            const htmlDecoded = base64UrlDecode(htmlPart.body.data);
            return htmlDecoded.replace(/<[^>]*>?/gm, ''); // Basic HTML strip
        }
    }
    return payload.snippet || 'No readable content.';
};


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized: User ID is missing.' });
        }

        const integrationRef = doc(db, `users/${userId}/integrations/gmail`);
        const integrationSnap = await getDoc(integrationRef);

        if (!integrationSnap.exists()) {
            return res.status(404).json({ error: 'Gmail integration not found or not connected.' });
        }

        const integrationData = integrationSnap.data() as Integration & { tokens?: { refresh_token?: string } };
        const userEmail = integrationData.details?.email;
        const tokens = integrationData.tokens;

        if (!userEmail) {
            return res.status(400).json({ error: 'User email not found in integration details.' });
        }
        if (!tokens?.refresh_token) {
            return res.status(400).json({ error: 'Refresh token not found. Please reconnect Gmail.' });
        }

        const oAuth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/callback/google'
        );

        oAuth2Client.setCredentials({ refresh_token: tokens.refresh_token });

        const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

        const listRes = await gmail.users.threads.list({
            userId: 'me',
            maxResults: 20,
            q: 'in:inbox'
        });

        const threads = listRes.data.threads || [];
        if (threads.length === 0) {
            return res.status(200).json({ message: 'No new threads to sync.', syncedConversations: 0, syncedMessages: 0 });
        }

        const batch = writeBatch(db);
        let syncedConversationsCount = 0;
        let syncedMessagesCount = 0;

        for (const threadHeader of threads) {
            if (!threadHeader.id) continue;

            const threadRes = await gmail.users.threads.get({ userId: 'me', id: threadHeader.id, format: 'full' });
            const threadData = threadRes.data;
            
            if (!threadData?.messages || threadData.messages.length === 0) continue;

            syncedConversationsCount++;
            
            let customerName = 'Unknown';
            let customerEmail = '';
            let subject = 'No Subject';
            let unreadCount = 0;
            let lastMessageAt = new Date(0);

            const conversationMessages: CustomerMessage[] = threadData.messages.map(msg => {
                syncedMessagesCount++;
                const headers = msg.payload?.headers || [];
                const fromHeader = getHeader(headers, 'From');
                const sender = parseSender(fromHeader);

                const msgDate = new Date(parseInt(msg.internalDate || '0'));
                if (msgDate > lastMessageAt) {
                    lastMessageAt = msgDate;
                    subject = getHeader(headers, 'Subject');
                }

                const isIncoming = sender.email.toLowerCase() !== userEmail.toLowerCase();
                const isUnread = !!msg.labelIds?.includes('UNREAD');

                if (isIncoming) {
                    if (!customerEmail) {
                        customerName = sender.name;
                        customerEmail = sender.email;
                    }
                    if (isUnread) {
                        unreadCount++;
                    }
                }
                
                return {
                    id: msg.id!,
                    conversationId: threadData.id!,
                    messageType: isIncoming ? 'incoming' : 'outgoing',
                    senderName: sender.name,
                    senderEmail: sender.email,
                    content: getBody(msg.payload),
                    isRead: !isUnread,
                    deliveryStatus: isUnread ? 'unread' : 'read',
                    createdAt: msgDate.toISOString(),
                };
            }).sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()); // sort messages chronologically
            
            if (!customerEmail) continue; // Skip threads with no external participant

            const conversation: Conversation = {
                id: threadData.id!,
                userId,
                customerName,
                customerEmail,
                channel: 'email',
                subject,
                status: unreadCount > 0 ? 'open' : 'closed',
                priority: 'normal',
                lastMessageAt: Timestamp.fromDate(lastMessageAt),
                unreadCount,
                messages: conversationMessages,
            };

            const convRef = doc(db, `users/${userId}/conversations`, conversation.id);
            batch.set(convRef, conversation, { merge: true });
        }
        
        await batch.commit();

        res.status(200).json({
            message: 'Sync successful',
            syncedConversations: syncedConversationsCount,
            syncedMessages: syncedMessagesCount,
            lastSyncAt: new Date().toISOString(),
        });

    } catch (error: any) {
        console.error('Gmail sync failed:', error);
        res.status(500).json({ error: 'Failed to sync Gmail.', details: error.message });
    }
}

    