
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/context/auth-context';

export function useAuthRedirect() {
  const { user, loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      // This hook is no longer responsible for redirecting.
      // The redirect is now handled directly in the login/signup forms.
    }
  }, [user, loading, router]);
}
