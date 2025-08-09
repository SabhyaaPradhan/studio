
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
    // This function will be called once when the component mounts.
    const processAuth = async () => {
        // We start by assuming we are loading, and will set it to false
        // after all auth checks are complete.
        setLoading(true);

        try {
            // Check if the user is coming back from a Google Sign-In redirect
            const result = await getRedirectResult(auth);
            if (result) {
                // User successfully signed in with Google redirect.
                const loggedInUser = result.user;
                console.log("User session established from redirect:", loggedInUser);
                setUser(loggedInUser);
                toast({
                    title: "Login Successful! 🎉",
                    description: "Welcome back!",
                });
                // Redirect to the main authenticated page
                router.push('/home');
                // We can stop here since we've handled the redirect user
                setLoading(false);
                return;
            }
        } catch (error: any) {
             toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong during Google sign-in.",
                description: error.message,
            });
        }
        
        // If there was no redirect result, we set up the regular auth state listener.
        // This will handle users who are already logged in or log in with email/password.
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            // We are done with all auth checks, so we can stop loading.
            setLoading(false);
        });

        // The returned function will be called when the component unmounts.
        return () => unsubscribe();
    };

    processAuth();
    
    // We only want this effect to run once on mount.
  }, [toast, router]);
  
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
