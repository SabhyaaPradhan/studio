
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
    Unsubscribe,
    collectionGroup
} from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { listenToChatMessages, ChatMessage } from './firestore-service';
import { UserProfile, listenToUser } from './user-service';
import { LucideIcon, MessageSquare, BrainCircuit, Settings, DollarSign } from 'lucide-react';

const db = getFirestore(app);

// --- Types ---
export interface Activity {
    id: string;
    icon: LucideIcon;
    text: string;
    timestamp: Date;
    source: 'chat-message' | 'user-updated';
}

// --- Activity Listener ---

/**
 * Listens to multiple collections and combines them into a single, sorted activity feed.
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

    const unsubs: Unsubscribe[] = [];
    let allActivities: Activity[] = [];
    const MAX_ACTIVITIES = 10;

    const sortAndCallback = () => {
        allActivities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        callback(allActivities.slice(0, MAX_ACTIVITIES));
    };

    // Listener for Chat Messages
    const chatUnsub = listenToChatMessages(userId, (messages) => {
        const chatActivities: Activity[] = messages
            .filter(msg => msg.role === 'model') // Only show AI replies
            .map(msg => ({
                id: msg.id,
                icon: MessageSquare,
                text: `New AI reply generated to a user.`,
                timestamp: new Date(msg.createdAt),
                source: 'chat-message'
            }));

        allActivities = allActivities.filter(a => a.source !== 'chat-message');
        allActivities.push(...chatActivities);
        sortAndCallback();

    }, onError);
    unsubs.push(chatUnsub);


    // Listener for User Profile
    let initialProfileLoad = true;
    const userUnsub = listenToUser(userId, (profile) => {
        if (profile && profile.updatedAt) {
             // Avoid creating an activity on the very first load
            if (!initialProfileLoad) {
                const userActivity: Activity = {
                    id: `${profile.id}-${profile.updatedAt}`,
                    icon: Settings,
                    text: 'Your profile information was updated.',
                    timestamp: new Date(profile.updatedAt),
                    source: 'user-updated'
                };
                 // Remove old user update and add new one
                allActivities = allActivities.filter(a => a.source !== 'user-updated');
                allActivities.push(userActivity);
                sortAndCallback();
            }
            initialProfileLoad = false;
        }
    }, onError);
    unsubs.push(userUnsub);
    

    // Return a function that unsubscribes from all listeners
    return () => {
        unsubs.forEach(unsub => unsub());
    };
}

    