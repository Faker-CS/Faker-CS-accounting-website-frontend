import axios from 'axios';
import { useState, useCallback } from 'react';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import { Stack, Divider, TextField, InputLabel, Typography } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import { fIsAfter, fIsBetween } from 'src/utils/format-time';

import { usePutRecords } from 'src/actions/user';

import { toast } from 'src/components/snackbar';
import { fileFormat } from 'src/components/file-thumbnail';
import { EmptyContent } from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useTable, rowInPage, getComparator } from 'src/components/table';

import { useMockedUser } from 'src/auth/hooks';
import { STORAGE_KEY } from 'src/auth/context/jwt';

import { FileManagerTable } from '../file-manager-table';

// ----------------------------------------------------------------------

export function FileManagerView({ files, setServiceStatus, serviceId }) {
  const { user } = useMockedUser();

  const { updateMatricule } = usePutRecords();

  const [matricule, setMatricule] = useState(user.matricule);

  const table = useTable({ defaultRowsPerPage: 10 });

  const confirm = useBoolean();

  const [tableData, setTableData] = useState(files);

  const filters = useSetState({
    name: '',
    type: [],
    startDate: null,
    endDate: null,
  });

  const dateError = fIsAfter(filters.state.startDate, filters.state.endDate);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
    dateError,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset =
    !!filters.state.name ||
    filters.state.type.length > 0 ||
    (!!filters.state.startDate && !!filters.state.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleDeleteItem = useCallback(
    (id) => {
      const deleteRow = tableData.filter((row) => row.id !== id);

      toast.success('Delete success!');

      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData]
  );

  const handleDeleteItems = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));

    toast.success('Delete success!');

    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const SubmitData = async (e) => {
    e.preventDefault();
    toast.promise(updateMatricule({ matricule }), {
      loading: 'Mise à jour en cours...',
      success: 'Profil mis à jour avec succès!',
      error: 'Échec de la mise à jour du profil!',
    });
  };

  const SubmitFiles = async (e) => {
    e.preventDefault();

    if (matricule) {
      try {
        const response = await axios.post(
          `http://127.0.0.1:8000/api/form/${serviceId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(STORAGE_KEY)}`,
              'Content-Type': 'application/json',
            },
          }
        );

        switch (response.data.status) {
          case 'form_not_found':
            toast.info('Remplissez les documents nécessaires.');
            break;
          case 'submitted_for_review':
            toast.success('Formulaire soumis pour révision.');
            setServiceStatus({ value: 'review', label: 'En attente', color: 'warning' });
            break;
          case 'form_in_review':
            toast.warning('Le formulaire est déjà en révision.');
            break;
          case 'form_accepted':
            toast.success('Formulaire accepté.');
            setServiceStatus({ value: 'accepted', label: 'Accepté', color: 'success' });
            break;
          default:
            toast.error('Erreur inattendue.');
            break;
        }
      } catch (error) {
        toast.error("Échec de l'envoi du formulaire. Veuillez réessayer.");
      }
    } else {
      toast.info('Complétez vos informations!');
    }
  };

  return (
    <>
      <Typography mb={2} variant="h6">
        General informations
      </Typography>
      <Grid container spacing={2}>
        <Grid xs={12} md={4}>
          <InputLabel mb={1}>Tax Identification Number (Matricule Fiscal)</InputLabel>
          <TextField fullWidth value={matricule} onChange={(e) => setMatricule(e.target.value)} />
        </Grid>
      </Grid>
      <Stack py={2} alignItems="flex-end">
        <Button variant="contained" color="primary" onClick={(e) => SubmitData(e)}>
          Valider
        </Button>
      </Stack>
      <Divider sx={{ my: 1, borderStyle: 'dashed' }} />
      {notFound ? (
        <EmptyContent filled sx={{ py: 10 }} />
      ) : (
        <FileManagerTable
          table={table}
          dataFiltered={dataFiltered}
          onDeleteRow={handleDeleteItem}
          notFound={notFound}
          onOpenConfirm={confirm.onTrue}
        />
      )}

      <Stack my={2} alignItems="flex-start">
        <Button variant="contained" color="primary" onClick={(e) => SubmitFiles(e)}>
          Envoyer ma demande
        </Button>
      </Stack>
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Supprimer"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteItems();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

function applyFilter({ inputData, comparator, filters, dateError }) {
  const { name, type, startDate, endDate } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (file) => file.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (type.length) {
    inputData = inputData.filter((file) => type.includes(fileFormat(file.type)));
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((file) => fIsBetween(file.createdAt, startDate, endDate));
    }
  }

  return inputData;
}
