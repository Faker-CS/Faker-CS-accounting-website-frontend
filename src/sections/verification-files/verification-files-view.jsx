/* eslint-disable import/no-unresolved */
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { useAuth } from 'src/hooks/useAuth';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';

import { toast } from 'src/components/snackbar';

import { FileManagerFileItem } from 'src/sections/file-manager/file-manager-file-item';

export function VerificationFilesView() {
  const { t } = useTranslation();
  const { userData } = useAuth();
  const [files, setFiles] = useState([]);
  const [companyName, setCompanyName] = useState('');

  useEffect(() => {
    if (!userData?.company_id) return;
    const token = localStorage.getItem('jwt_access_token');
    // Fetch company name (optional)
    axios.get(`${import.meta.env.VITE_SERVER}/api/companies/${userData.company_id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setCompanyName(res.data.company_name || ''))
      .catch(() => setCompanyName(''));
    // Fetch files for this company
    axios.get(`${import.meta.env.VITE_SERVER}/api/companies/${userData.company_id}/files`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setFiles(res.data.files || []));
  }, [userData]);

  const handleDownload = (file) => {
    window.open(`${CONFIG.serverUrl}${file.url}`, '_blank');
  };

  const handleDelete = async (file) => {
    try {
      const filePath = file.url;
      const token = localStorage.getItem('jwt_access_token');
      await axios.delete(`${import.meta.env.VITE_SERVER}/api/companies/${userData.company_id}/files`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { filePath }
      });
      toast.success(t('fileDeletedSuccessfully'));
      // Refresh files
      const filesRes = await axios.get(`${import.meta.env.VITE_SERVER}/api/companies/${userData.company_id}/files`, { headers: { Authorization: `Bearer ${token}` } });
      setFiles(filesRes.data.files || []);
    } catch (error) {
      toast.error(t('failedToDeleteFile'));
    }
  };

  // Helper to map a file URL to a file object for FileManagerFileItem
  const mapUrlToFile = (fileInfo) => {
    if (!fileInfo) return null;
    const { name } = fileInfo;
    const cleanName = name.includes('_') ? name.split('_').slice(1).join('_') : name;
    const type = fileInfo.type || (cleanName.includes('.') ? cleanName.split('.').pop() : '');
    return {
      id: fileInfo.url,
      name: cleanName,
      url: fileInfo.url,
      type,
      size: fileInfo.size,
      lastModified: fileInfo.lastModified
    };
  };

  return (
    <DashboardContent>
      <Stack spacing={3}>
        <Typography variant="h4">{t('verificationFiles')}</Typography>
        <Typography variant="h6" sx={{ mt: 3 }}>{companyName}</Typography>
        <Stack spacing={2} direction="row" flexWrap="wrap">
          {files.length === 0 && <Typography>{t('noFilesFound')}</Typography>}
          {files.map((fileInfo, idx) => {
            const file = mapUrlToFile(fileInfo);
            if (!file) return null;
            return (
              <FileManagerFileItem
                key={file.id || idx}
                file={file}
                onDownload={() => handleDownload(file)}
                onDelete={() => handleDelete(file)}
              />
            );
          })}
        </Stack>
      </Stack>
    </DashboardContent>
  );
} 