/* eslint-disable import/no-unresolved */
import { toast } from 'sonner';
import { useTheme } from '@emotion/react';
import { useTranslation } from 'react-i18next';
import React, { useState, useEffect, useCallback } from 'react';

import { Tab, Box, Card, Tabs, Table, TableBody } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useSetState } from 'src/hooks/use-set-state';

import { fIsAfter, fIsBetween } from 'src/utils/format-time';

import { varAlpha } from 'src/theme/styles';
import { useGetServices } from 'src/actions/services';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetForms, useDeleteForm } from 'src/actions/forms';

import { Label } from 'src/components/label';
import { Scrollbar } from 'src/components/scrollbar';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  rowInPage,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { DemandesTableRow } from '../demandes-table-row';
import { DemandesTableToolbar } from '../demandes-table-toolbar';
import { DemandesTableFiltersResult } from '../demandes-table-filters-result';

// ----------------------------------------------------------------------

export default function DemandesListeView() {
  const { t } = useTranslation();
  const { servicesData } = useGetServices();

  const TABLE_HEAD = [
    { id: 'name', label: t('client') },
    { id: 'created_at', label: t('createdAt') },
    { id: 'service', label: t('service') },
    { id: 'status', label: t('status') },
    { id: '' },
  ];
  const { deleteForm } = useDeleteForm();
  const [services, setServices] = useState([]);

  useEffect(() => {
    if (servicesData) {
      setServices(servicesData);
    }
  }, [servicesData]);

  const { forms } = useGetForms();

  const theme = useTheme();

  const router = useRouter();

  const table = useTable({ defaultOrderBy: 'created_at' });

  const [tableData, setTableData] = useState([]);
  useEffect(() => {
    if (forms) {
      setTableData(forms);
    }
  }, [forms]);

  const filters = useSetState({
    name: '',
    service: [],
    status: 'all',
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
    filters.state.service.length > 0 ||
    filters.state.status !== 'all' ||
    (!!filters.state.startDate && !!filters.state.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  // Helper functions for TABS counts
  const getInvoiceLength = (status) => tableData.filter((item) => item.status === status).length;
  const getInWorkLength = () => tableData.filter((item) => item.status === 'accepted' || item.status === 'in_work').length;

  const TABS = [
    {
      value: 'all',
      label: t('all'),
      color: 'default',
      count: tableData.length,
    },
    {
      value: 'in_work',
      label: t('inWork'),
      color: 'success',
      count: getInWorkLength(),
    },
    {
      value: 'review',
      label: t('onHold'),
      color: 'warning',
      count: getInvoiceLength('review'),
    },
    {
      value: 'rejected',
      label: t('missingFile'),
      color: 'error',
      count: getInvoiceLength('rejected'),
    },
    {
      value: 'pending',
      label: t('done'),
      color: 'default',
      count: getInvoiceLength('pending'),
    },
  ];

  const handleDeleteRow = useCallback(
    async (id) => {
      const deleteRow = tableData.filter((row) => row.id !== id);

      toast.promise(
        async () => {
          const result = await deleteForm(id);
          if (!result.success) throw new Error(result.message);

          setTableData(deleteRow);
          table.onUpdatePageDeleteRow(dataInPage.length);
        },
        {
          loading: t('deleting'),
          success: t('formDeletedSuccessfully'),
          error: t('formDeletionFailed'),
        }
      );
    },
    [dataInPage.length, table, tableData, deleteForm, t]
  );

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.viewForm(id));
    },
    [router]
  );

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      table.onResetPage();
      filters.setState({ status: newValue });
    },
    [filters, table]
  );

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={t('demandsListHeading')}
        links={[
          { name: t('home'), href: paths.dashboard.root },
          { name: t('demands'), href: paths.dashboard.demandes },
          { name: t('list') },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card>
        <Tabs
          value={filters.state.status}
          onChange={handleFilterStatus}
          sx={{
            px: 2.5,
            boxShadow: `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
          }}
        >
          {TABS.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              label={tab.label}
              iconPosition="end"
              icon={
                <Label
                  variant={
                    ((tab.value === 'all' || tab.value === filters.state.status) && 'filled') ||
                    'soft'
                  }
                  color={tab.color}
                >
                  {tab.count}
                </Label>
              }
            />
          ))}
        </Tabs>

        <DemandesTableToolbar
          filters={filters}
          dateError={dateError}
          onResetPage={table.onResetPage}
          options={{ services: services.map((option) => option.name) }}
        />

        {canReset && (
          <DemandesTableFiltersResult
            filters={filters}
            onResetPage={table.onResetPage}
            totalResults={dataFiltered.length}
            sx={{ p: 2.5, pt: 0 }}
          />
        )}

        <Box sx={{ position: 'relative' }}>
          <TableSelectedAction
            dense={table.dense}
            numSelected={table.selected.length}
            rowCount={dataFiltered.length}
            onSelectAllRows={(checked) => {
              table.onSelectAllRows(
                checked,
                dataFiltered.map((row) => row.id)
              );
            }}
          />

          <Scrollbar sx={{ minHeight: 444 }}>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
                rowCount={dataFiltered.length}
                onSort={table.onSort}
              />

              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <DemandesTableRow
                      key={row.id}
                      row={row}
                      onViewRow={() => handleViewRow(row.id)}
                      onDeleteRow={() => handleDeleteRow(row.id)}
                    />
                  ))}

                <TableEmptyRows
                  height={table.dense ? 56 : 56 + 20}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                />

                <TableNoData notFound={notFound} />
              </TableBody>
            </Table>
          </Scrollbar>
          <TablePaginationCustom
            page={table.page}
            dense={table.dense}
            count={dataFiltered.length}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onChangeDense={table.onChangeDense}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </Box>
      </Card>
    </DashboardContent>
  );
}

function applyFilter({ inputData, comparator, filters, dateError }) {
  const { name, status, service, startDate, endDate } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (invoice) => invoice.user.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((invoice) => invoice.status === status);
  }

  if (service.length) {
    inputData = inputData.filter((invoice) => service.includes(invoice.service.name));
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((invoice) => fIsBetween(invoice.created_at, startDate, endDate));
    }
  }

  return inputData;
}