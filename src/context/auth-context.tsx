
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
    let isMounted = true;
    let redirectResultProcessed = false;

    const processRedirectResult = async () => {
      // This block runs only once to process the redirect result from Google Sign-In
      try {
        const result = await getRedirectResult(auth);
        redirectResultProcessed = true;
        
        if (result && result.user && isMounted) {
          console.log("Redirect result user object:", result.user);
          setUser(result.user);
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
    };

    // First, process any pending redirect result.
    processRedirectResult();

    // Then, set up the listener for ongoing auth state changes.
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!isMounted) return;

      setUser(currentUser);
      
      // We can only stop loading after we know there's no pending redirect.
      // If we are still waiting for getRedirectResult, we keep loading.
      if (redirectResultProcessed) {
        setLoading(false);
      }
    });

    // Cleanup function to prevent memory leaks
    return () => {
      isMounted = false;
      unsubscribe();
    };
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
