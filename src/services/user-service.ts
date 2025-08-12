
import { app } from '@/lib/firebase';
import { 
    getFirestore, 
    doc, 
    onSnapshot,
    Timestamp,
    DocumentData,
    FirestoreError,
    Unsubscribe
} from 'firebase/firestore';

const db = getFirestore(app);

// --- Types ---

export interface UserProfile {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    plan: 'free' | 'pro' | 'enterprise' | 'starter';
    plan_start_date: string; // ISO string
    plan_end_date: string | null; // ISO string or null
    trial_start_date: string; // ISO string
    trial_end_date: string; // ISO string
    updatedAt: string; // ISO string
}


/**
 * Converts a Firestore document with Timestamps to a UserProfile object with ISO strings.
 */
function docToProfile(docSnap: DocumentData): UserProfile {
    const data = docSnap.data();
    if (!data) throw new Error("Document data is empty.");

    // Helper to safely convert timestamp or return a default
    const toISOString = (timestamp: any, defaultDate = new Date()) => 
        timestamp instanceof Timestamp ? timestamp.toDate().toISOString() : defaultDate.toISOString();

    const profile: UserProfile = {
        id: docSnap.id,
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        email: data.email || '',
        plan: data.plan || 'starter',
        plan_start_date: toISOString(data.plan_start_date),
        plan_end_date: data.plan_end_date ? toISOString(data.plan_end_date) : null,
        trial_start_date: toISOString(data.trial_start_date),
        trial_end_date: toISOString(data.trial_end_date),
        updatedAt: toISOString(data.updatedAt),
    };
    return profile;
}


/**
 * Listens for real-time updates to a user's profile document.
 * @param userId The ID of the user whose profile to listen for.
 * @param callback A function to be called with the updated user profile.
 * @param onError A function to be called when an error occurs.
 * @returns An unsubscribe function to stop listening for updates.
 */
export function listenToUser(userId: string, callback: (profile: UserProfile | null) => void, onError?: (error: FirestoreError) => void): Unsubscribe {
    if (!userId) {
        const error = { code: 'invalid-argument', message: 'User ID is required.' } as FirestoreError;
        if (onError) onError(error);
        return () => {};
    }
    const docRef = doc(db, "users", userId);
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
            try {
                const profile = docToProfile(docSnap);
                callback(profile);
            } catch (e: any) {
                 if (onError) {
                    onError({ code: 'internal', message: `Error parsing profile data: ${e.message}` } as FirestoreError);
                }
            }
        } else {
            // This is a valid state for new users whose document hasn't been created yet.
            // Calling back with null allows the UI to handle this state gracefully.
            callback(null);
        }
    }, (error) => {
        console.error("Error listening to user profile: ", error);
        if (onError) {
            onError(error);
        }
    });

    return unsubscribe;
}
