
'use client';

import { app } from '@/lib/firebase';
import { 
    getFirestore, 
    collection, 
    addDoc, 
    serverTimestamp, 
    query, 
    onSnapshot,
    Timestamp,
    DocumentData,
    Unsubscribe,
    FirestoreError,
    doc,
    updateDoc,
    arrayUnion,
    writeBatch,
    increment,
    limit,
    orderBy,
    where,
    startAt
} from 'firebase/firestore';
import { format, subDays } from 'date-fns';

const db = getFirestore(app);

// --- Types ---

export interface Graph {
    id: string; // Document ID
    title: string;
    data: any; // object or array for graph dataset
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface AiRequest {
    id:string;
    input: string | object;
    output: string | object;
    createdAt: Timestamp;
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'model';
    content: string;
    createdAt: string; // ISO string
    tokens: number;
    confidence?: number;
    category?: string;
    latency_ms?: number;
}


export interface CustomerMessage {
  id: string;
  conversationId: string;
  messageType: "incoming" | "outgoing";
  senderName: string;
  senderEmail?: string;
  content: string;
  isRead: boolean;
  deliveryStatus: string;
  createdAt: string; // ISO String
}


export interface Conversation {
    id: string;
    userId: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    channel: string;
    subject?: string;
    status: string;
    priority: string;
    lastMessageAt: Timestamp;
    unreadCount: number;
    messages: CustomerMessage[];
}


export interface AiGeneratedReply {
  id: string;
  conversationId: string;
  originalMessageId: string;
  replyType: string;
  generatedReply: string;
  finalReply?: string;
  confidence: number;
  status: 'draft' | 'sent' | 'failed';
  wasEdited: boolean;
  createdAt: Timestamp;
  conversation: { // Denormalized for easy display
      customerName: string;
  };
}


export interface DailyAnalytics {
    id: string; // YYYY-MM-DD
    date: string; // YYYY-MM-DD
    total_messages: number;
    user_messages: number;
    assistant_messages: number;
    total_tokens: number;
    avg_latency_ms: number;
    by_category: Record<string, number>;
    confidence_buckets: Record<string, number>;
    sum_latency_ms: number; // For internal calculation
}

export interface RealtimeAnalytics {
    id: string; // e.g., 'realtime'
    today_total_messages: number;
    today_user_messages: number;
    today_assistant_messages: number;
    today_tokens: number;
    updated_at: Timestamp;
}

// --- Functions ---

/**
 * Gets the UTC date string in YYYY-MM-DD format.
 */
const getUTCDateString = (date: Date): string => {
    return date.toISOString().split('T')[0];
};

/**
 * Determines the confidence bucket for a given score.
 */
const getConfidenceBucket = (confidence: number): string => {
    if (confidence <= 0.2) return "0.0-0.2";
    if (confidence <= 0.4) return "0.2-0.4";
    if (confidence <= 0.6) return "0.4-0.6";
    if (confidence <= 0.8) return "0.6-0.8";
    return "0.8-1.0";
};

/**
 * Atomically writes a chat message and updates analytics aggregates.
 * This should ideally be a Cloud Function for production robustness.
 * @param userId The ID of the user.
 * @param message The ChatMessage object.
 */
export async function writeChatMessageEvent(userId: string, message: Omit<ChatMessage, 'id' | 'createdAt'>) {
    if (!userId) throw new Error("User ID is required.");

    const batch = writeBatch(db);
    const today = new Date();
    const dateStr = getUTCDateString(today);

    // 1. Write the raw chat message event
    const messageRef = doc(collection(db, `users/${userId}/chatMessages`));
    batch.set(messageRef, {
        ...message,
        createdAt: serverTimestamp() // Overwrite client timestamp with server's
    });

    // 2. Update daily analytics
    const dailyRef = doc(db, `users/${userId}/analytics/all-analytics/daily`, dateStr);
    const dailyUpdate: { [key: string]: any } = {
        total_messages: increment(1),
        total_tokens: increment(message.tokens || 0)
    };
    if (message.role === 'user') {
        dailyUpdate.user_messages = increment(1);
    } else {
        dailyUpdate.assistant_messages = increment(1);
    }
    if (message.category) {
        dailyUpdate[`by_category.${message.category}`] = increment(1);
    }
    if (message.confidence !== undefined) {
        const bucket = getConfidenceBucket(message.confidence);
        dailyUpdate[`confidence_buckets.${bucket}`] = increment(1);
    }
    if (message.latency_ms !== undefined) {
        dailyUpdate.sum_latency_ms = increment(message.latency_ms);
    }
    batch.set(dailyRef, dailyUpdate, { merge: true });
    // Also set the date field in case this is the first message of the day
    batch.set(dailyRef, { date: dateStr }, { merge: true });


    // 3. Update realtime analytics
    const realtimeRef = doc(db, `users/${userId}/analytics`, 'realtime');
    const realtimeUpdate: { [key: string]: any } = {
        updated_at: serverTimestamp(),
        today_tokens: increment(message.tokens || 0),
        today_total_messages: increment(1)
    };
    if (message.role === 'user') {
        realtimeUpdate.today_user_messages = increment(1);
    } else {
        realtimeUpdate.today_assistant_messages = increment(1);
    }
    batch.set(realtimeRef, realtimeUpdate, { merge: true });

    await batch.commit();
}


export async function addGraph(userId: string, title: string, data: any) {
    if (!userId) throw new Error("User ID is required to add a graph.");
    try {
        const docRef = await addDoc(collection(db, "users", userId, "graphs"), {
            title: title,
            data: data,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        return docRef;
    } catch (error) {
        console.error("Error adding graph: ", error);
        throw new Error("Could not create a new graph.");
    }
}

export async function addAiRequest(userId: string, input: string | object, output: string | object) {
    if (!userId) throw new Error("User ID is required to add an AI request.");
    try {
        const docRef = await addDoc(collection(db, "users", userId, "aiRequests"), {
            input: input,
            output: output,
            createdAt: serverTimestamp()
        });
        return docRef;
    } catch (error) {
        console.error("Error adding AI request: ", error);
        throw new Error("Could not log AI request.");
    }
}

export function listenToGraphs(userId: string, callback: (graphs: Graph[]) => void, onError: (error: FirestoreError) => void): Unsubscribe {
    if (!userId) {
        onError({ code: 'invalid-argument', message: 'User ID is required.' } as FirestoreError);
        return () => {};
    }
    const q = query(collection(db, "users", userId, "graphs"));
    
    return onSnapshot(q, (querySnapshot) => {
        const graphs: Graph[] = [];
        querySnapshot.forEach((doc) => {
            graphs.push({ ...doc.data(), id: doc.id } as Graph);
        });
        callback(graphs);
    }, (error) => {
        console.error("Error listening to graphs: ", error);
        onError(error);
    });
}

export function listenToChatMessages(userId: string, callback: (requests: ChatMessage[]) => void, onError: (error: FirestoreError) => void): Unsubscribe {
    if (!userId) {
        onError({ code: 'invalid-argument', message: 'User ID is required.' } as FirestoreError);
        return () => {};
    }
    const q = query(collection(db, "users", userId, "chatMessages"), orderBy("createdAt", "desc"), limit(10));

    return onSnapshot(q, (querySnapshot) => {
        const messages: ChatMessage[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
             messages.push({
                ...data,
                id: doc.id,
                createdAt: (data.createdAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
            } as ChatMessage);
        });
        callback(messages.reverse());
    }, (error) => {
        console.error("Error listening to AI requests: ", error);
        onError(error);
    });
}


export async function createConversation(userId: string, initialMessage: ChatMessage): Promise<string> {
    if (!userId) throw new Error("User ID is required.");
    const docRef = await addDoc(collection(db, `users/${userId}/conversations`), {
        messages: [initialMessage],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
    return docRef.id;
}

export async function addMessageToConversation(userId: string, conversationId: string, message: ChatMessage) {
    if (!userId || !conversationId) throw new Error("User ID and Conversation ID are required.");
    const docRef = doc(db, `users/${userId}/conversations/${conversationId}`);
    await updateDoc(docRef, {
        messages: arrayUnion(message),
        updatedAt: serverTimestamp(),
    });
}

export function listenToConversations(
    userId: string, 
    callback: (conversations: Conversation[]) => void, 
    onError: (error: FirestoreError) => void
): Unsubscribe {
    if (!userId) {
        onError({ code: 'invalid-argument', message: 'User ID is required.' } as FirestoreError);
        return () => {};
    }

    const q = query(collection(db, `conversations`), where("userId", "==", userId));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const conversations: Conversation[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            conversations.push({
                ...data,
                id: doc.id,
            } as Conversation);
        });
        conversations.sort((a, b) => {
            const timeA = a.lastMessageAt?.toMillis() || 0;
            const timeB = b.lastMessageAt?.toMillis() || 0;
            return timeB - timeA;
        });
        callback(conversations);
    }, (error) => {
        console.error("Error listening to conversations:", error);
        onError(error);
    });

    return unsubscribe;
}

export function listenToRecentReplies(
    userId: string, 
    callback: (replies: AiGeneratedReply[]) => void, 
    onError: (error: FirestoreError) => void
): Unsubscribe {
    if (!userId) {
        onError({ code: 'invalid-argument', message: 'User ID is required.' } as FirestoreError);
        return () => {};
    }

    const q = query(
        collection(db, 'ai_replies'), 
        where("userId", "==", userId), 
        orderBy("createdAt", "desc"), 
        limit(5)
    );

    return onSnapshot(q, (snapshot) => {
        const replies: AiGeneratedReply[] = [];
        snapshot.forEach(doc => {
            replies.push({ id: doc.id, ...doc.data() } as AiGeneratedReply);
        });
        callback(replies);
    }, onError);
}


// --- Analytics Listeners ---

export function listenToAnalyticsDaily(userId: string, days: number, callback: (data: DailyAnalytics[]) => void, onError: (error: FirestoreError) => void): Unsubscribe {
    if (!userId) {
        onError({ code: 'invalid-argument', message: 'User ID is required.' } as FirestoreError);
        return () => {};
    }
    const startDate = getUTCDateString(subDays(new Date(), days - 1));
    const q = query(
        collection(db, `users/${userId}/analytics/all-analytics/daily`),
        where('date', '>=', startDate),
        orderBy('date', 'desc')
    );
    
    return onSnapshot(q, (snapshot) => {
        const results: DailyAnalytics[] = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            // Calculate avg_latency_ms on read
            const avg_latency_ms = (data.sum_latency_ms && data.assistant_messages) 
                ? Math.round(data.sum_latency_ms / data.assistant_messages) 
                : 0;

            results.push({
                id: doc.id,
                ...data,
                avg_latency_ms
            } as DailyAnalytics);
        });
        callback(results);
    }, onError);
}

export function listenToAnalyticsRealtime(userId: string, callback: (data: RealtimeAnalytics | null) => void, onError: (error: FirestoreError) => void): Unsubscribe {
    if (!userId) {
        onError({ code: 'invalid-argument', message: 'User ID is required.' } as FirestoreError);
        return () => {};
    }
    const docRef = doc(db, `users/${userId}/analytics`, 'realtime');
    
    return onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
            callback({ id: doc.id, ...doc.data() } as RealtimeAnalytics);
        } else {
            callback(null); // Document might not exist yet
        }
    }, onError);
}
