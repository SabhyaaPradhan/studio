
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/context/auth-context';

export function useAuthRedirectToLogin() {
  const { user, loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    // Wait until the authentication state is fully resolved.
    if (loading) {
      return;
    }
    
    // If loading is complete and there's no user, redirect to login.
    if (!user) {
      router.push('/login');
    }
  }, [user, loading, router]);
}
