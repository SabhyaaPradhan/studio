
import type { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';
import { getFirestore, doc, getDoc, writeBatch, serverTimestamp, Timestamp } from 'firebase/firestore';
import { app } from '@/lib/firebase-admin'; // Using admin-app for backend
import { Conversation, CustomerMessage, Integration } from '@/services/firestore-service';

const db = getFirestore(app);

// Helper function to decode base64url
const base64UrlDecode = (input: string) => {
    input = input.replace(/-/g, '+').replace(/_/g, '/');
    while (input.length % 4) {
        input += '=';
    }
    return Buffer.from(input, 'base64').toString('utf-8');
};

// Helper to get a header value
const getHeader = (headers: any[], name: string) => {
    const header = headers.find(h => h.name.toLowerCase() === name.toLowerCase());
    return header ? header.value : '';
};

const parseSender = (fromHeader: string) => {
    const match = fromHeader.match(/^(.*)<(.*)>$/);
    if (match) {
        return { name: match[1].trim().replace(/"/g, ''), email: match[2].trim() };
    }
    return { name: fromHeader, email: fromHeader };
};


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    // In a real app, you would get userId from a secure session or auth token
    const { userId } = req.body;
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized: User ID is missing.' });
    }

    try {
        const integrationRef = doc(db, `users/${userId}/integrations/gmail`);
        const integrationSnap = await getDoc(integrationRef);

        if (!integrationSnap.exists()) {
            return res.status(404).json({ error: 'Gmail integration not found or not connected.' });
        }
        
        const integrationData = integrationSnap.data() as Integration;
        const tokens = (integrationData as any).tokens;

        if (!tokens || !tokens.refresh_token) {
            return res.status(400).json({ error: 'Refresh token not found. Please reconnect Gmail.' });
        }

        const oAuth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/callback/google'
        );

        oAuth2Client.setCredentials({ refresh_token: tokens.refresh_token });

        const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

        const listRes = await gmail.users.messages.list({
            userId: 'me',
            maxResults: 20, // Fetch last 20 messages for this sync
            labelIds: ['INBOX'],
            q: 'is:unread' // Let's sync unread messages first to be efficient
        });

        const messages = listRes.data.messages || [];
        if (messages.length === 0) {
            return res.status(200).json({ message: 'No new messages to sync.', syncedConversations: 0, syncedMessages: 0 });
        }

        const batch = writeBatch(db);
        const conversationsMap = new Map<string, Partial<Conversation>>();
        let syncedMessagesCount = 0;

        for (const messageHeader of messages) {
            if (!messageHeader.id || !messageHeader.threadId) continue;
            
            const messageRes = await gmail.users.messages.get({ userId: 'me', id: messageHeader.id, format: 'full' });
            const messageData = messageRes.data;
            const headers = messageData.payload?.headers || [];
            
            const fromHeader = getHeader(headers, 'From');
            const sender = parseSender(fromHeader);

            const isIncoming = sender.email !== integrationData.details.email;
            if (!isIncoming) continue; // Skip messages sent by the user for now

            syncedMessagesCount++;

            const messageDocRef = doc(db, `users/${userId}/conversations/${messageData.threadId}/messages`, messageData.id);
            const messagePayload: CustomerMessage = {
                id: messageData.id,
                conversationId: messageData.threadId,
                messageType: 'incoming',
                senderName: sender.name,
                senderEmail: sender.email,
                content: messageData.snippet || 'No snippet available.', // Simplified for now
                isRead: !(messageData.labelIds?.includes('UNREAD')),
                deliveryStatus: 'read',
                createdAt: new Date(parseInt(messageData.internalDate || '0')).toISOString(),
            };
            batch.set(messageDocRef, messagePayload);

            // Upsert conversation details
            const conversation = conversationsMap.get(messageData.threadId) || {
                id: messageData.threadId,
                userId,
                channel: 'email',
                status: 'open',
                priority: 'normal',
                unreadCount: 0,
                messages: [], // Will be handled by subcollection
            };
            
            conversation.subject = getHeader(headers, 'Subject');
            conversation.customerName = sender.name;
            conversation.customerEmail = sender.email;
            const messageDate = new Date(parseInt(messageData.internalDate || '0'));
            
            if (!conversation.lastMessageAt || messageDate > new Date((conversation.lastMessageAt as any).toDate())) {
                conversation.lastMessageAt = Timestamp.fromDate(messageDate);
            }

            if (messageData.labelIds?.includes('UNREAD')) {
                conversation.unreadCount = (conversation.unreadCount || 0) + 1;
            }
            conversationsMap.set(messageData.threadId, conversation);
        }

        // Set conversation documents
        for (const [threadId, convData] of conversationsMap.entries()) {
            const convRef = doc(db, `users/${userId}/conversations`, threadId);
            batch.set(convRef, convData, { merge: true });
        }
        
        await batch.commit();

        res.status(200).json({
            message: 'Sync successful',
            syncedConversations: conversationsMap.size,
            syncedMessages: syncedMessagesCount,
            lastSyncAt: new Date().toISOString(),
        });

    } catch (error: any) {
        console.error('Gmail sync failed:', error);
        res.status(500).json({ error: 'Failed to sync Gmail.', details: error.message });
    }
}
