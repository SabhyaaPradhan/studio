
'use client';

import {
    getFirestore,
    collection,
    onSnapshot,
    Timestamp,
    query,
    orderBy,
    FirestoreError,
    Unsubscribe,
} from 'firebase/firestore';
import { app } from '@/lib/firebase';

const db = getFirestore(app);

// --- Types ---
export interface Webhook {
    id: string;
    endpointUrl: string;
    events: string[];
    status: 'active' | 'disabled' | 'error';
    secretKey: string;
    createdAt: string; // ISO string
    lastDeliveredAt: string | null; // ISO string
}

export interface WebhookLog {
    id: string;
    webhookId: string;
    eventName: string;
    statusCode: number;
    responseTimeMs: number;
    createdAt: string; // ISO string
}


// --- API Call Functions (Client-side) ---

/**
 * Creates a new webhook for a user.
 * @param userId The ID of the user.
 * @param webhookData The data for the new webhook.
 * @returns The newly created webhook object from the server.
 */
export async function createWebhook(userId: string, webhookData: { endpointUrl: string; events: string[] }): Promise<Webhook> {
    if (!userId) throw new Error("User ID is required.");

    const response = await fetch('/api/webhooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...webhookData }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create webhook.');
    }

    return response.json();
}

// --- Firestore Listeners (Client-side) ---

/**
 * Listens for real-time updates to a user's webhooks.
 * @param userId The ID of the user.
 * @param callback A function to be called with the updated list of webhooks.
 * @param onError A function to be called when an error occurs.
 * @returns An unsubscribe function to stop listening for updates.
 */
export function listenToWebhooks(
    userId: string,
    callback: (webhooks: Webhook[]) => void,
    onError: (error: FirestoreError) => void
): Unsubscribe {
    if (!userId) {
        onError({ code: 'invalid-argument', message: 'User ID is required.' } as FirestoreError);
        return () => {};
    }

    const q = query(collection(db, 'users', userId, 'webhooks'), orderBy('createdAt', 'desc'));

    return onSnapshot(q, (querySnapshot) => {
        const webhooks: Webhook[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            webhooks.push({
                id: doc.id,
                ...data,
                createdAt: (data.createdAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
                lastDeliveredAt: (data.lastDeliveredAt as Timestamp)?.toDate().toISOString() || null,
            } as Webhook);
        });
        callback(webhooks);
    }, (error) => {
        console.error("Error listening to webhooks:", error);
        onError(error);
    });
}
