
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuthContext } from './auth-context';
import { doc, onSnapshot, Unsubscribe, FirestoreError, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { UpgradeModal } from '@/components/common/upgrade-modal';

export interface Subscription {
  plan: 'starter' | 'pro' | 'enterprise';
  status: 'trialing' | 'active' | 'expired' | 'canceled';
  trialStart: string;
  trialEnd: string;
}

interface SubscriptionContextType {
  subscription: Subscription | null;
  loading: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  subscription: null,
  loading: true,
});

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuthContext();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const subRef = doc(db, 'users', user.uid);
    
    const unsubscribe: Unsubscribe = onSnapshot(subRef, async (docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data();
        let subData = userData.subscription as Subscription;

        if (subData) {
          // Check for trial expiration on load
          const now = new Date();
          const trialEnd = new Date(subData.trialEnd);
          
          if (subData.status === 'trialing' && now > trialEnd) {
            subData.status = 'expired';
            // Write the updated status back to Firestore
            try {
              await setDoc(subRef, { subscription: { status: 'expired' } }, { merge: true });
            } catch (error) {
              console.error("Failed to update subscription status:", error);
            }
          }
          setSubscription(subData);
          setIsModalOpen(subData.status === 'expired');
        } else {
            setSubscription(null); // No subscription field found
        }
      } else {
        setSubscription(null);
      }
      setLoading(false);
    }, (error: FirestoreError) => {
      console.error("Error listening to subscription:", error);
      setSubscription(null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <SubscriptionContext.Provider value={{ subscription, loading }}>
      {children}
      {isModalOpen && <UpgradeModal />}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
