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
    arrayUnion
} from 'firebase/firestore';

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
    confidence?: number;
}

export interface Conversation {
    id: string; // Document ID
    messages: ChatMessage[];
    createdAt: Timestamp;
    updatedAt: Timestamp;
}


// --- Functions ---

/**
 * Adds a new graph document to the user's 'graphs' subcollection.
 * @param userId The ID of the user creating the graph.
 * @param title The title of the graph.
 * @param data The dataset for the graph.
 * @returns The new document reference.
 */
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

/**
 * Adds a new AI request document to the user's 'aiRequests' subcollection.
 * @param userId The ID of the user making the request.
 * @param input The input provided to the AI.
 * @param output The output received from the AI.
 * @returns The new document reference.
 */
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

/**
 * Listens for real-time updates to a user's graphs.
 * @param userId The ID of the user whose graphs to listen for.
 * @param callback A function to be called with the updated list of graphs.
 * @param onError A function to be called when an error occurs.
 * @returns An unsubscribe function to stop listening for updates.
 */
export function listenToGraphs(userId: string, callback: (graphs: Graph[]) => void, onError: (error: FirestoreError) => void): Unsubscribe {
    if (!userId) {
        onError({ code: 'invalid-argument', message: 'User ID is required.' } as FirestoreError);
        return () => {};
    }
    const q = query(collection(db, "users", userId, "graphs"));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const graphs: Graph[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data() as DocumentData;
            graphs.push({
                id: doc.id,
                title: data.title,
                data: data.data,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt
            } as Graph);
        });
        callback(graphs);
    }, (error) => {
        console.error("Error listening to graphs: ", error);
        onError(error);
    });

    return unsubscribe;
}

/**
 * Listens for real-time updates to a user's AI requests.
 * @param userId The ID of the user whose AI requests to listen for.
 * @param callback A function to be called with the updated list of AI requests.
 * @param onError A function to be called when an error occurs.
 * @returns An unsubscribe function to stop listening for updates.
 */
export function listenToAiRequests(userId: string, callback: (requests: AiRequest[]) => void, onError: (error: FirestoreError) => void): Unsubscribe {
    if (!userId) {
        onError({ code: 'invalid-argument', message: 'User ID is required.' } as FirestoreError);
        return () => {};
    }
    const q = query(collection(db, "users", userId, "aiRequests"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const requests: AiRequest[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data() as DocumentData;
            requests.push({
                id: doc.id,
                input: data.input,
                output: data.output,
                createdAt: data.createdAt
            } as AiRequest);
        });
        callback(requests);
    }, (error) => {
        console.error("Error listening to AI requests: ", error);
        onError(error);
    });

    return unsubscribe;
}

/**
 * Creates a new conversation document.
 * @param userId The ID of the user.
 * @param initialMessage The first message of the conversation.
 * @returns The ID of the newly created conversation.
 */
export async function createConversation(userId: string, initialMessage: ChatMessage): Promise<string> {
    if (!userId) throw new Error("User ID is required.");
    const docRef = await addDoc(collection(db, `users/${userId}/conversations`), {
        messages: [initialMessage],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
    return docRef.id;
}


/**
 * Adds a message to an existing conversation.
 * @param userId The ID of the user.
 * @param conversationId The ID of the conversation.
 * @param message The message to add.
 */
export async function addMessageToConversation(userId: string, conversationId: string, message: ChatMessage) {
    if (!userId || !conversationId) throw new Error("User ID and Conversation ID are required.");
    const docRef = doc(db, `users/${userId}/conversations/${conversationId}`);
    await updateDoc(docRef, {
        messages: arrayUnion(message),
        updatedAt: serverTimestamp(),
    });
}


/**
 * Listens for real-time updates to all conversations for a user.
 * @param userId The user's ID.
 * @param callback A function to be called with the updated list of conversations.
 * @param onError A function to be called on error.
 * @returns An unsubscribe function.
 */
export function listenToConversations(
    userId: string, 
    callback: (conversations: Conversation[]) => void, 
    onError: (error: FirestoreError) => void
): Unsubscribe {
    if (!userId) {
        onError({ code: 'invalid-argument', message: 'User ID is required.' } as FirestoreError);
        return () => {};
    }

    const q = query(collection(db, `users/${userId}/conversations`));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const conversations: Conversation[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data() as DocumentData;
            conversations.push({
                id: doc.id,
                messages: data.messages || [],
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
            } as Conversation);
        });
        // Sort by most recently updated
        conversations.sort((a, b) => b.updatedAt.toMillis() - a.updatedAt.toMillis());
        callback(conversations);
    }, (error) => {
        console.error("Error listening to conversations:", error);
        onError(error);
    });

    return unsubscribe;
}
