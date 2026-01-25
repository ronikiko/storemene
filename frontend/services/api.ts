// const API_BASE_URL = process.env.VITE_API_BASE_URL || 'https://storemene.vercel.app/api';
// const API_BASE_URL = 'http://localhost:3001/api';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://storemene.vercel.app/api';
// Helper function for API calls
async function apiCall(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        credentials: 'include', // Needed for HTTP-only cookies
        ...options,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Request failed' }));
        const err: any = new Error(errorData.error || `HTTP ${response.status}`);
        err.status = response.status;
        throw err;
    }

    return response.json();
}

// Products API
export const productsApi = {
    getAll: () => apiCall('/products'),
    getById: (id: number) => apiCall(`/products/${id}`),
    create: (product: any) => apiCall('/products', {
        method: 'POST',
        body: JSON.stringify(product),
    }),
    update: (id: number, product: any) => apiCall(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(product),
    }),
    delete: (id: number) => apiCall(`/products/${id}`, {
        method: 'DELETE',
    }),
};

// Categories API
export const categoriesApi = {
    getAll: () => apiCall('/categories'),
    getById: (id: string) => apiCall(`/categories/${id}`),
    create: (category: any) => apiCall('/categories', {
        method: 'POST',
        body: JSON.stringify(category),
    }),
    update: (id: string, category: any) => apiCall(`/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(category),
    }),
    delete: (id: string) => apiCall(`/categories/${id}`, {
        method: 'DELETE',
    }),
};

// Customers API
export const customersApi = {
    getAll: () => apiCall('/customers'),
    getById: (id: string) => apiCall(`/customers/${id}`),
    create: (customer: any) => apiCall('/customers', {
        method: 'POST',
        body: JSON.stringify(customer),
    }),
    update: (id: string, customer: any) => apiCall(`/customers/${id}`, {
        method: 'PUT',
        body: JSON.stringify(customer),
    }),
    delete: (id: string) => apiCall(`/customers/${id}`, {
        method: 'DELETE',
    }),
    sendInvite: (id: string) => apiCall(`/customers/invite/${id}`, {
        method: 'POST',
    }),
};

// Price Lists API
export const priceListsApi = {
    getAll: () => apiCall('/price-lists'),
    getById: (id: string) => apiCall(`/price-lists/${id}`),
    create: (priceList: any) => apiCall('/price-lists', {
        method: 'POST',
        body: JSON.stringify(priceList),
    }),
    update: (id: string, priceList: any) => apiCall(`/price-lists/${id}`, {
        method: 'PUT',
        body: JSON.stringify(priceList),
    }),
    delete: (id: string) => apiCall(`/price-lists/${id}`, {
        method: 'DELETE',
    }),
};

// Auth API
export const authApi = {
    authenticateCustomer: (token: string, pin: string) => apiCall('/auth/customer', {
        method: 'POST',
        body: JSON.stringify({ token, pin }),
    }),
    loginAdmin: (credentials: { email: string; password: string }) => apiCall('/auth/admin/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
    }),
    logoutAdmin: () => apiCall('/auth/admin/logout', {
        method: 'POST',
    }),
    getMe: () => apiCall('/auth/admin/me'),
    getCustomerMe: () => apiCall('/auth/customer/me'),
    getCustomerPublicInfo: (token: string) => apiCall(`/auth/customer/info/${token}`),
};

// Users API
export const usersApi = {
    getAll: () => apiCall('/users'),
    create: (user: any) => apiCall('/users', {
        method: 'POST',
        body: JSON.stringify(user),
    }),
};

// Settings API
export const settingsApi = {
    getAll: () => apiCall('/settings'),
    getById: (id: string) => apiCall(`/settings/${id}`),
    update: (id: string, value: string) => apiCall(`/settings/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ value }),
    }),
};

// Orders API
export const ordersApi = {
    getAll: () => apiCall('/orders'),
    create: (order: any) => apiCall('/orders', {
        method: 'POST',
        body: JSON.stringify(order),
    }),
    update: (id: string, order: any) => apiCall(`/orders/${id}`, {
        method: 'PUT',
        body: JSON.stringify(order),
    }),
    getByToken: (token: string) => apiCall(`/orders/picking/${token}`),
    completePicking: (token: string, itemsStatus: any[]) => apiCall(`/orders/picking/${token}/complete`, {
        method: 'POST',
        body: JSON.stringify({ itemsStatus }),
    }),
    getPickingLink: (id: string) => apiCall(`/orders/${id}/picking-link`),
};
