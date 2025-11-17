/**
 * API Client for Vehicle Breakdown Assistance
 * Handles all HTTP requests to the backend API
 */

const API_BASE_URL = window.API_BASE_URL || 'http://localhost:5000/api';

class APIClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('authToken');
  }

  /**
   * Get authorization headers
   */
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  /**
   * Generic HTTP request method
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      method: options.method || 'GET',
      headers: this.getHeaders(),
      ...options,
    };

    if (options.body) {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  /**
   * Authentication Endpoints
   */
  auth = {
    register: (data) => this.request('/auth/register', { method: 'POST', body: data }),
    login: (data) => this.request('/auth/login', { method: 'POST', body: data }),
    getCurrentUser: () => this.request('/auth/me'),
  };

  /**
   * Services Endpoints
   */
  services = {
    getAll: (filters = {}) => {
      const query = new URLSearchParams(filters).toString();
      return this.request(`/services${query ? '?' + query : ''}`);
    },
    getById: (id) => this.request(`/services/${id}`),
    create: (data) => this.request('/services', { method: 'POST', body: data }),
    update: (id, data) => this.request(`/services/${id}`, { method: 'PUT', body: data }),
    delete: (id) => this.request(`/services/${id}`, { method: 'DELETE' }),
  };

  /**
   * Bookings Endpoints
   */
  bookings = {
    create: (data) => this.request('/bookings', { method: 'POST', body: data }),
    getUserBookings: () => this.request('/bookings/user/bookings'),
    getByReference: (reference) => this.request(`/bookings/${reference}`),
    updateStatus: (id, status) => this.request(`/bookings/${id}/status`, {
      method: 'PATCH',
      body: { status },
    }),
    rate: (id, data) => this.request(`/bookings/${id}/rate`, { method: 'POST', body: data }),
  };

  /**
   * Admin Endpoints
   */
  admin = {
    getStats: () => this.request('/admin/stats'),
    getBookings: (filters = {}) => {
      const query = new URLSearchParams(filters).toString();
      return this.request(`/admin/bookings${query ? '?' + query : ''}`);
    },
    assignOperator: (bookingId, operatorId) =>
      this.request(`/admin/bookings/${bookingId}/assign`, {
        method: 'PATCH',
        body: { operatorId },
      }),
    getUsers: (filters = {}) => {
      const query = new URLSearchParams(filters).toString();
      return this.request(`/admin/users${query ? '?' + query : ''}`);
    },
    toggleUserStatus: (userId) =>
      this.request(`/admin/users/${userId}/toggle`, { method: 'PATCH' }),
    getRevenueAnalytics: (period = 'monthly') =>
      this.request(`/admin/analytics/revenue?period=${period}`),
  };

  /**
   * Set authentication token
   */
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  /**
   * Clear authentication
   */
  logout() {
    this.setToken(null);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!this.token;
  }
}

// Export global instance
window.apiClient = new APIClient();