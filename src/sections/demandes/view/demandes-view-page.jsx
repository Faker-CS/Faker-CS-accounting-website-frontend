import { toast } from 'sonner';
import React, { useRef, useState, useCallback } from 'react';

import { LoadingButton } from '@mui/lab';
import {
  Box,
  Chip,
  Stack,
  MenuItem,
  MenuList,
  TextField,
  Typography,
  InputAdornment,
} from '@mui/material';

import { useSetState } from 'src/hooks/use-set-state';

import { fDate } from 'src/utils/format-time';

import { statusData } from 'src/_mock/_status';
import { useUpdateForm } from 'src/actions/forms';
import { DashboardContent } from 'src/layouts/dashboard';
import { downloadDocumentFile } from 'src/actions/documents';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { useTable, getComparator } from 'src/components/table';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { FiltersBlock, FiltersResult } from 'src/components/filters-result';

import { STORAGE_KEY } from 'src/auth/context/jwt';

import { DemandeListRow } from '../demande-list-row';

export function DemandesViewPage({ form }) {
  const table = useTable({ defaultRowsPerPage: 10 });
  const [tableData, setTableData] = useState(form);
  const [statusValue, setStatusValue] = useState(tableData?.status);
  const popover = usePopover();
  const { updateForm } = useUpdateForm();
  const filters = useSetState({
    name: '',
  });

  const handleChangeStatus = useCallback(
    async (value, id) => {
      toast.promise(
        async () => {
          const result = await updateForm(id, value);
          if (!result.success) throw new Error(result.message);
          setStatusValue(value);
        },
        {
          loading: 'Mise à jour en cours...',
          success: 'Formulaire mis à jour avec succès',
          error: 'Erreur lors de la mise à jour du formulaire',
        }
      );
    },
    [updateForm]
  );

  const handleFilterName = useCallback(
    (event) => {
      table.onResetPage();
      filters.setState({ name: event.target.value });
    },
    [filters, table]
  );

  const containerRef = useRef(null);

  const handleRemoveKeyword = useCallback(() => {
    table.onResetPage();
    filters.setState({ name: '' });
  }, [filters, table]);

  const dataFiltered = form?.documents
    ? applyFilter({
        inputData: form,
        comparator: getComparator(table.order, table.orderBy),
        filters: filters.state,
      })
    : [];

  const handleDeleteItem = (id) => {
    const token = localStorage.getItem(STORAGE_KEY);

    const deletePromise = fetch(`http://127.0.0.1:8000/api/documents/${id}`, {
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

      return 'Suppression effectuée!';
    });

    toast.promise(deletePromise, {
      loading: 'En cours de suppression...',
      success: 'Suppression effectuée!',
      error: 'Erreur lors de la suppression!',
    });

    return deletePromise;
  };

  const handleDownloadItem = async (id) => {
    const result = await downloadDocumentFile(id);
    if (!result.success) {
      toast.error(result.message || 'Download failed');
    } else {
      toast.success('File downloaded successfully');
    }
  };

  const canReset = !!filters.state.name;

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const renderFilters = (
    <Stack
      spacing={2}
      direction={{ xs: 'column', md: 'row' }}
      alignItems={{ xs: 'flex-end', md: 'center' }}
    >
      <TextField
        value={filters.state.name}
        onChange={handleFilterName}
        placeholder="Rechercher..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
        sx={{ width: { xs: 1, md: 260 } }}
      />
    </Stack>
  );

  const renderResults = (
    <FiltersResult totalResults={dataFiltered.length} onReset={() => table.onResetPage()}>
      <FiltersBlock label="Nom de dossier:" isShow={!!filters.state.name}>
        <Chip label={filters.state.name} onDelete={handleRemoveKeyword} />
      </FiltersBlock>
    </FiltersResult>
  );

  return (
    <DashboardContent>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack>
          <Typography variant="h4">{form.service.name}</Typography>
          <Stack direction="row" gap={2}>
            <Typography variant="caption">{form.user.name}</Typography>
            {form.user.matricule && (
              <Typography variant="caption">Matricule: {form.user.matricule}</Typography>
            )}
            {form.user.demenagement && (
              <Typography variant="caption">
                Date démenagement: {fDate(form.user.demenagement)}
              </Typography>
            )}
            {form.user.adresse && (
              <Typography variant="caption">Addresse: {form.user.adresse}</Typography>
            )}
            {form.user.situation && (
              <Typography variant="caption">Situation: {form.user.situation}</Typography>
            )}
          </Stack>
        </Stack>
        <Stack direction="row" gap={4} alignItems="center">
          {(() => {
            const status = statusData.find((s) => s.value === statusValue) || {
              label: statusValue,
              color: 'default',
            };

            return (
              <LoadingButton
                color={status.color}
                variant="contained"
                endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
                onClick={popover.onOpen}
                sx={{ textTransform: 'capitalize' }}
              >
                {status.label}
              </LoadingButton>
            );
          })()}

          <CustomPopover
            open={popover.open}
            anchorEl={popover.anchorEl}
            onClose={popover.onClose}
            slotProps={{ arrow: { placement: 'top-right' } }}
          >
            <MenuList>
              {statusData
                .filter((status) => status.value !== 'none')
                .map((status) => (
                  <MenuItem
                    key={status.value}
                    value={status.value}
                    onClick={() => {
                      handleChangeStatus(status.value, form.id);
                      popover.onClose();
                    }}
                  >
                    {status.label}
                  </MenuItem>
                ))}
            </MenuList>
          </CustomPopover>
        </Stack>
      </Stack>

      <Stack spacing={2.5} sx={{ my: { xs: 3, md: 5 } }}>
        {renderFilters}

        {canReset && renderResults}
      </Stack>

      {notFound ? (
        <EmptyContent filled sx={{ py: 10 }} />
      ) : (
        <Box ref={containerRef}>
          {dataFiltered.map((document) => (
            <DemandeListRow
              document={document}
              onDeleteItem={handleDeleteItem}
              onDownloadItem={handleDownloadItem}
            />
          ))}
        </Box>
      )}
    </DashboardContent>
  );
}

function applyFilter({ inputData, comparator, filters }) {
  const { name } = filters;

  const stabilizedThis = inputData.documents.map((el, index) => [el, index]);

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

  return inputData;
}
