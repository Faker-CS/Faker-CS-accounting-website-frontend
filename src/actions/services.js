import useSWR from 'swr';
// import axios from 'axios';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/utils/axios';

// import { STORAGE_KEY } from 'src/auth/context/jwt';

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

export function useGetServices() {
    const url = endpoints.services.all;

    const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);
    const memoizedValue = useMemo(
        () => ({
            servicesData: data ?? [],
            servicesLoading: isLoading,
            servicesError: error,
            servicesValidating: isValidating,
            servicesEmpty: !isLoading && !data?.length,
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}