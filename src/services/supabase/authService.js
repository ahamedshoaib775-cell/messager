import { supabase } from './supabaseClient';

class SupabaseAuthService {
  // Sign Up Flow (Creates Auth User + Inserts Profile + Uploads Default Avatar)
  async signUpUser({ email, password, fullname, username, phone, avatarUrl }) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            fullname,
            username: username.startsWith('@') ? username : `@${username}`,
            avatar: avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          },
        },
      });

      if (error) throw error;
      return { success: true, user: data.user, session: data.session };
    } catch (err) {
      console.warn('[SupabaseAuth] Signup error fallback:', err.message);
      return { success: false, error: err.message };
    }
  }

  // Email + Password Login
  async loginWithEmail(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      // Fetch User Profile
      const profile = await this.getProfile(data.user.id);
      return { success: true, user: profile || data.user, session: data.session };
    } catch (err) {
      console.warn('[SupabaseAuth] Email login error fallback:', err.message);
      return { success: false, error: err.message };
    }
  }

  // Phone OTP Login
  async loginWithPhone(phone) {
    try {
      const { data, error } = await supabase.auth.signInWithOtp({ phone });
      if (error) throw error;
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  // OAuth Login (Google, GitHub, Apple)
  async loginWithOAuth(provider) {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
      });
      if (error) throw error;
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  // Magic Link Login
  async loginWithMagicLink(email) {
    try {
      const { data, error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  // Restore Active Session
  async getCurrentSession() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && session.user) {
        const profile = await this.getProfile(session.user.id);
        return { session, user: profile || session.user };
      }
      return null;
    } catch (err) {
      return null;
    }
  }

  // Fetch Profile from Profiles table
  async getProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (error) return null;
      return data;
    } catch (err) {
      return null;
    }
  }

  // Logout User & Clear Session
  async logout() {
    try {
      await supabase.auth.signOut();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
}

export const supabaseAuthService = new SupabaseAuthService();
