/**
 * Strapi API Client for The Gallery Journal
 * Handles authentication, user management, and submission tracking
 * Backend: https://supportive-ducks-9506a8aa47.strapiapp.com
 */

const STRAPI_URL = 'https://supportive-ducks-9506a8aa47.strapiapp.com';
/** Cache duration for getMe results in milliseconds */
const ME_CACHE_TTL_MS = 60 * 1000;

class StrapiClient {
  constructor() {
    this.baseURL = STRAPI_URL;
    this._meCache = null;
    this._meCacheTime = 0;
    this.token = this.getToken();
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
    this._clearMeCache();
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
    localStorage.removeItem('user');
  }

  /**
   * Get current user profile
   */
  async getMe(useCache = true) {
    try {
      if (
        useCache &&
        this._meCache &&
        Date.now() - this._meCacheTime < ME_CACHE_TTL_MS
      ) {
        return this._meCache;
      }

      const response = await this.request('/api/users/me?populate=*');
      if (response && (typeof response.id === 'number' || typeof response.id === 'string')) {
        this._meCache = response;
        this._meCacheTime = Date.now();
      } else {
        this._clearMeCache();
      }
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch user profile: ${error.message}`);
    }
  }

  _clearMeCache() {
    this._meCache = null;
    this._meCacheTime = 0;
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
      const response = await this.request('/api/submissions?populate=*&filters[author][id][$eq]=' + 
        (await this.getMe()).id);
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
      await this.getMe(false);
      return true;
    } catch (error) {
      this.logout();
      return false;
    }
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
