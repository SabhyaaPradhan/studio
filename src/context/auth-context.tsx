
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
    const processAuth = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result && result.user) {
          // User has just signed in via redirect.
          // The onAuthStateChanged listener below will handle setting the user state.
          // We can show the toast and redirect from here.
          toast({
            title: "Login Successful! 🎉",
            description: `Welcome back, ${result.user.displayName || 'friend'}!`,
          });
          router.push("/home");
        }
      } catch (error) {
        console.error("Error getting redirect result:", error);
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong with Google Sign-In.",
            description: "Please try again.",
        });
      } finally {
        // This is crucial. We only stop the main loading state
        // AFTER the redirect check is complete.
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
          setLoading(false);
        });
        
        // Cleanup the listener on component unmount
        return () => unsubscribe();
      }
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
