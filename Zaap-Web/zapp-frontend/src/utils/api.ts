// API configuration utility for local development
const API_BASE_URL = 'http://localhost:4000'; // Adjust this URL as needed for your local setup

export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  // Normalize URL to avoid double slashes
  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
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
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      // Try to get error details from response
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
      }
      
      console.error(`API call failed for ${endpoint}:`, {
        status: response.status,
        statusText: response.statusText,
        errorData
      });
      
      throw new Error(`HTTP error! status: ${response.status} - ${errorData.error || errorData.message || response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
};

export const apiUrl = (endpoint: string) => {
  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${normalizedEndpoint}`;
};

export { API_BASE_URL };

// API Functions for Zaap Backend

// User login and parent wallet creation
export const loginUser = async (delegatorAddress: string) => {
  return apiCall('/api/login', {
    method: 'POST',
    body: JSON.stringify({ delegatorAddress }),
  });
};

// Get parent wallet information
export const getParentWallet = async (delegatorAddress: string) => {
  return apiCall(`/api/parent-wallet/${delegatorAddress}`);
};

// Generate QR code for child account
export const generateQR = async (delegator: string, maxAmount: number, alias?: string) => {
  return apiCall('/api/generate-qr', {
    method: 'POST',
    body: JSON.stringify({ delegator, maxAmount, alias }),
  });
};

// Connect child account
export const connectChild = async (childData: {
  childAddress: string;
  delegator: string;
  token: string;
  maxAmount: number;
  alias?: string;
  timestamp?: number;
}) => {
  return apiCall('/api/connect-child', {
    method: 'POST',
    body: JSON.stringify(childData),
  });
};

// Transfer USDC to child
export const transferUSDC = async (childAddress: string, delegator: string, amount?: number) => {
  return apiCall('/api/transfer-usdc', {
    method: 'POST',
    body: JSON.stringify({ childAddress, delegator, amount }),
  });
};

// Get list of children
export const getChildren = async () => {
  return apiCall('/api/children');
};

// Update child account
export const updateChild = async (childAddress: string, updates: any) => {
  return apiCall(`/api/children/${childAddress}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
};
