import axios from 'axios';
import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

// eslint-disable-next-line import/no-unresolved
import { poster, fetcher, endpoints } from 'src/utils/axios';

// eslint-disable-next-line import/no-unresolved
import { STORAGE_KEY } from 'src/auth/context/jwt';

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// Fetch all aideComptables
export const useGetAideComptables = () => {
  const url = endpoints.aideComptable.list;
  const { data, isLoading, error } = useSWR(url, fetcher, swrOptions);
  const memoizedValue = useMemo(
    () => ({
      aideComptablesData: data ?? [],
      aideComptablesLoading: isLoading,
      aideComptablesError: error,
      aideComptablesEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading]
  );
  return memoizedValue;
};

// delete aideComptable
export const useDeleteAideComptable = () => {
  const deleteAideComptable = async (id) => {
    try {
      const url = `${import.meta.env.VITE_SERVER_URL}/aideComptable/${id}`;
      const res = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(STORAGE_KEY)}`,
        },
      });

      mutate(endpoints.aideComptable.list);
      return res.data;
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur:", error);
      throw error;
    }
  };
  return { deleteAideComptable };
};

// ADD aideComptable
export const useAddAideComptable = () => {
  const addAideComptable = async (data) => {
    try {
      const formData = new FormData();

      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('phoneNumber', data.phoneNumber || '');
      formData.append('address', data.address || '');
      formData.append('state', data.state || '');
      formData.append('city', data.city || '');
      formData.append('zipCode', data.zipCode || '');

      if (data.avatarUrl && data.avatarUrl instanceof File) {
        formData.append('avatarUrl', data.avatarUrl); // Must be a real File object
      }

      const url = `${import.meta.env.VITE_SERVER_URL}/aideComptable`;

      const res = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(STORAGE_KEY)}`,
          // DON'T set Content-Type manually here!
        },
      });

      mutate(endpoints.aideComptable.list);
      return res.data;
    } catch (error) {
      console.error('Error...:', error.response?.data || error.message);
      throw error;
    }
  };

  return { addAideComptable };
};

// UPDATE aideComptable
export const useUpdateAideComptable = () => {
  const updateAideComptable = async (id, data) => {
    try {
      const url = `${import.meta.env.VITE_SERVER_URL}/aideComptable/${id}`;
      const res = await axios.put(url, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(STORAGE_KEY)}`,
        },
      });
      mutate(endpoints.aideComptable.list);
      return res.data;
    } catch (error) {
      console.error('Error updating aide-comptable:', error.response?.data || error);
      throw error.response?.data || error;
    }
  };
  return { updateAideComptable };
};

export const assignToDemande = async (demandeId, userId) => {
  const data = {
    userId,
  };
  try {
    const url = endpoints.aideComptable.assignToDemande(demandeId);

    const res = await poster(url, data);

    mutate(endpoints.forms.all);

    return res;
  } catch (error) {
    console.error('Error assigning aide-comptable to demande:', error.response?.data || error);
    
    throw error.response?.data || error;
  }
};
