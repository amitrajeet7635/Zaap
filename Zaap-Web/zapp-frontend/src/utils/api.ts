// API configuration utility
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://zaap-backend.vercel.app';

export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  // Normalize URL to avoid double slashes
  const baseUrl = API_BASE_URL.replace(/\/+$/, ''); // Remove trailing slashes
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${normalizedEndpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    console.log(`Making API call to: ${url}`);
    console.log(`Request options:`, defaultOptions);
    
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`API response:`, data);
    return data;
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
};

export const apiUrl = (endpoint: string) => {
  const baseUrl = API_BASE_URL.replace(/\/+$/, ''); // Remove trailing slashes
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${normalizedEndpoint}`;
};

// Helper function specifically for set-delegator
export const setDelegator = async (delegatorAddress: string) => {
  return apiCall('/api/set-delegator', {
    method: 'POST',
    body: JSON.stringify({ delegator: delegatorAddress })
  });
};

export { API_BASE_URL };
