import { APIResponse } from '../types/api';
import { cache } from 'react';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

class APIClient {
  private token: string | null = null;

  constructor() {
    // Initialize token from localStorage in client components
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  private async fetchWithRetry(
    url: string,
    options: RequestInit,
    retries = MAX_RETRIES
  ): Promise<Response> {
    try {
      const response = await fetch(url, options);
      if (!response.ok && retries > 0 && response.status >= 500) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return this.fetchWithRetry(url, options, retries - 1);
      }
      return response;
    } catch (error) {
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return this.fetchWithRetry(url, options, retries - 1);
      }
      throw error;
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    const url = `${BASE_URL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await this.fetchWithRetry(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          error: {
            error: data.error || 'An error occurred',
            details: data.details,
          },
        };
      }

      return { data: data as T };
    } catch (error) {
      return {
        error: {
          error: 'Network error',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      };
    }
  }

  // Cache GET requests for 5 seconds
  get = cache(async <T>(endpoint: string) => {
    return this.request<T>(endpoint, { method: 'GET' });
  });

  post = async <T>(endpoint: string, data: unknown) => {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  };

  put = async <T>(endpoint: string, data: unknown) => {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  };

  delete = async <T>(endpoint: string) => {
    return this.request<T>(endpoint, { method: 'DELETE' });
  };
}

export const apiClient = new APIClient();
