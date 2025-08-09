
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
            if (result) {
                // This means the user has just signed in via redirect.
                console.log("Redirect result user:", result.user);
                setUser(result.user);
                toast({
                    title: "Login Successful! 🎉",
                    description: `Welcome back, ${result.user.displayName || 'friend'}!`,
                });
                router.push("/home");
                // We don't set loading to false here yet, we let the onAuthStateChanged handle it
            }
        } catch (error) {
            console.error("Error getting redirect result:", error);
            // Handle specific errors if needed
        }

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          // Check if it's a new user login (not just a state refresh)
          if (!user && currentUser) {
            console.log("User session established via onAuthStateChanged:", currentUser);
            toast({
              title: "Login Successful! 🎉",
              description: `Welcome back, ${currentUser.displayName || 'friend'}!`,
            });
            router.push("/home");
          }
          setUser(currentUser);
          setLoading(false);
        });
        
        // Return the unsubscribe function to be called on cleanup
        return unsubscribe;
    };

    processAuth();
    
  }, [router, toast]); // Removed `user` from dependency array to prevent re-running on user state change
  
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
