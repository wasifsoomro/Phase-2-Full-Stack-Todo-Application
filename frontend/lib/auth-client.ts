// Since the backend has its own authentication system, we'll use direct API calls
// This file is kept for compatibility but won't be used for the backend JWT auth
export const authClient = null;

// Direct API functions for authentication
export const directAuthAPI = {
  async login(credentials: { email: string; password: string }) {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || 'Login failed');
    }

    return await response.json();
  },

  async register(userData: { email: string; name: string; password: string }) {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || 'Registration failed');
    }

    return await response.json();
  },

  async getSession() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch('/api/auth/get-session', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get session');
    }

    return await response.json();
  },

  async logout() {
    // Clear the token from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }

    // Call the backend logout endpoint
    try {
      await fetch('/api/auth/sign-out', {
        method: 'POST',
      });
    } catch (error) {
      // Ignore logout errors as we're clearing the local token anyway
    }
  }
};