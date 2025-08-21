
import type { NextApiRequest, NextApiResponse } from 'next';
import { getFirestore, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { app } from '@/lib/firebase-admin';

const db = getFirestore(app);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { userId, newPlan } = req.body;

        if (!userId || !newPlan) {
            return res.status(400).json({ error: 'User ID and new plan are required.' });
        }

        const validPlans = ['starter', 'pro', 'enterprise'];
        if (!validPlans.includes(newPlan)) {
            return res.status(400).json({ error: 'Invalid plan specified.' });
        }

        const userRef = doc(db, `users/${userId}`);
        
        await updateDoc(userRef, {
            'subscription.plan': newPlan,
            'subscription.status': 'active', // Assume changing the plan makes it active
            'updatedAt': serverTimestamp()
        });

        res.status(200).json({ 
            message: `Successfully changed user ${userId}'s plan to ${newPlan}.`
        });

    } catch (error: any) {
        console.error('Failed to change user plan:', error);
        res.status(500).json({ error: 'Failed to update user plan.', details: error.message });
    }
}
