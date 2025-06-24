/* eslint-disable import/no-unresolved */
import axios from 'axios';
import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import { fetcher, endpoints, axiosInstance } from 'src/utils/axios';

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
      const url = `http://35.171.211.165:8000/api/companies/${id}`; // adjust endpoint if needed

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


export function useGetEntrepriseById(id) {
  const url = id ? [endpoints.company.show(id)] : null;

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
    try {
      const url = endpoints.company.update(id);
      const res = await axiosInstance.put(url, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(STORAGE_KEY)}`,
          'Content-Type': 'application/json',
        },
      });
      mutate(endpoints.company.list);
      return res.data;
    } catch (error) {
      console.error('update error:', error);
      throw error;
    }
  };
  return { updateEntreprise };
}

export function useAddEntreprise() {
  const addEntreprise = async (formInput) => {
    try {
      const formData = new FormData();
      formData.append("name", formInput.name || formInput.raisonSociale);
      formData.append("email", formInput.email);
      formData.append("founded", formInput.date);
      formData.append("raison_sociale", formInput.raisonSociale);
      formData.append("phone_number", formInput.phoneNumber);
      formData.append("forme_juridique", formInput.formeJuridique);
      formData.append("code_company_type", formInput.activiteEntreprise);
      formData.append("code_company_value", formInput.refCnss);
      formData.append("adresse_siege_social", formInput.adresseSiegeSocial);
      formData.append("code_postale", formInput.zipCode);
      formData.append("ville", formInput.city);
      formData.append("Industrie", formInput.Industrie);
      if (formInput.avatarUrl) {
        formData.append("logo", formInput.avatarUrl);
      }
      if (formInput.siren) {
        formData.append("numero_siren", formInput.siren);
      }
      if (formInput.chiffreAffaire) {
        formData.append("chiffre_affaire", formInput.chiffreAffaire);
      }
      if (formInput.trancheA) {
        formData.append("tranche_a", formInput.trancheA);
      }
      if (formInput.trancheB) {
        formData.append("tranche_b", formInput.trancheB);
      }
      if (formInput.nombreSalaries) {
        formData.append("nombre_salaries", formInput.nombreSalaries);
      }
      if (formInput.moyenneAge) {
        formData.append("moyenne_age", formInput.moyenneAge);
      }
      if (formInput.nombreSalariesCadres) {
        formData.append("nombre_salaries_cadres", formInput.nombreSalariesCadres);
      }
      if (formInput.moyenneAgeCadres) {
        formData.append("moyenne_age_cadres", formInput.moyenneAgeCadres);
      }
      if (formInput.nombreSalariesNonCadres) {
        formData.append("nombre_salaries_non_cadres", formInput.nombreSalariesNonCadres);
      }
      if (formInput.moyenneAgeNonCadres) {
        formData.append("moyenne_age_non_cadres", formInput.moyenneAgeNonCadres);
      }
      const url = endpoints.company.create;
      const res = await axiosInstance.post(url, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(STORAGE_KEY)}`,
          "Content-Type": "multipart/form-data",
        },
      });
      mutate(endpoints.company.list);
      return res.data;
    } catch (error) {
      console.error("add error:", error?.response?.data || error);
      throw error;
    }
  };
  return { addEntreprise };
}
