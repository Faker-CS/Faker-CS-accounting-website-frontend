/* eslint-disable import/no-unresolved */
import { toast } from 'sonner';
import { useTheme } from '@emotion/react';
import React, { useState, useEffect, useCallback } from 'react';

import { Tab, Box, Card, Tabs, Stack, Table, Divider, TableBody } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useSetState } from 'src/hooks/use-set-state';

import { sumBy } from 'src/utils/helper';
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
} from 'src/components/table';

import { DemandesAnalytic } from '../demandes-analytic';
import { DemandesTableRow } from '../demandes-table-row';
import { DemandesTableToolbar } from '../demandes-table-toolbar';
import { DemandesTableFiltersResult } from '../demandes-table-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Client' },
  { id: 'created_at', label: 'Created at' },
  { id: 'service', label: 'Service' },
  { id: 'status', label: 'Status' },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function DemandesListeView() {
  const { servicesData } = useGetServices();
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

  const getInvoiceLength = (status) => tableData.filter((item) => item.status === status).length;

  const getTotalAmount = (status) =>
    sumBy(
      tableData.filter((item) => item.status === status),
      (invoice) => invoice.totalAmount
    );

  const getPercentByStatus = (status) => (getInvoiceLength(status) / tableData.length) * 100;

  // Helper to count both 'accepted' and 'in_work' as 'In Work'
  const getInWorkLength = () => tableData.filter((item) => item.status === 'accepted' || item.status === 'in_work').length;
  const getInWorkAmount = () => sumBy(tableData.filter((item) => item.status === 'accepted' || item.status === 'in_work'), (invoice) => invoice.totalAmount);
  const getInWorkPercent = () => (getInWorkLength() / tableData.length) * 100;

  const TABS = [
    {
      value: 'all',
      label: 'All',
      color: 'default',
      count: tableData.length,
    },
    {
      value: 'in_work',
      label: 'In Work',
      color: 'success',
      count: getInWorkLength(),
    },
    {
      value: 'review',
      label: 'On Hold',
      color: 'warning',
      count: getInvoiceLength('review'),
    },
    {
      value: 'rejected',
      label: 'Missing file',
      color: 'error',
      count: getInvoiceLength('rejected'),
    },
    {
      value: 'pending',
      label: 'Done',
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
          loading: 'Suppression...',
          success: 'Formulaire supprimé avec succès !',
          error: 'Échec de la suppression du formulaire !',
        }
      );
    },
    [dataInPage.length, table, tableData, deleteForm]
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
        heading="Demands list"
        links={[
          { name: 'Home', href: paths.dashboard.root },
          { name: 'Demands', href: paths.dashboard.demandes },
          { name: 'List' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card sx={{ mb: { xs: 3, md: 5 } }}>
        <Scrollbar sx={{ minHeight: 108 }}>
          <Stack
            direction="row"
            divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
            sx={{ py: 2 }}
          >
            <DemandesAnalytic
              title="All demands"
              total={tableData.length}
              percent={100}
              price={sumBy(tableData, (invoice) => invoice.totalAmount)}
              icon="solar:bill-list-bold-duotone"
              color={theme.vars.palette.info.main}
            />
            <DemandesAnalytic
              title="In Work"
              total={getInWorkLength()}
              percent={getInWorkPercent()}
              price={getInWorkAmount()}
              icon="solar:file-check-bold-duotone"
              color={theme.vars.palette.success.main}
            />
            <DemandesAnalytic
              title="On Hold"
              total={getInvoiceLength('review')}
              percent={getPercentByStatus('review')}
              price={getTotalAmount('review')}
              icon="solar:file-check-bold-duotone"
              color={theme.vars.palette.warning.main}
            />
            <DemandesAnalytic
              title="Missing file"
              total={getInvoiceLength('rejected')}
              percent={getPercentByStatus('rejected')}
              price={getTotalAmount('rejected')}
              icon="solar:file-check-bold-duotone"
              color={theme.vars.palette.error.main}
            />
            <DemandesAnalytic
              title="Done"
              total={getInvoiceLength('pending')}
              percent={getPercentByStatus('pending')}
              price={getTotalAmount('pending')}
              icon="solar:file-check-bold-duotone"
              color={theme.vars.palette.text.secondary}
            />
          </Stack>
        </Scrollbar>
      </Card>

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