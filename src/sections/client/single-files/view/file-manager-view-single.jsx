import axios from 'axios';
import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

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
      toast.success(t('deleteSuccess'));
      setTableData(deleteRow);
      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData, t]
  );

  const handleDeleteItems = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));
    toast.success(t('deleteSuccess'));
    setTableData(deleteRows);
    table.onUpdatePageDeleteRows({
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, tableData, t]);

  const SubmitFiles = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER}/api/form/${serviceId}`,
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
          toast.info(t('fillRequiredDocuments'));
          break;
        case 'submitted_for_review':
          toast.success(t('formSubmittedForReview'));
          setServiceStatus({ value: 'review', label: t('pending'), color: 'warning' });
          break;
        case 'form_in_review':
          toast.warning(t('formAlreadyInReview'));
          break;
        case 'form_accepted':
          toast.success(t('formAccepted'));
          setServiceStatus({ value: 'accepted', label: t('accepted'), color: 'success' });
          break;
        default:
          toast.error(t('unexpectedError'));
          break;
      }
    } catch (error) {
      toast.error(t('formSendError'));
    }
  };

  return (
    <>
      <Typography mb={2} variant="h6">
        {t('generalInformations')}
      </Typography>
      <Grid container spacing={2}>
        <Grid xs={12} md={4}>
          {/* Remove the Tax Identification Number (Matricule Fiscal) field and related code */}
        </Grid>
      </Grid>
      <Stack py={2} alignItems="flex-end">
        {/* Remove the 'Valider' button and its Stack */}
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
          {t('sendMyRequest')}
        </Button>
      </Stack>
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={t('delete')}
        content={t('areYouSureDelete', { count: table.selected.length })}
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteItems();
              confirm.onFalse();
            }}
          >
            {t('delete')}
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
