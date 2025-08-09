
'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
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
  const isProcessingRedirect = useRef(false);

  useEffect(() => {
    // This function will run once on component mount
    const processAuth = async () => {
      // Prevent running the redirect check multiple times
      if (isProcessingRedirect.current) return;
      isProcessingRedirect.current = true;
      
      try {
        const result = await getRedirectResult(auth);
        // If the user has just signed in via redirect, `result` will be populated
        if (result && result.user) {
          console.log("Redirect result user object:", result.user);
          // Set user state immediately to avoid race conditions with the listener
          setUser(result.user);
          toast({
            title: "Login Successful! 🎉",
            description: `Welcome back, ${result.user.displayName || 'friend'}!`,
          });
          // Redirect to the main app page
          router.push("/home");
        }
      } catch (error: any) {
        console.error("Error processing redirect result:", error);
        toast({
            variant: "destructive",
            title: "Uh oh! Login failed.",
            description: "There was a problem with the sign-in process. Please try again.",
        });
      } finally {
        // Now that the redirect has been processed (or there was none),
        // we can safely set up the normal listener and finalize loading.
        
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
          // The auth state is now definitive, so we can stop loading.
          setLoading(false);
        });
        
        // Return the unsubscribe function for cleanup
        return unsubscribe;
      }
    };

    const unsubscribePromise = processAuth();

    return () => {
      // Cleanup function to unsubscribe from the onAuthStateChanged listener
      unsubscribePromise.then(unsubscribe => {
        if (unsubscribe) {
          unsubscribe();
        }
      });
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
