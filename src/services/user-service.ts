
import { app } from '@/lib/firebase';
import { 
    getFirestore, 
    doc, 
    onSnapshot,
    Timestamp,
    DocumentData
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
}


/**
 * Converts a Firestore document with Timestamps to a UserProfile object with ISO strings.
 */
function docToProfile(doc: DocumentData): UserProfile {
    const data = doc.data() as any;
    const profile: UserProfile = {
        id: doc.id,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        plan: data.plan,
        // Convert timestamps to ISO strings for client-side use
        plan_start_date: data.plan_start_date?.toDate().toISOString(),
        plan_end_date: data.plan_end_date ? data.plan_end_date.toDate().toISOString() : null,
        trial_start_date: data.trial_start_date?.toDate().toISOString(),
        trial_end_date: data.trial_end_date?.toDate().toISOString(),
    };
    return profile;
}


/**
 * Listens for real-time updates to a user's profile document.
 * @param userId The ID of the user whose profile to listen for.
 * @param callback A function to be called with the updated user profile.
 * @returns An unsubscribe function to stop listening for updates.
 */
export function listenToUser(userId: string, callback: (profile: UserProfile | null) => void) {
    const docRef = doc(db, "users", userId);
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
            callback(docToProfile(docSnap));
        } else {
            console.log("No such user document!");
            callback(null);
        }
    }, (error) => {
        console.error("Error listening to user profile: ", error);
        callback(null);
    });

    return unsubscribe;
}
