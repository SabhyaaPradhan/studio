
import { app } from '@/lib/firebase';
import { 
    getFirestore, 
    collection, 
    addDoc, 
    serverTimestamp, 
    query, 
    where, 
    onSnapshot,
    Timestamp,
    DocumentData
} from 'firebase/firestore';

const db = getFirestore(app);

// --- Types ---

export interface Graph {
    id: string; // Document ID
    userId: string;
    title: string;
    data: any; // object or array for graph dataset
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface AiRequest {
    id: string; // Document ID
    userId: string;
    input: string | object;
    output: string | object;
    createdAt: Timestamp;
}


// --- Functions ---

/**
 * Adds a new graph document to the 'graphs' collection for a specific user.
 * @param userId The ID of the user creating the graph.
 * @param title The title of the graph.
 * @param data The dataset for the graph.
 * @returns The new document reference.
 */
export async function addGraph(userId: string, title: string, data: any) {
    try {
        const docRef = await addDoc(collection(db, "graphs"), {
            userId: userId,
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
 * Adds a new AI request document to the 'aiRequests' collection for a specific user.
 * @param userId The ID of the user making the request.
 * @param input The input provided to the AI.
 * @param output The output received from the AI.
 * @returns The new document reference.
 */
export async function addAiRequest(userId: string, input: string | object, output: string | object) {
    try {
        const docRef = await addDoc(collection(db, "aiRequests"), {
            userId: userId,
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
 * @returns An unsubscribe function to stop listening for updates.
 */
export function listenToGraphs(userId: string, callback: (graphs: Graph[]) => void) {
    const q = query(collection(db, "graphs"), where("userId", "==", userId));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const graphs: Graph[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data() as DocumentData;
            graphs.push({
                id: doc.id,
                userId: data.userId,
                title: data.title,
                data: data.data,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt
            } as Graph);
        });
        callback(graphs);
    }, (error) => {
        console.error("Error listening to graphs: ", error);
    });

    return unsubscribe;
}

/**
 * Listens for real-time updates to a user's AI requests.
 * @param userId The ID of the user whose AI requests to listen for.
 * @param callback A function to be called with the updated list of AI requests.
 * @returns An unsubscribe function to stop listening for updates.
 */
export function listenToAiRequests(userId: string, callback: (requests: AiRequest[]) => void) {
    const q = query(collection(db, "aiRequests"), where("userId", "==", userId));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const requests: AiRequest[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data() as DocumentData;
            requests.push({
                id: doc.id,
                userId: data.userId,
                input: data.input,
                output: data.output,
                createdAt: data.createdAt
            } as AiRequest);
        });
        callback(requests);
    }, (error) => {
        console.error("Error listening to AI requests: ", error);
    });

    return unsubscribe;
}
