/* eslint-disable import/no-unresolved */
/* eslint-disable perfectionist/sort-imports */
import { useRef, useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { FileManagerFileItem } from 'src/sections/file-manager/file-manager-file-item';
import { FileManagerPanel } from 'src/sections/file-manager/file-manager-panel';
import { useBoolean } from 'src/hooks/use-boolean';
import { paths } from 'src/routes/paths';
import { DashboardContent } from 'src/layouts/dashboard';
import { CONFIG } from 'src/config-global';
import { toast } from 'src/components/snackbar';
import { FileManagerNewFolderDialog } from '../file-manager-new-folder-dialog';

export function CompanyFilesView() {
  const { t } = useTranslation();
  const { companyId } = useParams();
  const [files, setFiles] = useState([]);
  const [company, setCompany] = useState(null);
  const fileInputRef = useRef();
  const upload = useBoolean();

  const fetchFiles = useCallback(() => {
    axios.get(`${import.meta.env.VITE_SERVER}/api/companies/${companyId}/files`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt_access_token')}`,
      },
    }).then(res => setFiles(res.data.files || []));
  }, [companyId]);
  
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_SERVER}/api/companies/${companyId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt_access_token')}`,
      },
    }).then(res => setCompany(res.data));
    fetchFiles();
  }, [companyId, fetchFiles]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      await axios.post(`${import.meta.env.VITE_SERVER}/api/companies/${companyId}/files`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('jwt_access_token')}`,
        },
      });
      fetchFiles();
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  // Helper to map a file URL to a file object for FileManagerFileItem
  const mapUrlToFile = (fileInfo) => {
    if (!fileInfo) return null;
    
    // Extract the filename from the URL
    const { name } = fileInfo;
    // Remove the unique ID prefix if it exists
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

  const handleDownload = (file) => {
    window.open(`${CONFIG.serverUrl}${file.url}`, '_blank');
  };

  const handleDelete = async (file) => {
    try {
      // Extract the file path from the URL
      const filePath = file.url;
      
      // Make sure we're using the correct API endpoint
      const response = await axios.delete(`${import.meta.env.VITE_SERVER}/api/companies/${companyId}/files`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt_access_token')}`,
        },
        data: { filePath }
      });
      
      // Show success toast
      toast.success(t('fileDeletedSuccessfully'));
      
      // Refresh the files list after successful deletion
      fetchFiles();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(t('failedToDeleteFile'));
    }
  };

  // Effect to trigger file input when upload.value is true
  // useEffect(() => {
  //   if (upload.value && fileInputRef.current) {
  //     fileInputRef.current.click();
  //     upload.onFalse();
  //   }
  // }, [upload]);

  return (
    <>
    <DashboardContent>
    <Stack spacing={3}>
      <Typography variant="h4">{company ? company.company_name : t('company')} {t('files')}</Typography>
      <FileManagerPanel
        title={t('recentFiles')}
        link={paths.dashboard.fileManager}
        onOpen={upload.onTrue}
      />
      {/* <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleUpload}
      /> */}
      <Stack spacing={2} direction="row" flexWrap="wrap">
        {Array.isArray(files) && files.length === 0 && <Typography>{t('noFilesFound')}</Typography>}
        {Array.isArray(files) && files.map((fileInfo, idx) => {
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
    <FileManagerNewFolderDialog open={upload.value} onClose={upload.onFalse} mutate={fetchFiles} />
    </>
  );
} 