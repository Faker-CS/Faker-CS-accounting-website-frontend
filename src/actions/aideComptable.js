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