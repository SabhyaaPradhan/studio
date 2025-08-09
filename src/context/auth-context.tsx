
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
    const processRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          // This means the user has just signed in via redirect.
          const loggedInUser = result.user;
          console.log("User session established from redirect:", loggedInUser);
          setUser(loggedInUser);
          toast({
            title: "Login Successful! 🎉",
            description: "Welcome back!",
          });
          // Redirect to home page after successful login from redirect
          router.push('/home');
          // We can set loading to false here because we have a user.
          setLoading(false);
          // Return true to indicate a redirect was handled.
          return true;
        }
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong during Google sign-in.",
          description: error.message,
        });
        setLoading(false);
      }
      // Return false if no redirect was handled.
      return false;
    };

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      // Check for redirect result first only on initial load
      if (loading) {
        const redirectHandled = await processRedirectResult();
        // If redirect was handled, currentUser from onAuthStateChanged might be stale.
        // The user state is already set inside processRedirectResult.
        // So we can skip the rest of the logic for this initial call.
        if (redirectHandled) {
          return;
        }
      }
      
      // If no redirect, or on subsequent auth state changes, just update the user.
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
    // The dependency array is empty to ensure this effect runs only once on mount.
  }, []);
  
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
