// src/hooks/useAuth.js
import { useState, useEffect } from 'react';

import axios, { endpoints } from 'src/utils/axios';


export function useAuth() {
  const [userData, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(endpoints.auth.me);
        setUser(response.data);
      } catch (err) {
        console.error('Fetch User Error:', err.message, err.response?.data); // Debug: Log error
        setError(err.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { userData, loading, error };
}