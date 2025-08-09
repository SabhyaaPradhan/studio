
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/context/auth-context';

export function useAuthRedirect() {
  const { user, loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    // Do not redirect while the auth state is still being determined.
    if (loading) {
      return;
    }

    // If loading is finished and there IS a user, redirect them away from auth pages
    if (user) {
      router.push('/home');
    }
  }, [user, loading, router]);
}
