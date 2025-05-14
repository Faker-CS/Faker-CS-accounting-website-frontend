import axios from 'axios';
import { useRef, useState, useEffect, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import TableRow, { tableRowClasses } from '@mui/material/TableRow';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDate, fTime } from 'src/utils/format-time';

import { varAlpha } from 'src/theme/styles';
import { dropFiles } from 'src/actions/documents';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { FileThumbnail } from 'src/components/file-thumbnail';

import { STORAGE_KEY } from 'src/auth/context/jwt';

// ----------------------------------------------------------------------

export function FileManagerTableRow({ row, selected }) {
  const theme = useTheme();

  const [file, setFile] = useState([]);
  const fileInputRef = useRef(null);

  const details = useBoolean();

  const confirm = useBoolean();

  const fetchDocumentDetails = useCallback(async () => {
    try {
      const response = await axios.get(`https://as-compta.ckcom.fr/api/documents/${row.id}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem(STORAGE_KEY)}`,
        },
      });
      setFile(response.data);
    } catch (err) {
      console.error(err);
      setFile({});
    }
  }, [row.id]);

  useEffect(() => {
    if (row.id) {
      fetchDocumentDetails();
    }
  }, [row.id, fetchDocumentDetails]);

  const defaultStyles = {
    borderTop: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
    borderBottom: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
    '&:first-of-type': {
      borderTopLeftRadius: 16,
      borderBottomLeftRadius: 16,
      borderLeft: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
    },
    '&:last-of-type': {
      borderTopRightRadius: 16,
      borderBottomRightRadius: 16,
      borderRight: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
    },
  };

  const deleteFile = async () => {
    confirm.onFalse();
    const deletePromise = fetch(`https://as-compta.ckcom.fr/api/documents/${file.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem(STORAGE_KEY)}`,
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

      setFile([]);
      return 'Suppression effectuée!';
    });

    toast.promise(deletePromise, {
      loading: 'En cours de suppression...',
      success: 'Suppression effectuée!',
      error: 'Erreur lors de la suppression!',
    });

    return deletePromise;
  };

  const handleRowClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    const uploadPromise = dropFiles([selectedFile], row.service_id, row.id);

    toast.promise(uploadPromise, {
      loading: 'Téléchargement en cours...',
      success: 'Succès du téléchargement',
      error: 'Erreur de téléchargement',
    });

    try {
      await uploadPromise;
      fetchDocumentDetails();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <TableRow
        selected={selected}
        sx={{
          borderRadius: 2,
          [`&.${tableRowClasses.selected}, &:hover`]: {
            backgroundColor: 'background.paper',
            boxShadow: theme.customShadows.z20,
            transition: theme.transitions.create(['background-color', 'box-shadow'], {
              duration: theme.transitions.duration.shortest,
            }),
            '&:hover': { backgroundColor: 'background.paper', boxShadow: theme.customShadows.z20 },
          },
          [`& .${tableCellClasses.root}`]: { ...defaultStyles },
          ...(details.value && { [`& .${tableCellClasses.root}`]: { ...defaultStyles } }),
        }}
      >
        <TableCell onClick={handleRowClick}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <FileThumbnail file={`${file.original_name?.split('.').pop()}` || 'pdf'} />

            <Typography
              noWrap
              variant="inherit"
              sx={{
                maxWidth: 360,
                cursor: 'pointer',
                ...(details.value && { fontWeight: 'fontWeightBold' }),
              }}
            >
              <ListItemText
                primary={row.name}
                secondary={file.original_name}
                primaryTypographyProps={{ typography: 'body2' }}
                secondaryTypographyProps={{ mt: 0.5, component: 'span', typography: 'caption' }}
              />
            </Typography>
          </Stack>
        </TableCell>

        <TableCell onClick={handleRowClick} sx={{ whiteSpace: 'nowrap' }}>
          {file.original_name?.split('.').pop()}
        </TableCell>

        <TableCell onClick={handleRowClick} sx={{ whiteSpace: 'nowrap' }}>
          <ListItemText
            primary={fDate(file.created_at)}
            secondary={fTime(file.created_at)}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{ mt: 0.5, component: 'span', typography: 'caption' }}
          />
        </TableCell>

        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          {file?.id ? (
            <IconButton color="error" onClick={() => confirm.onTrue()}>
              <Iconify icon="tabler:trash" />
            </IconButton>
          ) : null}
        </TableCell>
      </TableRow>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Supprimer"
        content="Êtes-vous sûr de vouloir effacer ?"
        action={
          <Button variant="contained" color="error" onClick={() => deleteFile()}>
            Supprimer
          </Button>
        }
      />
    </>
  );
}