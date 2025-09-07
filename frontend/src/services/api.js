const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE}${endpoint}`;
  const token = getAuthToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    // Handle empty responses
    const text = await response.text();
    if (!text) return null;
    
    return JSON.parse(text);
  } catch (error) {
    console.error(`API Error for ${endpoint}:`, error);
    throw error;
  }
};

// Restaurant services
export const restaurantService = {
  getAll: async (category = null, search = null) => {
    let endpoint = '/restaurants';
    const params = new URLSearchParams();
    
    if (category && category !== 'all') {
      params.append('category', category);
    }
    if (search) {
      params.append('search', search);
    }
    
    if (params.toString()) {
      endpoint += `?${params.toString()}`;
    }
    
    return apiRequest(endpoint);
  },

  getById: async (id) => {
    return apiRequest(`/restaurants/${id}`);
  },

  getMenu: async (restaurantId) => {
    return apiRequest(`/restaurants/${restaurantId}/menu`);
  },

  create: async (restaurantData) => {
    return apiRequest('/restaurants', {
      method: 'POST',
      body: JSON.stringify(restaurantData),
    });
  },

  update: async (id, restaurantData) => {
    return apiRequest(`/restaurants/${id}`, {
      method: 'PUT',
      body: JSON.stringify(restaurantData),
    });
  },

  delete: async (id) => {
    return apiRequest(`/restaurants/${id}`, {
      method: 'DELETE',
    });
  },
};

// Category services
export const categoryService = {
  getAll: async () => {
    return apiRequest('/categories');
  },

  create: async (categoryData) => {
    return apiRequest('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  },
};

// User services
export const userService = {
  register: async (userData) => {
    const response = await apiRequest('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    // Store token
    if (response.access_token) {
      localStorage.setItem('auth_token', response.access_token);
    }
    
    return response;
  },

  login: async (credentials) => {
    const response = await apiRequest('/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    // Store token
    if (response.access_token) {
      localStorage.setItem('auth_token', response.access_token);
    }
    
    return response;
  },

  logout: () => {
    localStorage.removeItem('auth_token');
  },

  getProfile: async () => {
    return apiRequest('/users/profile');
  },

  updateProfile: async (userData) => {
    return apiRequest('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  addAddress: async (addressData) => {
    return apiRequest('/users/addresses', {
      method: 'POST',
      body: JSON.stringify(addressData),
    });
  },

  updateAddress: async (index, addressData) => {
    return apiRequest(`/users/addresses/${index}`, {
      method: 'PUT',
      body: JSON.stringify(addressData),
    });
  },
};

// Order services
export const orderService = {
  create: async (orderData) => {
    return apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  getAll: async () => {
    return apiRequest('/orders');
  },

  getById: async (id) => {
    return apiRequest(`/orders/${id}`);
  },

  updateStatus: async (id, status) => {
    return apiRequest(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
};

// Menu item services
export const menuItemService = {
  create: async (menuItemData) => {
    return apiRequest('/menu-items', {
      method: 'POST',
      body: JSON.stringify(menuItemData),
    });
  },

  getById: async (id) => {
    return apiRequest(`/menu-items/${id}`);
  },

  update: async (id, menuItemData) => {
    return apiRequest(`/menu-items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(menuItemData),
    });
  },

  delete: async (id) => {
    return apiRequest(`/menu-items/${id}`, {
      method: 'DELETE',
    });
  },
};

// Auth utilities
export const authUtils = {
  isAuthenticated: () => {
    return !!getAuthToken();
  },
  
  getToken: getAuthToken,
};

export default {
  restaurantService,
  categoryService,
  userService,
  orderService,
  menuItemService,
  authUtils,
};