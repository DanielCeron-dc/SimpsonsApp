import AsyncStorage from '@react-native-async-storage/async-storage';
import {User, AuthSession, AuthCredentials} from '../types';

class AuthStorageService {
  private readonly USERS_KEY = '@simpsons_app:users';
  private readonly SESSION_KEY = '@simpsons_app:session';

  async register(credentials: AuthCredentials): Promise<User> {
    try {
      const users = await this.getAllUsers();
      const existingUser = users.find(u => u.email === credentials.email);

      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      const newUser: User = {
        id: this.generateId(),
        email: credentials.email,
        createdAt: new Date().toISOString(),
      };

      const userWithPassword = {
        ...newUser,
        passwordHash: this.simpleHash(credentials.password),
      };

      users.push(userWithPassword);
      await AsyncStorage.setItem(this.USERS_KEY, JSON.stringify(users));

      return newUser;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }

  async login(credentials: AuthCredentials): Promise<AuthSession> {
    try {
      const users = await this.getAllUsers();
      const user = users.find(
        u =>
          u.email === credentials.email &&
          u.passwordHash === this.simpleHash(credentials.password),
      );

      if (!user) {
        throw new Error('Invalid email or password');
      }

      const session: AuthSession = {
        user: {
          id: user.id,
          email: user.email,
          createdAt: user.createdAt,
        },
        token: this.generateToken(),
      };

      await AsyncStorage.setItem(this.SESSION_KEY, JSON.stringify(session));

      return session;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }


  async logout(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.SESSION_KEY);
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  }

  async getSession(): Promise<AuthSession | null> {
    try {
      const sessionData = await AsyncStorage.getItem(this.SESSION_KEY);
      return sessionData ? JSON.parse(sessionData) : null;
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    const session = await this.getSession();
    return session !== null;
  }

  private async getAllUsers(): Promise<any[]> {
    try {
      const usersData = await AsyncStorage.getItem(this.USERS_KEY);
      return usersData ? JSON.parse(usersData) : [];
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  private generateToken(): string {
    return `token-${Date.now()}-${Math.random().toString(36).substring(2, 16)}`;
  }

  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return hash.toString(36);
  }
}

export default new AuthStorageService();
