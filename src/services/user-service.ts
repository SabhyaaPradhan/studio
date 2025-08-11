
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
    plan: 'free' | 'pro' | 'enterprise';
    plan_start_date: string; // ISO string
    plan_end_date: string | null; // ISO string or null
    trial_start_date: string; // ISO string
    trial_end_date: string; // ISO string
    updatedAt: string; // ISO string
}


/**
 * Converts a Firestore document with Timestamps to a UserProfile object with ISO strings.
 */
function docToProfile(doc: DocumentData): UserProfile {
    const data = doc.data() as any;
    // Basic validation to ensure timestamps are not null before converting
    const plan_start_date = data.plan_start_date?.toDate()?.toISOString() || new Date().toISOString();
    const plan_end_date = data.plan_end_date ? data.plan_end_date.toDate().toISOString() : null;
    const trial_start_date = data.trial_start_date?.toDate()?.toISOString() || new Date().toISOString();
    const trial_end_date = data.trial_end_date?.toDate()?.toISOString() || new Date().toISOString();
    const updatedAt = data.updatedAt?.toDate()?.toISOString() || new Date().toISOString();

    const profile: UserProfile = {
        id: doc.id,
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        email: data.email || '',
        plan: data.plan || 'free',
        plan_start_date,
        plan_end_date,
        trial_start_date,
        trial_end_date,
        updatedAt,
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
        console.warn(error.message);
        return () => {};
    }
    const docRef = doc(db, "users", userId);
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
            callback(docToProfile(docSnap));
        } else {
            console.warn(`User document not found for uid: ${userId}. This is expected for new users.`);
            callback(null);
        }
    }, (error) => {
        console.error("Error listening to user profile: ", error);
        // Only call the provided onError for actual database/permission errors
        if (onError) {
            onError(error);
        }
        callback(null);
    });

    return unsubscribe;
}
