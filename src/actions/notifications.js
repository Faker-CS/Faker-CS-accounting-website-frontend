import useSWR from 'swr';
import axios from 'axios';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/utils/axios';

import { STORAGE_KEY } from 'src/auth/context/jwt';

const swrOptions = {
  revalidateIfStale: true,
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
  refreshInterval: 5000, // Poll every 5 seconds
};

export function useGetNotifications() {
  const url = endpoints.notification.user;

  const { data, isLoading, error, isValidating, mutate } = useSWR(url, fetcher, swrOptions);

  const memorizedValue = useMemo(
    () => ({
      notificationsData: data,
      notificationsLoading: isLoading,
      notificationsError: error,
      notificationsValidating: isValidating,
      notificationsEmpty: !isLoading && !data?.length,
      mutateNotifications: mutate,
    }),
    [data, error, isLoading, isValidating, mutate]
  );

  return memorizedValue;
}

export async function handleAllRead(mutate) {
  try {
    const response = await axios.patch(
      `${import.meta.env.VITE_SERVER_URL}/notifications/read`,
      {},
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem(STORAGE_KEY)}`,
        },
      }
    );

    // Revalidate the notifications data
    await mutate?.();
  } catch (error) {
    console.error('Error marking notifications as read:', error);
  }
}

export async function handleRead(id, mutate) {
  try {
    const response = await axios.patch(
      `${import.meta.env.VITE_SERVER_URL}/notifications/read/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(STORAGE_KEY)}`,
        },
      }
    );

    // Revalidate the notifications data
    await mutate?.();
  } catch (error) {
    console.error('Error marking notification as read:', error);
  }
}
