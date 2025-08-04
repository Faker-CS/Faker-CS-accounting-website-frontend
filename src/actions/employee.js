import axios from "axios";
import { useMemo } from "react";
import useSWR,{ mutate } from "swr";

import { poster, fetcher, endpoints } from 'src/utils/axios';

import { STORAGE_KEY } from 'src/auth/context/jwt';

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// Fetch all employees
export const useGetEmployees = () => {
    const url = endpoints.employee.list;
    const { data, isLoading, error } = useSWR(url, fetcher, swrOptions);
    const memoizedValue = useMemo(
        () => ({
        employeesData: data ?? [],
        employeesLoading: isLoading,
        employeesError: error,
        employeesEmpty: !isLoading && !data?.length,
        }),
        [data, error, isLoading]
    );
  return memoizedValue;
};

// Fetch employees by company
export const useGetEmployeesByCompany = (companyId) => {
    const url = companyId ? endpoints.employee.byCompany(companyId) : null;
    const { data, isLoading, error } = useSWR(url, fetcher, swrOptions);
    const memoizedValue = useMemo(
        () => ({
        employeesData: data ?? [],
        employeesLoading: isLoading,
        employeesError: error,
        employeesEmpty: !isLoading && !data?.length,
        }),
        [data, error, isLoading]
    );
  return memoizedValue;
};

// Get employee by ID
export const useGetEmployee = (id) => {
  const url = id ? [endpoints.employee.details(id)] : null;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);
  const memoizedValue = useMemo(
    () => ({
      employeeData: data ?? {},
      employeeLoading: isLoading,
      employeeError: error,
      employeeValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
};
// Delete employee
export const useDeleteEmployee = () => {
  const deleteEmployee = async (id) => {
    try {
      await axios.delete(endpoints.employee.delete(id), {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(STORAGE_KEY)}`,
        },
      });
      
      // Refresh both general and company-specific employee lists
      mutate(endpoints.employee.list);
      
      // Also refresh any company-specific lists that might be cached
      mutate((key) => typeof key === 'string' && key.includes('/employees'));
      
      return true;
    } catch (error) {
      console.error('Failed to delete employee:', error);
      throw error;
    }
  };

  return { deleteEmployee };
};

// Add employee
export const useAddEmployee = () => {
  const addEmployee = async (data) => {
    try {
      const formData = new FormData();
      formData.append('company_id', data.company_id);
      formData.append('first_name', data.first_name);
      formData.append('last_name', data.last_name);
      formData.append('cin', data.cin);
      formData.append('hiring_date', data.hiring_date);
      formData.append('contract_end_date', data.contract_end_date);
      formData.append('contract_type', data.contract_type);
      formData.append('salary', data.salary);
      formData.append('status', data.status);

      const res = await poster(endpoints.employee.create, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(STORAGE_KEY)}`,
        },
      });

      mutate(endpoints.employee.list);
      return res;
    } catch (error) {
      console.error('Failed to add employee:', error);
      throw error;
    }
  };

  return { addEmployee };
}

// Update employee
export const useUpdateEmployee = () => {
  const updateEmployee = async (id, data) => {
    try {
      const formData = new FormData();
      formData.append('_method', 'PUT'); // Laravel method spoofing
      formData.append('company_id', data.company_id);
      formData.append('first_name', data.first_name);
      formData.append('last_name', data.last_name);
      formData.append('cin', data.cin);
      formData.append('hiring_date', data.hiring_date);
      formData.append('contract_end_date', data.contract_end_date);
      formData.append('contract_type', data.contract_type);
      formData.append('salary', data.salary);
      formData.append('status', data.status);

      const res = await poster(endpoints.employee.update(id), formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(STORAGE_KEY)}`,
        },
      });

      mutate(endpoints.employee.list);
      return res;
    } catch (error) {
      console.error('Failed to update employee:', error);
      throw error;
    }
  };

  return { updateEmployee };
}