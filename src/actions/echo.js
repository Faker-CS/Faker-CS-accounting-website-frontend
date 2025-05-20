// src/echo.js
import Pusher from 'pusher-js';
import Echo from 'laravel-echo';

import { STORAGE_KEY } from 'src/auth/context/jwt';

window.Pusher = Pusher;

export const initializeEcho = () => {
  const echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    forceTLS: true,
    authEndpoint: `${import.meta.env.VITE_API_URL}/broadcasting/auth`,
    auth: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(STORAGE_KEY)}`,
      },
    },
    enabledTransports: ['ws', 'wss'],
    disableStats: true,
  });

  // Add comprehensive connection logging
  echo.connector.pusher.connection.bind('state_change', (states) => {
    console.log('State change:', states.previous, '->', states.current);
  });

  echo.connector.pusher.connection.bind('error', (err) => {
    console.error('Connection error:', err);
  });

  return echo;
};

export const subscribeToNotifications = (echo, userId, callback) => {
  if (!userId) return null;

  const channel = echo.private(`notifications.${userId}`);

  channel.listen('.new-notification', (data) => {
    console.log('New real-time notification:', data);
    callback(data);
  });

  channel.error((error) => {
    console.error('Notification subscription error:', error);
  });

  return channel;
};
