
import { 
    getFirestore, 
    collection, 
    onSnapshot,
    Timestamp,
    DocumentData,
    query,
    orderBy,
    limit,
    FirestoreError,
    Unsubscribe
} from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { listenToChatMessages, ChatMessage } from './firestore-service';
import { LucideIcon, MessageSquare } from 'lucide-react';

const db = getFirestore(app);

// --- Types ---
export interface Activity {
    id: string;
    icon: LucideIcon;
    text: string;
    timestamp: Date;
    source: 'chat-message';
}

// --- Activity Listener ---

/**
 * Listens to chat messages and transforms them into an activity feed.
 * @param userId The ID of the user.
 * @param callback A function to be called with the updated list of activities.
 * @param onError A function to be called when an error occurs.
 * @returns An unsubscribe function to stop listening for updates.
 */
export function listenToActivities(userId: string, callback: (activities: Activity[]) => void, onError: (error: FirestoreError) => void): Unsubscribe {
    if (!userId) {
        onError({ code: 'invalid-argument', message: 'User ID is required.' } as FirestoreError);
        return () => {};
    }

    // For this implementation, we will only listen to chat messages.
    // This could be expanded to listen to other collections (e.g., profile updates, plan changes).
    const unsubscribe = listenToChatMessages(userId, (messages) => {
        const activities: Activity[] = messages
            .filter(msg => msg.role === 'model') // Only show AI replies as activities
            .map(msg => ({
                id: msg.id,
                icon: MessageSquare,
                text: `New AI reply generated: "${msg.content.substring(0, 50)}..."`,
                timestamp: new Date(msg.createdAt),
                source: 'chat-message'
            }))
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()) // Sort by most recent
            .slice(0, 5); // Limit to the last 5 activities

        callback(activities);
    }, onError);

    return unsubscribe;
}
