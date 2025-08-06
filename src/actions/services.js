import useSWR from 'swr';
import { useMemo } from 'react';

import { poster, putter, fetcher, deleter, endpoints } from 'src/utils/axios';


const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

export function useGetServices() {
    const url = endpoints.services.all;

    const { data, isLoading, error, isValidating, mutate } = useSWR(url, fetcher, swrOptions);
    const memoizedValue = useMemo(
        () => ({
            servicesData: data ?? [],
            servicesLoading: isLoading,
            servicesError: error,
            servicesValidating: isValidating,
            servicesEmpty: !isLoading && !data?.length,
            mutateServices: mutate,
        }),
        [data, error, isLoading, isValidating, mutate]
    );

    return memoizedValue;
}

export function useGetServiceDetails(id) {
    const url = id ? endpoints.services.details(id) : null;

    const { data, isLoading, error, isValidating, mutate } = useSWR(url, fetcher, swrOptions);
    const memoizedValue = useMemo(
        () => ({
            serviceData: data,
            serviceLoading: isLoading,
            serviceError: error,
            serviceValidating: isValidating,
            mutateService: mutate,
        }),
        [data, error, isLoading, isValidating, mutate]
    );

    return memoizedValue;
}

export function useGetCompanyServices(companyId) {
    const url = companyId ? endpoints.services.companyServices(companyId) : null;

    const { data, isLoading, error, isValidating, mutate } = useSWR(url, fetcher, swrOptions);
    const memoizedValue = useMemo(
        () => ({
            companyServicesData: data ?? [],
            companyServicesLoading: isLoading,
            companyServicesError: error,
            companyServicesValidating: isValidating,
            companyServicesEmpty: !isLoading && !data?.length,
            mutateCompanyServices: mutate,
        }),
        [data, error, isLoading, isValidating, mutate]
    );

    return memoizedValue;
}

export function useGetCompanyServicesWithStatus(companyId) {
    const url = companyId ? endpoints.services.companyServicesWithStatus(companyId) : null;

    const { data, isLoading, error, isValidating, mutate } = useSWR(url, fetcher, swrOptions);

    const memoizedValue = useMemo(
        () => ({
            servicesWithStatusData: data ?? [],
            servicesWithStatusLoading: isLoading,
            servicesWithStatusError: error,
            servicesWithStatusValidating: isValidating,
            servicesWithStatusEmpty: !isLoading && !data?.length,
            mutateServicesWithStatus: mutate,
        }),
        [data, error, isLoading, isValidating, mutate]
    );

    return memoizedValue;
}

// Service management functions
export const createService = async (serviceData) => {
    try {
        const response = await poster(endpoints.services.create, serviceData);
        return { success: true, data: response };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const updateService = async (id, serviceData) => {
    try {
        const response = await putter(endpoints.services.update(id), serviceData);
        return { success: true, data: response };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const deleteService = async (id) => {
    try {
        await deleter(endpoints.services.delete(id));
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// Company service management functions
export const assignServiceToCompany = async (companyId, serviceData) => {
    try {
        const response = await poster(endpoints.services.assignToCompany(companyId), serviceData);
        return { success: true, data: response };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const updateCompanyService = async (companyId, serviceId, serviceData) => {
    try {
        const response = await putter(endpoints.services.updateCompanyService(companyId, serviceId), serviceData);
        return { success: true, data: response };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const removeServiceFromCompany = async (companyId, serviceId) => {
    try {
        await deleter(endpoints.services.removeFromCompany(companyId, serviceId));
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const assignDefaultServicesToCompany = async (companyId) => {
    try {
        const response = await poster(endpoints.services.assignDefaultServices(companyId));
        return { success: true, data: response };
    } catch (error) {
        return { success: false, error: error.message };
    }
};