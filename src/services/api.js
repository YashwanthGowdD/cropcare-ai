// Centralized CropCare AI Frontend API Service

const API_BASE = import.meta.env.VITE_API_URL || '';

function getHeaders(farmerId, isMultipart = false) {
  const headers = {};
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }
  if (farmerId) {
    headers['x-farmer-id'] = farmerId;
  }
  return headers;
}

async function handleResponse(response) {
  if (!response.ok) {
    let errorMsg = `Server error (${response.status})`;
    try {
      const data = await response.json();
      if (data && data.error) {
        errorMsg = data.error;
      }
    } catch {
      // response was not JSON
    }
    throw new Error(errorMsg);
  }
  return response.json();
}

export const api = {
  // Authentication
  auth: {
    async login(credentials) {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(credentials)
      });
      return handleResponse(res);
    },
    async register(formData) {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(formData)
      });
      return handleResponse(res);
    },
    async getProfile(farmerId) {
      const res = await fetch(`${API_BASE}/api/auth/profile`, {
        headers: getHeaders(farmerId)
      });
      return handleResponse(res);
    },
    async updateProfile(farmerId, updates) {
      const res = await fetch(`${API_BASE}/api/auth/profile`, {
        method: 'PUT',
        headers: getHeaders(farmerId),
        body: JSON.stringify({ id: farmerId, ...updates })
      });
      return handleResponse(res);
    }
  },

  // Products (Agri-Medicines)
  products: {
    async getAll(params = {}) {
      const query = new URLSearchParams();
      if (params.search) query.append('search', params.search);
      if (params.category && params.category !== 'All') query.append('category', params.category);
      if (params.crop && params.crop !== 'All') query.append('crop', params.crop);

      const qs = query.toString() ? `?${query.toString()}` : '';
      const res = await fetch(`${API_BASE}/api/products${qs}`);
      return handleResponse(res);
    },
    async getById(id) {
      const res = await fetch(`${API_BASE}/api/products/${id}`);
      return handleResponse(res);
    },
    async create(productData) {
      const res = await fetch(`${API_BASE}/api/products`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(productData)
      });
      return handleResponse(res);
    },
    async update(id, updates) {
      const res = await fetch(`${API_BASE}/api/products/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updates)
      });
      return handleResponse(res);
    },
    async delete(id) {
      const res = await fetch(`${API_BASE}/api/products/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return handleResponse(res);
    }
  },

  // Crop Disease Scans & Diagnosis
  scans: {
    async getAll(farmerId) {
      const res = await fetch(`${API_BASE}/api/scans`, {
        headers: getHeaders(farmerId)
      });
      return handleResponse(res);
    },
    async getById(id) {
      const res = await fetch(`${API_BASE}/api/scans/${id}`);
      return handleResponse(res);
    },
    async create(formDataPayload, farmerId) {
      // If formDataPayload is FormData (file upload)
      if (formDataPayload instanceof FormData) {
        const res = await fetch(`${API_BASE}/api/scans`, {
          method: 'POST',
          headers: getHeaders(farmerId, true),
          body: formDataPayload
        });
        return handleResponse(res);
      }
      // If JSON payload (preset image)
      const res = await fetch(`${API_BASE}/api/scans`, {
        method: 'POST',
        headers: getHeaders(farmerId),
        body: JSON.stringify(formDataPayload)
      });
      return handleResponse(res);
    },
    async addFollowUp(id, payload, farmerId) {
      if (payload instanceof FormData) {
        const res = await fetch(`${API_BASE}/api/scans/${id}/follow-up`, {
          method: 'POST',
          headers: getHeaders(farmerId, true),
          body: payload
        });
        return handleResponse(res);
      }
      const res = await fetch(`${API_BASE}/api/scans/${id}/follow-up`, {
        method: 'POST',
        headers: getHeaders(farmerId),
        body: JSON.stringify(payload)
      });
      return handleResponse(res);
    }
  },

  // Persistent Cart
  cart: {
    async get(farmerId) {
      const res = await fetch(`${API_BASE}/api/cart`, {
        headers: getHeaders(farmerId)
      });
      return handleResponse(res);
    },
    async addItem(farmerId, productId, quantity = 1) {
      const res = await fetch(`${API_BASE}/api/cart`, {
        method: 'POST',
        headers: getHeaders(farmerId),
        body: JSON.stringify({ productId, quantity })
      });
      return handleResponse(res);
    },
    async updateQuantity(farmerId, productId, quantity) {
      const res = await fetch(`${API_BASE}/api/cart/${productId}`, {
        method: 'PUT',
        headers: getHeaders(farmerId),
        body: JSON.stringify({ quantity })
      });
      return handleResponse(res);
    },
    async removeItem(farmerId, productId) {
      const res = await fetch(`${API_BASE}/api/cart/${productId}`, {
        method: 'DELETE',
        headers: getHeaders(farmerId)
      });
      return handleResponse(res);
    },
    async clear(farmerId) {
      const res = await fetch(`${API_BASE}/api/cart`, {
        method: 'DELETE',
        headers: getHeaders(farmerId)
      });
      return handleResponse(res);
    }
  },

  // Orders
  orders: {
    async getAll(farmerId) {
      const res = await fetch(`${API_BASE}/api/orders`, {
        headers: getHeaders(farmerId)
      });
      return handleResponse(res);
    },
    async create(farmerId, orderData) {
      const res = await fetch(`${API_BASE}/api/orders`, {
        method: 'POST',
        headers: getHeaders(farmerId),
        body: JSON.stringify(orderData)
      });
      return handleResponse(res);
    },
    async adminGetAll() {
      const res = await fetch(`${API_BASE}/api/orders/all`);
      return handleResponse(res);
    },
    async updateStatus(orderId, status) {
      const res = await fetch(`${API_BASE}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status })
      });
      return handleResponse(res);
    }
  },

  // Expert Bookings
  bookings: {
    async getAll(farmerId) {
      const res = await fetch(`${API_BASE}/api/bookings`, {
        headers: getHeaders(farmerId)
      });
      return handleResponse(res);
    },
    async create(farmerId, bookingData) {
      const res = await fetch(`${API_BASE}/api/bookings`, {
        method: 'POST',
        headers: getHeaders(farmerId),
        body: JSON.stringify(bookingData)
      });
      return handleResponse(res);
    },
    async adminGetAll() {
      const res = await fetch(`${API_BASE}/api/bookings/all`);
      return handleResponse(res);
    },
    async updateStatus(bookingId, status) {
      const res = await fetch(`${API_BASE}/api/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status })
      });
      return handleResponse(res);
    }
  }
};
