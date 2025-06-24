import Pusher from 'pusher-js';
import { useEffect, useCallback } from 'react';

// Initialize Pusher
const pusher = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
  cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
  encrypted: true,
});

export function usePusher() {
  useEffect(() => () => {
    pusher.disconnect();
  }, []);

  const subscribe = useCallback((channel, event, callback) => {
    const pusherChannel = pusher.subscribe(channel);
    pusherChannel.bind(event, callback);

    // Return cleanup function
    return () => {
      pusherChannel.unbind(event, callback);
      pusher.unsubscribe(channel);
    };
  }, []);

  return {
    subscribe,
  };
} 