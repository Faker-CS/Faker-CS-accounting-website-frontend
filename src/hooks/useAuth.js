// src/hooks/useAuth.js
import { useState, useEffect } from 'react';

// eslint-disable-next-line import/no-unresolved
import axios, { endpoints } from 'src/utils/axios';

export function useAuth() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(endpoints.auth.me);

        
        // Ensure user data has the correct structure
        const user = {
          ...response.data,
          roles: response.data.roles || response.data.type || 'user', // Use roles field
        };

        setUserData(user);
      } catch (err) {
        setError(err.message);
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { userData, setUserData, loading, error };
  
}