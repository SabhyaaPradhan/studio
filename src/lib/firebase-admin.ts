
import * as admin from 'firebase-admin';

// This file is for backend/server-side use ONLY.
// Do not import this into any client-side components.

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : undefined;

let app: admin.app.App;

if (!admin.apps.length) {
    if (serviceAccount) {
        app = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    } else {
        // Fallback for environments where service account might not be set,
        // though it's required for most backend operations.
        app = admin.initializeApp();
        console.warn("Firebase Admin SDK initialized without a service account. Some operations may fail.");
    }
} else {
    app = admin.app();
}

export { app };
