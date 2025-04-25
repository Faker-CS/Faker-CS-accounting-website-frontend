import axios, { endpoints } from 'src/utils/axios';

import { setSession } from './utils';
import { STORAGE_KEY } from './constant';

/** **************************************
 * Log in
 *************************************** */
export const signInWithPassword = async ({ email, password }) => {
  try {
    // Step 1: Login and receive JWT
    const { data } = await axios.post(endpoints.auth.login, { email, password });
    const { accessToken, user } = data;

    if (accessToken) {
      // Step 2: Save JWT to localStorage
      localStorage.setItem(STORAGE_KEY, accessToken);

      // Step 3: Set token in axios headers for future requests
      setSession(accessToken);
    }

    return user;
  } catch (error) {
    console.error('Error during sign in:', error);
    throw error;
  }
};

/** **************************************
 * Register
 *************************************** */
export async function register(payload) {
  try {
    const { data } = await axios.post(endpoints.auth.register, payload);
    const { accessToken, user } = data;

    if (accessToken) {
      localStorage.setItem(STORAGE_KEY, accessToken);
      setSession(accessToken);
    }

    return user;
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
}


/** **************************************
 * Logout
 *************************************** */
export async function logout() {
  try {
    await axios.post(endpoints.auth.logout);

    // Remove JWT from storage and session
    localStorage.removeItem(STORAGE_KEY);
    setSession(null);
  } catch (error) {
    console.error('Error during logout:', error);
    throw error;
  }
}
