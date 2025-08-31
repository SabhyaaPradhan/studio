
import { onSnapshot, doc, DocumentSnapshot, updateDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "@/lib/firebase"; 
import type { Timestamp, User } from "firebase/firestore";
import { updateProfile as updateAuthProfile } from "firebase/auth";


export type Plan = "starter" | "pro" | "enterprise";
export type SubscriptionStatus = "trialing" | "active" | "expired" | "canceled";

export interface Subscription {
  plan: Plan;
  status: SubscriptionStatus;
  trialStart: Date | null;
  trialEnd: Date | null;
  trialDaysLeft: number | null;
  isTrialExpired: boolean;
}

export interface UserProfile {
  uid: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  displayName: string | null;
  country?: string;
  subscription: Subscription | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

function toDate(value: any): Date | null {
  if (!value) return null;
  if (typeof value === "object" && "seconds" in value && "nanoseconds" in value) {
    const ts = value as Timestamp;
    return ts.toDate ? ts.toDate() : new Date(ts.seconds * 1000);
  }
  if (value instanceof Date) return value;
  if (typeof value === "string") {
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
}

function parseSubscription(raw: any): Subscription | null {
  if (!raw || typeof raw !== "object") return null;

  const plan = (raw.plan as Plan) || "starter";
  const status = (raw.status as SubscriptionStatus) || "trialing";

  const trialStart = toDate(raw.trialStart);
  const trialEnd = toDate(raw.trialEnd);

  let trialDaysLeft: number | null = null;
  let isTrialExpired = false;

  if (trialEnd) {
    const now = new Date();
    const msLeft = trialEnd.getTime() - now.getTime();
    trialDaysLeft = Math.max(0, Math.ceil(msLeft / (1000 * 60 * 60 * 24)));
    isTrialExpired = msLeft <= 0;
  }

  return {
    plan,
    status,
    trialStart,
    trialEnd,
    trialDaysLeft,
    isTrialExpired,
  };
}

export function docToProfile(snap: DocumentSnapshot): UserProfile {
  const data = snap.data() as any || {};

  const subscription = parseSubscription(data.subscription);

  return {
    uid: snap.id,
    first_name: typeof data.first_name === "string" ? data.first_name : null,
    last_name: typeof data.last_name === "string" ? data.last_name : null,
    email: typeof data.email === "string" ? data.email : null,
    displayName: typeof data.displayName === "string" ? data.displayName : null,
    country: typeof data.country === "string" ? data.country : undefined,
    subscription,
    createdAt: toDate(data.createdAt) ?? null,
    updatedAt: toDate(data.updatedAt) ?? null,
  };
}

export function listenToUser(
  uid: string,
  onData: (profile: UserProfile) => void,
  onError?: (err: any) => void
) {
  const ref = doc(db, "users", uid);

  return onSnapshot(
    ref,
    (snap) => {
      if (!snap.exists()) {
        onData({
          uid,
          first_name: null,
          last_name: null,
          email: null,
          displayName: null,
          subscription: null,
          createdAt: null,
          updatedAt: null,
        });
        return;
      }
      onData(docToProfile(snap));
    },
    (err) => {
      if (onError) onError(err);
      onData({
        uid,
        first_name: null,
        last_name: null,
        email: null,
        displayName: null,
        subscription: null,
        createdAt: null,
        updatedAt: null,
      });
    }
  );
}


/**
 * Updates a user's profile in both Firebase Auth and Firestore.
 * @param user The Firebase User object from Auth.
 * @param profileData The data to update.
 */
export async function updateUserProfile(user: User, profileData: Partial<UserProfile>) {
  if (!user) throw new Error("User must be authenticated to update profile.");

  const { displayName, ...firestoreData } = profileData;

  const updatePromises = [];

  // Update Firebase Auth profile if displayName is provided
  if (displayName) {
    updatePromises.push(updateAuthProfile(user, { displayName }));
  }

  // Update Firestore document
  const userDocRef = doc(db, "users", user.uid);
  const dataToUpdate = {
    ...firestoreData,
    displayName, // Also save displayName in Firestore for consistency
    updatedAt: serverTimestamp()
  };
  
  // Remove undefined fields to avoid Firestore errors
  Object.keys(dataToUpdate).forEach(key => {
    if ((dataToUpdate as any)[key] === undefined) {
      delete (dataToUpdate as any)[key];
    }
  });

  updatePromises.push(updateDoc(userDocRef, dataToUpdate));

  // Run all updates in parallel
  await Promise.all(updatePromises);
}
