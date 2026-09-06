import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured, mockAuth } from '../services/supabaseClient';

const AuthContext = createContext(null);

const GUEST_STORAGE_KEY = 'projectvault_guest_mode';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isGuest, setIsGuest] = useState(() => {
    try {
      return localStorage.getItem(GUEST_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Initialize session on mount
  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      try {
        if (isSupabaseConfigured && supabase) {
          const { data: { session: existingSession }, error } = await supabase.auth.getSession();
          if (error) console.warn('Supabase getSession warning:', error.message);
          if (isMounted) {
            setSession(existingSession);
            setUser(existingSession?.user || null);
          }

          // Subscribe to Supabase auth events (login, logout, token refresh, OAuth redirect return)
          const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
            if (isMounted) {
              setSession(currentSession);
              setUser(currentSession?.user || null);
              if (currentSession?.user) {
                setIsGuest(false);
                try {
                  localStorage.removeItem(GUEST_STORAGE_KEY);
                } catch {}
              }
            }
          });

          return () => subscription.unsubscribe();
        } else {
          // Dev Mock Auth Mode
          const mockSession = mockAuth.getSession();
          if (isMounted) {
            setSession(mockSession);
            setUser(mockSession?.user || null);
          }
        }
      } catch (err) {
        console.error('Error during auth initialization:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    initAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const clearError = () => setAuthError(null);

  // Email Sign Up
  const signUp = async (email, password) => {
    setAuthError(null);
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: email.split('@')[0]
            }
          }
        });
        if (error) throw error;
        setSession(data.session);
        setUser(data.user);
        setIsGuest(false);
        try {
          localStorage.removeItem(GUEST_STORAGE_KEY);
        } catch {}
        return data;
      } else {
        const res = await mockAuth.signUp({ email, password });
        setUser(res.data.user);
        setSession(res.data.session);
        setIsGuest(false);
        try {
          localStorage.removeItem(GUEST_STORAGE_KEY);
        } catch {}
        return res.data;
      }
    } catch (err) {
      const msg = err?.message || 'An error occurred during sign up.';
      setAuthError(msg);
      throw err;
    }
  };

  // Email Sign In
  const signIn = async (email, password) => {
    setAuthError(null);
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        setSession(data.session);
        setUser(data.user);
        setIsGuest(false);
        try {
          localStorage.removeItem(GUEST_STORAGE_KEY);
        } catch {}
        return data;
      } else {
        const res = await mockAuth.signInWithPassword({ email, password });
        setUser(res.data.user);
        setSession(res.data.session);
        setIsGuest(false);
        try {
          localStorage.removeItem(GUEST_STORAGE_KEY);
        } catch {}
        return res.data;
      }
    } catch (err) {
      const msg = err?.message || 'Invalid email or password.';
      setAuthError(msg);
      throw err;
    }
  };

  // Google OAuth
  const signInWithGoogle = async () => {
    setAuthError(null);
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin
          }
        });
        if (error) throw error;
      } else {
        const res = await mockAuth.signInWithOAuth({ provider: 'google' });
        setUser(res.data.user);
        setSession(res.data.session);
        setIsGuest(false);
        try {
          localStorage.removeItem(GUEST_STORAGE_KEY);
        } catch {}
      }
    } catch (err) {
      const msg = err?.message || 'Failed to initialize Google sign in.';
      setAuthError(msg);
      throw err;
    }
  };

  // Sign Out
  const signOut = async () => {
    setAuthError(null);
    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.auth.signOut();
      } else {
        await mockAuth.signOut();
      }
    } catch (err) {
      console.warn('Sign out warning:', err);
    } finally {
      setUser(null);
      setSession(null);
      setIsGuest(false);
      try {
        localStorage.removeItem(GUEST_STORAGE_KEY);
      } catch {}
    }
  };

  // Guest Mode Bypass
  const continueAsGuest = () => {
    setIsGuest(true);
    try {
      localStorage.setItem(GUEST_STORAGE_KEY, 'true');
    } catch {}
  };

  const value = {
    user,
    session,
    isGuest,
    isLoading,
    authError,
    isSupabaseConfigured,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    continueAsGuest,
    clearError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
