
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
    // This flag prevents the redirect logic from firing multiple times.
    let isRedirecting = false;

    const processAuth = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result && !isRedirecting) {
          isRedirecting = true;
          // This means the user has just signed in via redirect.
          const loggedInUser = result.user;
          console.log("Redirect result user:", loggedInUser);
          setUser(loggedInUser);
          toast({
            title: "Login Successful! 🎉",
            description: `Welcome back, ${loggedInUser.displayName || 'friend'}!`,
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
      }

      // onAuthStateChanged is the primary listener for auth state.
      // It handles initial session checks and changes from other tabs.
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (!isRedirecting) {
            setUser(currentUser);
        }
        setLoading(false);
      });

      // Cleanup the listener on component unmount
      return unsubscribe;
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
