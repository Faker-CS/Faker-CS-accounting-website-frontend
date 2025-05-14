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

export function useAddEntreprise() {
  const addEntreprise = async (formInput) => {
    try {
      const formData = new FormData();

      // Champs obligatoires
      formData.append("name", formInput.name || "Nom par défaut");
      formData.append("email", formInput.email);
      formData.append("description", formInput.description || "Description...");
      formData.append("founded", formInput.date); // date fondation
      formData.append("logo", formInput.avatarUrl); // fichier image

      // Champs entreprise
      formData.append("raison_sociale", formInput.raisonSociale);
      formData.append("numero_tva", formInput.matriculeFiscale || "");
      formData.append("numero_siren", formInput.siren || "");
      formData.append("forme_juridique", formInput.formeJuridique);
      formData.append("code_company_type", formInput.activiteEntreprise);
      formData.append("code_company_value", formInput.Industrie);
      formData.append("adresse_siege_social", formInput.adresseSiegeSocial);
      formData.append("code_postale", formInput.zipCode);
      formData.append("ville", formInput.city);

      // Champs statistiques
      formData.append("chiffre_affaire", formInput.chiffreAffaire || 0);
      formData.append("tranche_a", formInput.trancheA || 0);
      formData.append("tranche_b", formInput.trancheB || 0);
      formData.append("nombre_salaries", formInput.nombreSalaries || 0);
      formData.append("moyenne_age", formInput.moyenneAge || 0);
      formData.append("nombre_salaries_cadres", formInput.nombreSalariesCadres || 0);
      formData.append("moyenne_age_cadres", formInput.moyenneAgeCadres || 0);
      formData.append("nombre_salaries_non_cadres", formInput.nombreSalariesNonCadres || 0);
      formData.append("moyenne_age_non_cadres", formInput.moyenneAgeNonCadres || 0);

      const url = `http://127.0.1:8000/api/companies`;

      const res = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(STORAGE_KEY)}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // actualise la liste après ajout
      mutate(endpoints.company.list);

      return res.data;

    } catch (error) {
      console.error("add error:", error?.response?.data || error);
      throw error;
    }
  };

  return { addEntreprise };
}
