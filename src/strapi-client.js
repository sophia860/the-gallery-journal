/**
 * Strapi API Client for The Gallery Journal
 * Handles authentication, user management, and submission tracking
 * Backend: https://supportive-ducks-9506a8aa47.strapiapp.com
 */

const STRAPI_URL = 'https://supportive-ducks-9506a8aa47.strapiapp.com';

class StrapiClient {
  constructor() {
    this.baseURL = STRAPI_URL;
    this.token = this.getToken();
    this.userCache = null;
    this.userCacheExpiry = null;
    this.userCacheTTL = 300000; // 5 minutes in milliseconds
  }

  /**
   * Get JWT token from localStorage
   */
  getToken() {
    return localStorage.getItem('strapi_jwt');
  }

  /**
   * Save JWT token to localStorage
   */
  setToken(token) {
    if (token) {
      localStorage.setItem('strapi_jwt', token);
      this.token = token;
    } else {
      localStorage.removeItem('strapi_jwt');
      this.token = null;
    }
  }

  /**
   * Make authenticated API request
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const config = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('Strapi API Error:', error);
      throw error;
    }
  }

  /**
   * Register a new user
   * @param {Object} userData - { username, email, password, role }
   */
  async register(userData) {
    try {
      const response = await this.request('/api/auth/local/register', {
        method: 'POST',
        body: JSON.stringify({
          username: userData.username,
          email: userData.email,
          password: userData.password,
        }),
      });

      if (response.jwt) {
        this.setToken(response.jwt);
        // Cache the user profile immediately
        this.userCache = response.user;
        this.userCacheExpiry = Date.now() + this.userCacheTTL;
      }

      return {
        user: response.user,
        jwt: response.jwt,
      };
    } catch (error) {
      throw new Error(`Registration failed: ${error.message}`);
    }
  }

  /**
   * Login user
   * @param {Object} credentials - { identifier, password }
   */
  async login(credentials) {
    try {
      const response = await this.request('/api/auth/local', {
        method: 'POST',
        body: JSON.stringify({
          identifier: credentials.identifier, // email or username
          password: credentials.password,
        }),
      });

      if (response.jwt) {
        this.setToken(response.jwt);
        // Cache the user profile immediately
        this.userCache = response.user;
        this.userCacheExpiry = Date.now() + this.userCacheTTL;
      }

      return {
        user: response.user,
        jwt: response.jwt,
      };
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  /**
   * Logout user
   */
  logout() {
    this.setToken(null);
    this.userCache = null;
    this.userCacheExpiry = null;
    localStorage.removeItem('user');
  }

  /**
   * Get current user profile (with caching)
   */
  async getMe() {
    // Check if we have a valid cached user
    if (this.userCache && this.userCacheExpiry && Date.now() < this.userCacheExpiry) {
      return this.userCache;
    }
    
    try {
      const response = await this.request('/api/users/me?populate=*');
      // Cache the user profile
      this.userCache = response;
      this.userCacheExpiry = Date.now() + this.userCacheTTL;
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch user profile: ${error.message}`);
    }
  }

  /**
   * Update user profile
   * @param {Object} profileData - { displayName, bio, profileImage, socialLinks }
   */
  async updateProfile(userId, profileData) {
    try {
      const response = await this.request(`/api/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(profileData),
      });
      // Invalidate cache after profile update
      this.userCache = null;
      this.userCacheExpiry = null;
      return response;
    } catch (error) {
      throw new Error(`Failed to update profile: ${error.message}`);
    }
  }

  /**
   * Create a new submission
   * @param {Object} submissionData - { title, body, status, etc. }
   */
  async createSubmission(submissionData) {
    try {
      const response = await this.request('/api/submissions', {
        method: 'POST',
        body: JSON.stringify({ data: submissionData }),
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create submission: ${error.message}`);
    }
  }

  /**
   * Get all submissions for current user
   */
  async getMySubmissions() {
    try {
      const me = await this.getMe();
      const response = await this.request(
        `/api/submissions?populate=*&filters[author][id][$eq]=${me.id}`
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch submissions: ${error.message}`);
    }
  }

  /**
   * Get a single submission by ID
   */
  async getSubmission(id) {
    try {
      const response = await this.request(`/api/submissions/${id}?populate=*`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch submission: ${error.message}`);
    }
  }

  /**
   * Update a submission
   */
  async updateSubmission(id, submissionData) {
    try {
      const response = await this.request(`/api/submissions/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ data: submissionData }),
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update submission: ${error.message}`);
    }
  }

  /**
   * Delete a submission
   */
  async deleteSubmission(id) {
    try {
      const response = await this.request(`/api/submissions/${id}`, {
        method: 'DELETE',
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to delete submission: ${error.message}`);
    }
  }

  /**
   * Auto-save draft
   * @param {Object} draftData - { id?, title, body, ... }
   */
  async saveDraft(draftData) {
    const submissionData = {
      ...draftData,
      status: 'draft',
      lastSaved: new Date().toISOString(),
    };

    if (draftData.id) {
      // Update existing draft
      return await this.updateSubmission(draftData.id, submissionData);
    } else {
      // Create new draft
      return await this.createSubmission(submissionData);
    }
  }

  /**
   * Get all drafts for current user
   */
  async getDrafts() {
    try {
      const me = await this.getMe();
      const response = await this.request(
        `/api/submissions?populate=*&filters[author][id][$eq]=${me.id}&filters[status][$eq]=draft`
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch drafts: ${error.message}`);
    }
  }

  /**
   * Submit a draft for review
   */
  async submitForReview(id) {
    return await this.updateSubmission(id, {
      status: 'submitted',
      submittedAt: new Date().toISOString(),
    });
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!this.token;
  }

  /**
   * Validate current token
   */
  async validateToken() {
    if (!this.isAuthenticated()) {
      return false;
    }

    try {
      await this.getMe();
      return true;
    } catch (error) {
      this.logout();
      return false;
    }
  }

  /**
   * Clear user cache (useful for forcing refresh)
   */
  clearUserCache() {
    this.userCache = null;
    this.userCacheExpiry = null;
  }
}

// Export singleton instance
const strapiClient = new StrapiClient();

// Make available globally for use in index.html
if (typeof window !== 'undefined') {
  window.strapiClient = strapiClient;
}

// Also export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = strapiClient;
}
