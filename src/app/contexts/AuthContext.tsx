import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSupabaseClient } from '/src/utils/supabase/client';
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
  supabase: ReturnType<typeof getSupabaseClient>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, writerName: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Use the shared Supabase client
const supabase = getSupabaseClient();

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log('[AuthContext] Starting auth initialization');
        
        // Get existing session from Supabase
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('[AuthContext] Error getting session:', error);
          setUser(null);
          setLoading(false);
          return;
        }
        
        if (session) {
          console.log('[AuthContext] Session found, setting user');
          setUser(session.user);
          setAccessToken(session.access_token);
        } else {
          console.log('[AuthContext] No session found');
        }
      } catch (error) {
        console.error('[AuthContext] Fatal error in initAuth:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth state changes with proper event handling
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('[AuthContext] Auth state change:', event, session ? 'session exists' : 'no session');
        
        switch (event) {
          case 'SIGNED_IN':
            console.log('[AuthContext] User signed in');
            if (session) {
              setUser(session.user);
              setAccessToken(session.access_token);
              
              if (typeof window !== 'undefined') {
                try {
                  localStorage.setItem('sb-page-gallery-auth', JSON.stringify({
                    access_token: session.access_token,
                    refresh_token: session.refresh_token,
                    user: session.user,
                  }));
                  console.log('[AuthContext] Session backed up to localStorage');
                } catch (e) {
                  console.error('[AuthContext] Failed to backup session:', e);
                }
              }
            }
            setLoading(false);
            break;
            
          case 'SIGNED_OUT':
            console.log('[AuthContext] User signed out');
            setUser(null);
            setAccessToken(null);
            setLoading(false);
            break;
            
          case 'TOKEN_REFRESHED':
            console.log('[AuthContext] Token refreshed');
            if (session) {
              setUser(session.user);
              setAccessToken(session.access_token);
              
              if (typeof window !== 'undefined') {
                try {
                  localStorage.setItem('sb-page-gallery-auth', JSON.stringify({
                    access_token: session.access_token,
                    refresh_token: session.refresh_token,
                    user: session.user,
                  }));
                } catch (e) {
                  console.error('[AuthContext] Failed to update session backup:', e);
                }
              }
            }
            setLoading(false);
            break;
            
          case 'INITIAL_SESSION':
            console.log('[AuthContext] Initial session loaded');
            if (session) {
              setUser(session.user);
              setAccessToken(session.access_token);
            }
            setLoading(false);
            break;
            
          case 'USER_UPDATED':
            console.log('[AuthContext] User data updated');
            if (session) {
              setUser(session.user);
            }
            break;
            
          default:
            console.log('[AuthContext] Unhandled auth event:', event);
            if (session) {
              setUser(session.user);
              setAccessToken(session.access_token);
            }
            setLoading(false);
        }
      }
    );

    return () => {
      console.log('[AuthContext] Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('[AuthContext] Attempting sign in...');
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('[AuthContext] Sign in error:', error);
      throw error;
    }

    if (!data.session) {
      console.error('[AuthContext] No session returned after sign in');
      throw new Error('No session returned from sign in');
    }

    console.log('[AuthContext] Sign in successful');
    setUser(data.user);
    setAccessToken(data.session.access_token);
    
    // Persist session to localStorage as backup
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('sb-page-gallery-auth', JSON.stringify({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          user: data.user,
        }));
        console.log('[AuthContext] Session persisted to localStorage');
      } catch (e) {
        console.error('[AuthContext] Failed to backup session on signIn:', e);
      }
    }
  };

  const signUp = async (email: string, password: string, name: string, writerName: string) => {
    // Step 1: Create the user on the server
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

    console.log('[AuthContext] User created on server, attempting to sign in...');
    
    // Step 2: Sign them in immediately after account creation
    // FIX: Always sign in after signup - this establishes the Supabase session
    try {
      await signIn(email, password);
      console.log('[AuthContext] Sign in after signup successful - session established');
      
      // FIX: Verify session is actually established before returning
      const { data: sessionCheck } = await supabase.auth.getSession();
      if (!sessionCheck.session) {
        console.warn('[AuthContext] Session check after signup sign-in found no session, waiting...');
        // Give Supabase a moment to propagate the session
        await new Promise(resolve => setTimeout(resolve, 500));
        const { data: retryCheck } = await supabase.auth.getSession();
        if (retryCheck.session) {
          console.log('[AuthContext] Session confirmed after retry');
          setUser(retryCheck.session.user);
          setAccessToken(retryCheck.session.access_token);
        } else {
          console.error('[AuthContext] Session still not found after retry');
          throw new Error('Session could not be established after signup. Please try signing in manually.');
        }
      } else {
        console.log('[AuthContext] Session confirmed after signup');
      }
    } catch (signInError: any) {
      console.error('[AuthContext] Sign in after signup failed:', signInError);
      // Re-throw with a helpful message so the UI can handle it
      throw new Error(
        signInError.message || 'Account created but auto-login failed. Please sign in manually.'
      );
    }
  };

  const signOut = async () => {
    // Clear auth-related localStorage keys
    if (typeof window !== 'undefined') {
      console.log('[AuthContext] Clearing auth-related storage');
      localStorage.removeItem('sb-page-gallery-auth');
      
      // Clear any other Supabase storage keys
      const allKeys = Object.keys(localStorage);
      allKeys.forEach(key => {
        if (key.startsWith('sb-') || key.includes('supabase')) {
          localStorage.removeItem(key);
        }
      });
    }
    
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
    return {
      user: null,
      accessToken: null,
      loading: true,
      supabase,
      signIn: async () => { throw new Error('Auth not initialized'); },
      signUp: async () => { throw new Error('Auth not initialized'); },
      signOut: async () => { throw new Error('Auth not initialized'); },
    };
  }
  return context;
}
