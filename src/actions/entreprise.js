import axios from 'axios';
import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import { fetcher, endpoints } from 'src/utils/axios';

import { STORAGE_KEY } from 'src/auth/context/jwt';

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

export function useGetEntreprises() {
  const url = endpoints.company.list;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);
  const memoizedValue = useMemo(
    () => ({
      entreprisesData: data ?? [],
      entreprisesLoading: isLoading,
      entreprisesError: error,
      entreprisesValidating: isValidating,
      entreprisesEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useDeleteEntreprise() {
  const deleteEntreprise = async (id) => {
    // const url = endpoints.company.delete(id);
    // console.log('url', url);
    try {
      const url = `http://127.0.0.1:8000/api/companies/${id}`; // adjust endpoint if needed

      const res = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(STORAGE_KEY)}`,
        },
      });
      console.log('res', localStorage.getItem(STORAGE_KEY));
      // Refresh users list after deletion
      mutate(endpoints.company.list);

      return res.data;
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur:", error);
      throw error;
    }
  };

  return { deleteEntreprise };
}

export function useGetEntreprise(id) {
  const url = id ? [endpoints.company.update(id)] : null;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);
  const memoizedValue = useMemo(
    () => ({
      entrepriseData: data,
      entrepriseLoading: isLoading,
      entrepriseError: error,
      entrepriseValidating: isValidating,
      entrepriseEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useUpdateEntreprise() {
  const updateEntreprise = async (id, data) => {
    console.log('update data', data);
    try {
      const url = `http://127.0.1:8000/api/companies/${id}`; // adjust endpoint if needed
      const res = await axios.put(url, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(STORAGE_KEY)}`,
          'Content-Type': 'application/json',
        },
      });
      // Refresh users list after deletion
      mutate(endpoints.company.list);

      return res.data;
    } catch (error) {
      console.error('update error:', error);
      throw error;
    }
  };
  return { updateEntreprise };
}
