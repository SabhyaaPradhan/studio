
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
import { Graph, listenToGraphs } from './firestore-service';
import { AiRequest, listenToAiRequests } from './firestore-service';
import { UserProfile, listenToUser } from './user-service';
import { Icon, MessageSquare, BrainCircuit, Settings, DollarSign } from 'lucide-react';

const db = getFirestore(app);

// --- Types ---
export interface Activity {
    id: string;
    icon: Icon;
    text: string;
    timestamp: Date;
    source: 'graph-created' | 'graph-updated' | 'ai-request' | 'user-updated';
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

    let allActivities: Activity[] = [];

    const unsubs: Unsubscribe[] = [];

    // Listener for Graphs
    const graphUnsub = listenToGraphs(userId, (graphs) => {
        const graphActivities: Activity[] = graphs.flatMap(graph => {
            const activities: Activity[] = [];
            if (graph.createdAt) {
                activities.push({
                    id: `${graph.id}-created`,
                    icon: BrainCircuit,
                    text: `Knowledge source '${graph.title}' was created.`,
                    timestamp: graph.createdAt.toDate(),
                    source: 'graph-created'
                });
            }
            // Check if updatedAt is different from createdAt
            if (graph.updatedAt && graph.createdAt && graph.updatedAt.toMillis() !== graph.createdAt.toMillis()) {
                 activities.push({
                    id: `${graph.id}-updated`,
                    icon: BrainCircuit,
                    text: `Knowledge source '${graph.title}' was updated.`,
                    timestamp: graph.updatedAt.toDate(),
                    source: 'graph-updated'
                });
            }
            return activities;
        });

        // Filter out old graph activities and add new ones
        allActivities = allActivities.filter(a => !a.source.startsWith('graph-'));
        allActivities.push(...graphActivities);
        sortAndCallback();

    }, onError);
    unsubs.push(graphUnsub);

    // Listener for AI Requests
    const aiRequestUnsub = listenToAiRequests(userId, (requests) => {
        const requestActivities: Activity[] = requests.map(req => ({
            id: req.id,
            icon: MessageSquare,
            text: `New AI reply generated.`,
            timestamp: req.createdAt.toDate(),
            source: 'ai-request'
        }));

        allActivities = allActivities.filter(a => a.source !== 'ai-request');
        allActivities.push(...requestActivities);
        sortAndCallback();

    }, onError);
    unsubs.push(aiRequestUnsub);

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
    

    const sortAndCallback = () => {
        allActivities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        callback(allActivities.slice(0, 10)); // Return latest 10 activities
    };

    // Return a function that unsubscribes from all listeners
    return () => {
        unsubs.forEach(unsub => unsub());
    };
}
