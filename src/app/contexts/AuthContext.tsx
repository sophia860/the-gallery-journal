import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSupabaseClient } from '/src/utils/supabase/client';

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
        // Check for demo mode first
        const isDemoMode = typeof window !== 'undefined' && localStorage.getItem('demoMode') === 'true';
        
        if (isDemoMode) {
          const demoRole = localStorage.getItem('demoRole') || 'writer';
          console.log(`[AuthContext] Demo mode detected, creating demo ${demoRole}`);
          
          // Create a demo user with the selected role
          const demoUser: User = {
            id: 'demo-user',
            email: demoRole === 'editor' ? 'editor@page.com' : 'demo@page.com',
            user_metadata: {
              name: demoRole === 'editor' ? 'Demo Editor' : 'Demo Writer',
              role: demoRole,
              writerName: demoRole === 'editor' ? 'Demo Editor' : 'Demo Writer'
            }
          };
          setUser(demoUser);
          setAccessToken('demo-token');
          setLoading(false);
          return;
        }

        // Regular auth flow with error recovery
        let session = null;
        
        try {
          const { data } = await supabase.auth.getSession();
          session = data.session;
        } catch (error) {
          console.error('[AuthContext] Error getting session from Supabase:', error);
          
          // FIX #2 & #6: Try to recover session from localStorage if Supabase call fails
          if (typeof window !== 'undefined') {
            const storedAuth = localStorage.getItem('sb-page-gallery-auth');
            if (storedAuth) {
              try {
                const authData = JSON.parse(storedAuth);
                console.log('[AuthContext] Attempting session recovery from localStorage');
                
                // Try to restore the session
                if (authData.access_token && authData.refresh_token) {
                  const { data: recoveredSession, error: recoveryError } = await supabase.auth.setSession({
                    access_token: authData.access_token,
                    refresh_token: authData.refresh_token,
                  });
                  
                  if (!recoveryError && recoveredSession.session) {
                    console.log('[AuthContext] Session recovered successfully');
                    session = recoveredSession.session;
                  } else {
                    console.error('[AuthContext] Session recovery failed:', recoveryError);
                  }
                }
              } catch (parseError) {
                console.error('[AuthContext] Failed to parse stored auth data:', parseError);
              }
            }
          }
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
        
        // Don't override demo mode
        const isDemoMode = typeof window !== 'undefined' && localStorage.getItem('demoMode') === 'true';
        if (isDemoMode) {
          console.log('[AuthContext] Ignoring auth state change in demo mode');
          return;
        }
        
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
      
      // Persist session to localStorage as backup
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('sb-page-gallery-auth', JSON.stringify({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            user: data.user,
          }));
        } catch (e) {
          console.error('[AuthContext] Failed to backup session on signIn:', e);
        }
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

    // Now sign them in
    await signIn(email, password);
  };

  const signOut = async () => {
    // FIX #7: Clear ALL auth-related localStorage keys
    if (typeof window !== 'undefined') {
      console.log('[AuthContext] Clearing all auth-related storage');
      localStorage.removeItem('demoMode');
      localStorage.removeItem('demoRole');
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