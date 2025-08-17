
'use client';

import { useEffect, useState } from "react";
import { listenToUser, type Subscription, type UserProfile } from "@/services/user-service";
import { useAuthContext } from "@/context/auth-context";

export function useSubscription() {
  const { user } = useAuthContext();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (!user?.uid) {
      setIsLoading(false);
      setSubscription(null);
      return;
    }

    const unsub = listenToUser(
      user.uid,
      (profile: UserProfile) => {
        setSubscription(profile.subscription);
        setIsLoading(false); 
      },
      (err: any) => {
        setError(err);
        setIsLoading(false);
      }
    );

    return () => unsub();
  }, [user?.uid]);

  return { isLoading, subscription, error };
}
