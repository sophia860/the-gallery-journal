import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '/utils/supabase/info';

interface User {
  id: string;
  email?: string;
  user_metadata?: {
    name?: string;
    role?: string;
    writerName?: string;
  };
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  supabase: typeof supabase;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, writerName: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setUser(session.user);
          setAccessToken(session.access_token);
        }
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setAccessToken(session?.access_token ?? null);
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (data.session) {
      setUser(data.user);
      setAccessToken(data.session.access_token);
    }
  };

  const signUp = async (email: string, password: string, name: string, writerName: string) => {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-07dc516a/auth/signup`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ email, password, name, writerName }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to sign up');
    }

    // Now sign them in
    await signIn(email, password);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setAccessToken(null);
  };

  const value = {
    user,
    accessToken,
    loading,
    supabase,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    console.error('useAuth must be used within an AuthProvider. Make sure your component is wrapped in <AuthProvider>');
    // Return a default context to prevent crashes
    return {
      user: null,
      accessToken: null,
      loading: false,
      supabase,
      signIn: async () => { throw new Error('Auth not initialized'); },
      signUp: async () => { throw new Error('Auth not initialized'); },
      signOut: async () => { throw new Error('Auth not initialized'); },
    };
  }
  return context;
}