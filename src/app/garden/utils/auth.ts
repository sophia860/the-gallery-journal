// Auth system for The Garden
import { storage } from './storage';

export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  bio: string;
  joinedDate: string;
  isGuest?: boolean;
}

const USERS_KEY = 'garden_users';
const CURRENT_USER_KEY = 'garden_current_user';

export const authService = {
  // Get all users
  getUsers: (): User[] => {
    return storage.get<User[]>(USERS_KEY) || [];
  },

  // Get current user
  getCurrentUser: (): User | null => {
    return storage.get<User>(CURRENT_USER_KEY);
  },

  // Check if logged in
  isAuthenticated: (): boolean => {
    return !!authService.getCurrentUser();
  },

  // Sign up new user
  signup: (username: string, email: string, displayName: string, bio: string = ''): { success: boolean; user?: User; error?: string } => {
    const users = authService.getUsers();
    
    // Check if username or email already exists
    if (users.some(u => u.username === username)) {
      return { success: false, error: 'Username already exists' };
    }
    if (users.some(u => u.email === email)) {
      return { success: false, error: 'Email already exists' };
    }

    const newUser: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      username,
      email,
      displayName,
      bio,
      joinedDate: new Date().toISOString(),
      isGuest: false
    };

    users.push(newUser);
    storage.set(USERS_KEY, users);
    storage.set(CURRENT_USER_KEY, newUser);

    return { success: true, user: newUser };
  },

  // Login user
  login: (username: string, email: string): { success: boolean; user?: User; error?: string } => {
    const users = authService.getUsers();
    const user = users.find(u => u.username === username && u.email === email);

    if (!user) {
      return { success: false, error: 'Invalid credentials' };
    }

    storage.set(CURRENT_USER_KEY, user);
    return { success: true, user };
  },

  // Create guest user
  createGuestUser: (): User => {
    const guestUser: User = {
      id: `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      username: `Guest_${Math.random().toString(36).substr(2, 6)}`,
      email: '',
      displayName: 'Guest Writer',
      bio: 'Exploring The Garden',
      joinedDate: new Date().toISOString(),
      isGuest: true
    };

    storage.set(CURRENT_USER_KEY, guestUser);
    return guestUser;
  },

  // Logout
  logout: (): void => {
    storage.remove(CURRENT_USER_KEY);
  },

  // Update user profile
  updateProfile: (updates: Partial<User>): { success: boolean; user?: User; error?: string } => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      return { success: false, error: 'Not authenticated' };
    }

    const users = authService.getUsers();
    const userIndex = users.findIndex(u => u.id === currentUser.id);

    if (userIndex === -1) {
      return { success: false, error: 'User not found' };
    }

    const updatedUser = { ...currentUser, ...updates, id: currentUser.id };
    users[userIndex] = updatedUser;
    
    storage.set(USERS_KEY, users);
    storage.set(CURRENT_USER_KEY, updatedUser);

    return { success: true, user: updatedUser };
  }
};
