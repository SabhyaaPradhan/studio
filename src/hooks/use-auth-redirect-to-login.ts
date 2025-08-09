
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/context/auth-context';

export function useAuthRedirectToLogin() {
  const { user, loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if the initial loading is complete and there is no user.
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);
}
