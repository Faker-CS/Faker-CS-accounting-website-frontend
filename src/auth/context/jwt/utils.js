import { paths } from 'src/routes/paths';

import axios from 'src/utils/axios';

import { STORAGE_KEY } from './constant';

// ----------------------------------------------------------------------

export function jwtDecode(token) {
  try {
    if (!token) return null;

    const parts = token.split('.');
    if (parts.length < 2) {
      throw new Error('Invalid token!');
    }

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(atob(base64));

    return decoded;
  } catch (error) {
    console.error('Error decoding token:', error);
    throw error;
  }
}

// ----------------------------------------------------------------------

export function isValidToken(accessToken) {
  if (!accessToken) {
    return false;
  }

  try {
    const decoded = jwtDecode(accessToken);

    if (!decoded || !('exp' in decoded)) {
      return false;
    }

    const currentTime = Date.now() / 1000;

    return decoded.exp > currentTime;
  } catch (error) {
    console.error('Error during token validation:', error);
    return false;
  }
}

// ----------------------------------------------------------------------

export function tokenExpired(exp) {
  const currentTime = Date.now();
  const timeLeft = exp * 1000 - currentTime;

  setTimeout(() => {
    try {
      alert('Token expired!');
      localStorage.removeItem(STORAGE_KEY);
      window.location.href = paths.auth.jwt.signIn;
    } catch (error) {
      console.error('Error during token expiration:', error);
      throw error;
    }
  }, timeLeft);
}

// ----------------------------------------------------------------------

export async function setSession(accessToken) {
  try {
    if (accessToken) {
      // Store the token securely in localStorage
      localStorage.setItem(STORAGE_KEY, accessToken);

      // Set the default Authorization header for all axios requests
      axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

      // Decode the token to get the expiration time
      const decodedToken = jwtDecode(accessToken); // ~3 days by minimals server

      // Check if the token is valid
      if (decodedToken && 'exp' in decodedToken) {
        tokenExpired(decodedToken.exp);
      } else {
        throw new Error('Invalid access token!');
      }
    } else {
      // If no access token is provided, remove the token from localStorage
      localStorage.removeItem(STORAGE_KEY);
      delete axios.defaults.headers.common.Authorization;
    }
  } catch (error) {
    console.error('Error during set session:', error);
    throw error;
  }
}
