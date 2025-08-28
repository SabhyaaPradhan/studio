
import type { NextApiRequest, NextApiResponse } from 'next';
import { getFirestore, collection, getDocs, addDoc, serverTimestamp, query } from 'firebase/firestore';
import { app } from '@/lib/firebase-admin'; // Use admin SDK on the server
import { randomBytes } from 'crypto';

const db = getFirestore(app);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        return listWebhooks(req, res);
    } else if (req.method === 'POST') {
        return createWebhook(req, res);
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
}

async function listWebhooks(req: NextApiRequest, res: NextApiResponse) {
    const { userId } = req.query;

    if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ error: 'User ID is required.' });
    }

    try {
        const webhooksRef = collection(db, `users/${userId}/webhooks`);
        const q = query(webhooksRef);
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            return res.status(200).json([]);
        }

        const webhooks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return res.status(200).json(webhooks);

    } catch (error: any) {
        console.error('Failed to list webhooks:', error);
        return res.status(500).json({ error: 'Failed to retrieve webhooks.', details: error.message });
    }
}

async function createWebhook(req: NextApiRequest, res: NextApiResponse) {
    const { userId, endpointUrl, events } = req.body;

    if (!userId || !endpointUrl || !events || !Array.isArray(events)) {
        return res.status(400).json({ error: 'Missing required fields: userId, endpointUrl, events.' });
    }

    try {
        // Generate a cryptographically secure signing secret
        const secretKey = `whsec_${randomBytes(24).toString('hex')}`;

        const newWebhook = {
            endpointUrl,
            events,
            secretKey,
            status: 'active',
            createdAt: serverTimestamp(),
            lastDeliveredAt: null,
        };

        const docRef = await addDoc(collection(db, `users/${userId}/webhooks`), newWebhook);

        return res.status(201).json({ id: docRef.id, ...newWebhook });

    } catch (error: any) {
        console.error('Failed to create webhook:', error);
        return res.status(500).json({ error: 'Failed to create webhook.', details: error.message });
    }
}
