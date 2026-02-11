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
        // FIX #2: Don't clear state on error - keep existing state if any
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // FIX #1, #3, #4: Listen for auth state changes with proper event handling
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('[AuthContext] Auth state change:', event, session ? 'session exists' : 'no session');
        
        // FIX #1: Handle events explicitly - NEVER clear user unless SIGNED_OUT
        switch (event) {
          case 'SIGNED_IN':
            console.log('[AuthContext] User signed in');
            if (session) {
              setUser(session.user);
              setAccessToken(session.access_token);
              
              // FIX #4: Persist session to localStorage as backup
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
            // FIX #1: Always restore session on token refresh
            if (session) {
              setUser(session.user);
              setAccessToken(session.access_token);
              
              // Update localStorage backup
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
            // FIX #1: Always restore session on initial load
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
              // Don't update token on user update
            }
            break;
            
          default:
            console.log('[AuthContext] Unhandled auth event:', event);
            // FIX #1: For any other event, only update if we have a valid session
            // NEVER clear user state unless explicitly signed out
            if (session) {
              setUser(session.user);
              setAccessToken(session.access_token);
            }
            setLoading(false);
        }
      }
    );

    // FIX #3: Properly clean up subscription
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
      throw error; // Properly throw the error to the caller
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

    // Try to sign them in
    try {
      await signIn(email, password);
      console.log('[AuthContext] Sign in after signup successful');
    } catch (signInError: any) {
      console.error('[AuthContext] Sign in after signup failed:', signInError);
      console.log('[AuthContext] Trying client-side session creation as fallback...');
      
      // If signIn fails, try creating a client-side session with signUp
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (sessionError) {
          console.error('[AuthContext] Client-side signUp fallback failed:', sessionError);
          // Don't throw - just log and let redirect to login happen
        } else if (sessionData.session) {
          console.log('[AuthContext] Client-side session created successfully');
          setUser(sessionData.user);
          setAccessToken(sessionData.session.access_token);
          
          // Persist session to localStorage
          if (typeof window !== 'undefined') {
            try {
              localStorage.setItem('sb-page-gallery-auth', JSON.stringify({
                access_token: sessionData.session.access_token,
                refresh_token: sessionData.session.refresh_token,
                user: sessionData.user,
              }));
              console.log('[AuthContext] Session persisted to localStorage');
            } catch (e) {
              console.error('[AuthContext] Failed to persist session:', e);
            }
          }
        } else {
          console.log('[AuthContext] No session from client-side signUp, user may need to sign in manually');
        }
      } catch (fallbackError) {
        console.error('[AuthContext] Unexpected error in signUp fallback:', fallbackError);
        // Don't throw - just log and let redirect to login happen
      }
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
    // Gracefully return a default context to prevent crashes
    // This can happen during initial render before AuthProvider mounts
    return {
      user: null,
      accessToken: null,
      loading: true, // Keep loading true so components wait
      supabase,
      signIn: async () => { throw new Error('Auth not initialized'); },
      signUp: async () => { throw new Error('Auth not initialized'); },
      signOut: async () => { throw new Error('Auth not initialized'); },
    };
  }
  return context;
}