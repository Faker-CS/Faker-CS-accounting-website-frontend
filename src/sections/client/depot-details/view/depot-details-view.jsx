import { toast } from 'sonner';
import React, { useState, useEffect, useCallback } from 'react';

import { Box, Card, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';
import { dropFiles, fetchDocuments } from 'src/actions/documents';

import { Iconify } from 'src/components/iconify';
import { UploadBox } from 'src/components/upload';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { STORAGE_KEY } from 'src/auth/context/jwt';

import DepotDetailsRow from '../depot-details-row';

export default function DepotDetailsView({ id }) {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const documents = await fetchDocuments(4, id);
        setFiles(documents.filter((row) => row.document_id === Number(id)));
      } catch (error) {
        console.error('Error fetching documents:', error);
      }
    };
    loadDocuments();
  }, [id]);

  const handleDropMultiFile = useCallback(
    async (acceptedFiles) => {
      try {
        // Upload files
        await dropFiles(acceptedFiles, 4, id); // Upload files

        toast.success('Fichiers ajoutés');

        // Reload the file list from the database
        const documents = await fetchDocuments(4, id);
        setFiles(documents.filter((row) => row.document_id === Number(id)));
      } catch (error) {
        // Check if error has response and message (from backend)
        if (error.response && error.response.data && error.response.data.message) {
          toast.error(error.response.data.message); // Display the backend error message
        } else {
          toast.error('Erreur ajout');
        }
      }
    },
    [id]
  );

  const handleRemoveFile = (inputFile) => {
    const token = sessionStorage.getItem(STORAGE_KEY); // Retrieve auth token

    // Create a Promise without an async executor
    const deletePromise = fetch(`http://127.0.0.1:8000/api/documents/${inputFile.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }).then(async (response) => {
      if (!response.ok) {
        const errorData = await response.text();
        try {
          const jsonData = JSON.parse(errorData);
          throw new Error(jsonData?.message || 'Erreur lors de la suppression');
        } catch {
          throw new Error(errorData || 'Erreur lors de la suppression');
        }
      }

      // Update UI by filtering out the deleted file
      setFiles((prevFiles) => prevFiles.filter((file) => file.id !== inputFile.id));

      return 'Suppression effectuée!';
    });

    // Use toast.promise to handle loading, success, and error states
    toast.promise(deletePromise, {
      loading: 'En cours de suppression...',
      success: 'Suppression effectuée!',
      error: 'Erreur lors de la suppression!',
    });

    return deletePromise; // Ensure function execution waits for promise resolution
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Dépot"
        links={[
          {
            name: 'Accueil',
            href: paths.dashboard.root,
            icon: <Iconify icon="solar:home-angle-2-bold-duotone" />,
          },
          {
            name: 'Déclaration d’impôt',
            href: paths.dashboard.declarationImpot,
          },
          {
            name: 'Déposer',
          },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Box
        display="grid"
        gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }}
        gap={3}
      >
        {files.length > 0 &&
          files.map((file) => (
            <DepotDetailsRow file={file} onRemove={() => handleRemoveFile(file)} />
          ))}
        <Card sx={{ height: 250 }}>
          <UploadBox
            sx={{ width: '100%', height: '100%' }}
            placeholder={
              <Box
                sx={{
                  gap: 0.5,
                  display: 'flex',
                  alignItems: 'center',
                  color: 'text.disabled',
                  flexDirection: 'column',
                }}
              >
                <Iconify icon="eva:cloud-upload-fill" width={40} />
                <Typography variant="body2">Télécharger le fichier</Typography>
              </Box>
            }
            multiple
            value={files}
            onDrop={handleDropMultiFile}
            onRemove={handleRemoveFile}
            onUpload={() => console.info('ON UPLOAD')}
          />
        </Card>
      </Box>
    </DashboardContent>
  );
}