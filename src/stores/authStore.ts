import {create} from 'zustand';
import {User, AuthCredentials} from '../types';
import authStorageService from '../services/authStorageService';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;

  login: (credentials: AuthCredentials) => Promise<void>;
  register: (credentials: AuthCredentials) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,

  login: async (credentials: AuthCredentials) => {
    set({isLoading: true, error: null});
    try {
      const session = await authStorageService.login(credentials);
      set({
        user: session.user,
        token: session.token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Login failed',
        isLoading: false,
      });
      throw error;
    }
  },

  register: async (credentials: AuthCredentials) => {
    set({isLoading: true, error: null});
    try {
      const user = await authStorageService.register(credentials);
      const session = await authStorageService.login(credentials);
      set({
        user: session.user,
        token: session.token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Registration failed',
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      await authStorageService.logout();
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        error: null,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Logout failed',
      });
    }
  },

  checkAuth: async () => {
    set({isLoading: true});
    try {
      const session = await authStorageService.getSession();
      if (session) {
        set({
          user: session.user,
          token: session.token,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({isLoading: false});
      }
    } catch (error) {
      set({isLoading: false});
    }
  },

  clearError: () => set({error: null}),
}));
