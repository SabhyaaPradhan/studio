
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/context/auth-context';

export function useAuthRedirectToLogin() {
  const { user, loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    // Do not redirect while the auth state is still being determined.
    if (loading) {
      return;
    }
    
    // Only redirect if loading is complete and there is no user.
    if (!user) {
      router.push('/login');
    }
  }, [user, loading, router]);
}
