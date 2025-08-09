
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User, getRedirectResult } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    let isMounted = true; // Prevent state updates on unmounted component

    const processAuth = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result && result.user && isMounted) {
          // This means a user has just signed in via redirect.
          // The onAuthStateChanged listener below will handle setting the user state.
          // We can show the toast and redirect from here.
          console.log("Redirect result user object:", result.user);
          toast({
            title: "Login Successful! 🎉",
            description: `Welcome back, ${result.user.displayName || 'friend'}!`,
          });
          router.push("/home");
        }
      } catch (error: any) {
        console.error("Error processing redirect result:", error);
        toast({
            variant: "destructive",
            title: "Uh oh! Login failed.",
            description: "There was a problem with the sign-in process. Please try again.",
        });
      }

      // After processing the redirect, set up the regular auth state listener.
      // This listener handles all other cases, like an existing session on page load.
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (isMounted) {
          setUser(currentUser);
          // We are done loading only after the listener has fired its initial value.
          setLoading(false);
        }
      });

      return () => {
        isMounted = false;
        unsubscribe();
      };
    };

    processAuth();
    
  }, [router, toast]);
  
  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
