
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
    collectionGroup
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


// --- Functions ---

/**
 * Adds a new graph document to the user's 'graphs' subcollection.
 * @param userId The ID of the user creating the graph.
 * @param title The title of the graph.
 * @param data The dataset for the graph.
 * @returns The new document reference.
 */
export async function addGraph(userId: string, title: string, data: any) {
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
 * @returns An unsubscribe function to stop listening for updates.
 */
export function listenToGraphs(userId: string, callback: (graphs: Graph[]) => void) {
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
    });

    return unsubscribe;
}
