/* eslint-disable perfectionist/sort-imports */
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { Upload } from 'src/components/upload';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function FileManagerNewFolderDialog({
  open,
  onClose,
  onCreate,
  onUpdate,
  folderName,
  onChangeFolderName,
  title,
  mutate,
  ...other
}) {
  const { t } = useTranslation();
  const { companyId } = useParams();
  const [files, setFiles] = useState([]);

  const dialogTitle = title || t('uploadFiles');

  useEffect(() => {
    if (!open) {
      setFiles([]);
    }
  }, [open]);

  const handleDrop = useCallback(
    (acceptedFiles) => {
      setFiles([...files, ...acceptedFiles]);
    },
    [files]
  );

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error(t('pleaseSelectFiles'));
      return;
    }

    try {
      // Upload each file individually
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        // Ensure we're sending the actual file object
        formData.append('file', file);

        const response = await axios.post(`${import.meta.env.VITE_SERVER}/api/companies/${companyId}/files`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('jwt_access_token')}`,
          },
        });

        return response.data;
      });

      // Wait for all uploads to complete
      const results = await Promise.all(uploadPromises);

      toast.success(t('filesUploadedSuccessfully'));
      if (mutate) {
        mutate();
      }
      onClose();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(t('failedToUploadFiles'));
    }
  };

  const handleRemoveFile = (inputFile) => {
    const filtered = files.filter((file) => file !== inputFile);
    setFiles(filtered);
  };

  const handleRemoveAllFiles = () => {
    setFiles([]);
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose} {...other}>
      <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}> {dialogTitle} </DialogTitle>

      <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
        {(onCreate || onUpdate) && (
          <TextField
            fullWidth
            label={t('folderName')}
            value={folderName}
            onChange={onChangeFolderName}
            sx={{ mb: 3 }}
          />
        )}

        <Upload multiple value={files} onDrop={handleDrop} onRemove={handleRemoveFile} />
      </DialogContent>

      <DialogActions>
        <Button
          variant="contained"
          startIcon={<Iconify icon="eva:cloud-upload-fill" />}
          onClick={handleUpload}
        >
          {t('upload')}
        </Button>

        {!!files.length && (
          <Button variant="outlined" color="inherit" onClick={handleRemoveAllFiles}>
            {t('removeAll')}
          </Button>
        )}

        {(onCreate || onUpdate) && (
          <Stack direction="row" justifyContent="flex-end" flexGrow={1}>
            <Button variant="soft" onClick={onCreate || onUpdate}>
              {onUpdate ? t('save') : t('create')}
            </Button>
          </Stack>
        )}
      </DialogActions>
    </Dialog>
  );
}
