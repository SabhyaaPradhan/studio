
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
        setLoading(true);
        try {
            const result = await getRedirectResult(auth);
            if (result) {
                const loggedInUser = result.user;
                setUser(loggedInUser);
                toast({
                    title: "Login Successful! 🎉",
                    description: "Welcome back!",
                });
                router.push('/home');
            }
        } catch (error: any) {
             toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: error.message,
            });
        } finally {
            // This runs regardless of whether there was a redirect result or not
            // The onAuthStateChanged listener below will handle setting the final state
        }
    };

    processRedirectResult();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        setUser(currentUser);
        setLoading(false);
    });

    return () => unsubscribe();
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
