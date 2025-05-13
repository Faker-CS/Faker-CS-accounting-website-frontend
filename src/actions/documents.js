import useSWR from 'swr';
import axios from 'axios';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/utils/axios';

import { STORAGE_KEY } from 'src/auth/context/jwt';

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

export function useGetDocuments(i) {
  const url = endpoints.documents.getByService(i);

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);
  const memoizedValue = useMemo(
    () => ({
      documents: data?.documents || [],
      documentsLoading: isLoading,
      documentsError: error,
      documentsValidating: isValidating,
      documentsEmpty: !isLoading && !data?.documents.length,
    }),
    [data?.documents, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export async function dropFiles(files, serviceId, documentId) {
  const formData = new FormData();
  const url = 'http://127.0.1:8000/api/documents/upload';

  formData.append('service_id', serviceId);
  formData.append('document_id', documentId);

  files.forEach((file) => {
    formData.append('file[]', file);
  });

  try {
    const response = await axios.post(url, formData, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem(STORAGE_KEY)}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data);
    } else if (error.request) {
      throw new Error('No response received');
    } else {
      throw new Error(error.message);
    }
  }
}

export const fetchDocuments = async (serviceId, id) => {
  try {
    const response = await axios.get(
      `http://127.0.1:8000/api/user/documents/${serviceId}/${id}`,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem(STORAGE_KEY)}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching documents:', error);
    return [];
  }
};

export async function downloadDocumentFile(documentId) {
  try {
    const response = await axios.get(
      `http://127.0.1:8000/api/documents/download/${documentId}`,
      {
        responseType: 'blob', // Important for binary files
        headers: { Authorization: `Bearer ${sessionStorage.getItem(STORAGE_KEY)}` },
      }
    );

    // Create a Blob from the response data
    const blob = new Blob([response.data], { type: response.headers['content-type'] });

    // Create a link and trigger a download
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      response.headers['content-disposition']
        ? response.headers['content-disposition'].split('filename=')[1].replace(/['"]/g, '')
        : 'downloaded_file'
    );
    document.body.appendChild(link);
    link.click();

    // Cleanup
    link.remove();
    window.URL.revokeObjectURL(url);

    return { success: true };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Unknown error' };
  }
}