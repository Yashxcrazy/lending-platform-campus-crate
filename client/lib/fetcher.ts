/**
 * Centralized Fetch Helper
 * Handles API requests with automatic URL building, authentication, and error handling
 */

export const BASE_URL = import.meta.env.VITE_API_URL || 
  (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app') 
    ? 'https://campus-crate-backend.onrender.com/api' 
    : '/api');

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export interface FetchOptions extends RequestInit {
  token?: string;
  skipAuth?: boolean;
}

/**
 * Centralized fetch helper with automatic URL building and auth
 * @param endpoint - API endpoint (e.g., '/items' or '/auth/login')
 * @param options - Fetch options with optional token and skipAuth
 * @returns Promise with parsed JSON response
 */
export async function fetcher<T = any>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { token, skipAuth, ...fetchOptions } = options;

  // Guard against missing path params (e.g., /users//reviews)
  if (
    endpoint.includes('/users//reviews') ||
    endpoint.includes('/reviews/user//')
  ) {
    throw new ApiError('Missing userId for reviews request', 400);
  }

  // Build full URL
  const url = endpoint.startsWith('http') 
    ? endpoint 
    : `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  // Setup headers
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };

  // Add authorization if not skipped
  if (!skipAuth) {
    const authToken = token || localStorage.getItem('token');
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
  }

  // Make request
  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    // Parse response body
    let data: any;
    if (isJson) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = text ? { message: text } : null;
    }

    // Handle errors
    if (!response.ok) {
      const errorMessage = data?.message || data?.error || `HTTP ${response.status}`;
      throw new ApiError(errorMessage, response.status, data);
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Network or parsing errors
    if (error instanceof TypeError) {
      throw new ApiError('Network error - backend may be unreachable', 0);
    }

    throw new ApiError(
      error instanceof Error ? error.message : 'Unknown error',
      0
    );
  }
}

/**
 * GET request helper
 */
export async function get<T = any>(
  endpoint: string,
  options?: FetchOptions
): Promise<T> {
  return fetcher<T>(endpoint, { ...options, method: 'GET' });
}

/**
 * POST request helper
 */
export async function post<T = any>(
  endpoint: string,
  body?: any,
  options?: FetchOptions
): Promise<T> {
  return fetcher<T>(endpoint, {
    ...options,
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * PUT request helper
 */
export async function put<T = any>(
  endpoint: string,
  body?: any,
  options?: FetchOptions
): Promise<T> {
  return fetcher<T>(endpoint, {
    ...options,
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * DELETE request helper
 */
export async function del<T = any>(
  endpoint: string,
  options?: FetchOptions
): Promise<T> {
  return fetcher<T>(endpoint, { ...options, method: 'DELETE' });
}

/**
 * PATCH request helper
 */
export async function patch<T = any>(
  endpoint: string,
  body?: any,
  options?: FetchOptions
): Promise<T> {
  return fetcher<T>(endpoint, {
    ...options,
    method: 'PATCH',
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * Health check utility
 */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const healthUrl = BASE_URL.replace('/api', '') + '/health';
    console.log('🏥 Checking backend health at:', healthUrl);
    
    const response = await fetch(healthUrl, {
      method: 'GET',
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Backend is healthy:', data.message || 'OK');
      return true;
    } else {
      console.warn('⚠️  Backend responded but returned:', response.status);
      return false;
    }
  } catch (error) {
    console.error('❌ Backend health check failed:', error instanceof Error ? error.message : error);
    console.error('   Make sure VITE_API_URL is set correctly and backend is running');
    console.error('   Current API URL:', BASE_URL);
    return false;
  }
}

/**
 * Token management utilities
 */
export const auth = {
  setToken: (token: string) => {
    localStorage.setItem('token', token);
  },
  
  getToken: () => {
    return localStorage.getItem('token');
  },
  
  clearToken: () => {
    localStorage.removeItem('token');
  },
  
  hasToken: () => {
    return !!localStorage.getItem('token');
  },
};
