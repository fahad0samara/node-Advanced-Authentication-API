# Frontend Integration Guide

This guide explains how to integrate your frontend application with the authentication API.

## Base URL

```javascript
const API_BASE_URL = 'http://localhost:3000/api/auth';
```

## API Integration Examples

### 1. User Registration

```javascript
async function registerUser(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important for cookies
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    
    // Store the access token
    localStorage.setItem('accessToken', data.data.accessToken);
    return data;
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
}
```

### 2. User Login

```javascript
async function loginUser(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important for cookies
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    
    // Store the access token
    localStorage.setItem('accessToken', data.data.accessToken);
    return data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}
```

### 3. Protected Route Access

```javascript
async function fetchProtectedData() {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const response = await fetch(`${API_BASE_URL}/protected`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });

    if (response.status === 403) {
      // Token expired, try to refresh
      await refreshToken();
      return fetchProtectedData(); // Retry the request
    }

    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    
    return data;
  } catch (error) {
    console.error('Failed to fetch protected data:', error);
    throw error;
  }
}
```

### 4. Token Refresh

```javascript
async function refreshToken() {
  try {
    const response = await fetch(`${API_BASE_URL}/refresh-token`, {
      method: 'POST',
      credentials: 'include', // Important for cookies
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    
    // Update the access token
    localStorage.setItem('accessToken', data.data.accessToken);
    return data;
  } catch (error) {
    console.error('Token refresh failed:', error);
    // Redirect to login if refresh fails
    window.location.href = '/login';
    throw error;
  }
}
```

### 5. Logout

```javascript
async function logoutUser() {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    
    // Clear stored tokens
    localStorage.removeItem('accessToken');
    return data;
  } catch (error) {
    console.error('Logout failed:', error);
    throw error;
  }
}
```

## Authentication Helper Class

Here's a complete authentication helper class you can use in your frontend application:

```javascript
class AuthService {
  constructor(baseURL = 'http://localhost:3000/api/auth') {
    this.baseURL = baseURL;
    this.accessToken = localStorage.getItem('accessToken');
  }

  setAccessToken(token) {
    this.accessToken = token;
    localStorage.setItem('accessToken', token);
  }

  clearTokens() {
    this.accessToken = null;
    localStorage.removeItem('accessToken');
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.accessToken) {
      headers.Authorization = `Bearer ${this.accessToken}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });

    const data = await response.json();
    if (!response.ok) {
      if (response.status === 403) {
        try {
          await this.refreshToken();
          return this.request(endpoint, options);
        } catch (error) {
          this.clearTokens();
          throw new Error('Session expired');
        }
      }
      throw new Error(data.error);
    }

    return data;
  }

  async register(email, password) {
    const data = await this.request('/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setAccessToken(data.data.accessToken);
    return data;
  }

  async login(email, password) {
    const data = await this.request('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setAccessToken(data.data.accessToken);
    return data;
  }

  async refreshToken() {
    const data = await this.request('/refresh-token', {
      method: 'POST',
    });
    this.setAccessToken(data.data.accessToken);
    return data;
  }

  async logout() {
    await this.request('/logout', {
      method: 'POST',
    });
    this.clearTokens();
  }

  async getProtectedData() {
    return this.request('/protected');
  }

  isAuthenticated() {
    return !!this.accessToken;
  }
}
```

## Usage Example

```javascript
// Initialize the auth service
const auth = new AuthService();

// Register a new user
try {
  await auth.register('user@example.com', 'SecurePass123');
  console.log('Registration successful');
} catch (error) {
  console.error('Registration failed:', error.message);
}

// Login
try {
  await auth.login('user@example.com', 'SecurePass123');
  console.log('Login successful');
} catch (error) {
  console.error('Login failed:', error.message);
}

// Access protected route
try {
  const data = await auth.getProtectedData();
  console.log('Protected data:', data);
} catch (error) {
  console.error('Failed to get protected data:', error.message);
}

// Logout
try {
  await auth.logout();
  console.log('Logout successful');
} catch (error) {
  console.error('Logout failed:', error.message);
}
```

## Error Handling

The API returns errors in the following format:

```javascript
{
  success: false,
  error: 'Error message',
  errors: [] // Validation errors array (if applicable)
}
```

Implement proper error handling in your frontend:

```javascript
try {
  await auth.login(email, password);
  // Success handling
} catch (error) {
  if (error.message.includes('Invalid credentials')) {
    // Show login error message
  } else if (error.message.includes('Session expired')) {
    // Redirect to login
    window.location.href = '/login';
  } else {
    // Show generic error message
  }
}
```

## Security Considerations

1. **HTTPS**: Always use HTTPS in production.
2. **Token Storage**: Access tokens are stored in localStorage for simplicity. For better security, consider using memory storage or secure httpOnly cookies.
3. **CORS**: Ensure your frontend domain is included in the API's `ALLOWED_ORIGINS` environment variable.
4. **Error Messages**: Don't display raw error messages to users. Map them to user-friendly messages.
5. **Automatic Token Refresh**: The AuthService class handles token refresh automatically.
6. **Logout**: Always clear tokens and sensitive data on logout.

## React Integration Example

```javascript
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const auth = new AuthService();

  const login = async (email, password) => {
    const response = await auth.login(email, password);
    setUser(response.data.user);
  };

  const logout = async () => {
    await auth.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, auth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

## Testing the Integration

1. Start the backend server
2. Test registration with valid/invalid credentials
3. Test login with valid/invalid credentials
4. Test protected route access
5. Test token refresh
6. Test logout functionality
7. Verify error handling
8. Check CORS configuration
9. Validate secure cookie handling