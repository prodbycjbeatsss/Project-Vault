import { createClient } from '@supabase/supabase-js';

const env = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : {};
const supabaseUrl = env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || '';

// Check if valid credentials are present (not placeholder template values)
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('your-project') &&
  !supabaseAnonKey.includes('your-anon-key')
);

// Create Supabase client with PKCE OAuth flow if keys exist
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        flowType: 'pkce',
        detectSessionInUrl: true,
        persistSession: true,
        autoRefreshToken: true
      }
    })
  : null;

// Lightweight mock provider for local development without live credentials
const MOCK_STORAGE_KEY = 'projectvault_mock_auth_session';

export const mockAuth = {
  getSession: () => {
    try {
      const data = localStorage.getItem(MOCK_STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
  signUp: async ({ email, password }) => {
    await new Promise((r) => setTimeout(r, 450));
    if (!email || !password) throw new Error('Email and password are required.');
    if (password.length < 6) throw new Error('Password must be at least 6 characters.');
    
    const user = {
      id: `mock-user-${Date.now()}`,
      email,
      user_metadata: {
        full_name: email.split('@')[0],
        avatar_url: `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(email)}`
      }
    };
    const session = { access_token: `mock-token-${Date.now()}`, user };
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(session));
    }
    return { data: { user, session }, error: null };
  },
  signInWithPassword: async ({ email, password }) => {
    await new Promise((r) => setTimeout(r, 450));
    if (!email || !password) throw new Error('Email and password are required.');
    
    const user = {
      id: `mock-user-${email.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      email,
      user_metadata: {
        full_name: email.split('@')[0],
        avatar_url: `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(email)}`
      }
    };
    const session = { access_token: `mock-token-${Date.now()}`, user };
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(session));
    }
    return { data: { user, session }, error: null };
  },
  signInWithOAuth: async ({ provider }) => {
    await new Promise((r) => setTimeout(r, 500));
    const user = {
      id: `mock-oauth-${provider}-${Date.now()}`,
      email: `creator@${provider}.com`,
      user_metadata: {
        full_name: `Google Creator`,
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
      }
    };
    const session = { access_token: `mock-oauth-token-${Date.now()}`, user };
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(session));
    }
    return { data: { user, session }, error: null };
  },
  signOut: async () => {
    await new Promise((r) => setTimeout(r, 200));
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(MOCK_STORAGE_KEY);
    }
    return { error: null };
  }
};
