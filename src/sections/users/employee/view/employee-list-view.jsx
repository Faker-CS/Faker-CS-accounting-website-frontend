/* eslint-disable import/no-unresolved */
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useState,useEffect,useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { Box, Table, TableBody } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useSearchParams } from 'src/routes/hooks';

import { useAuth } from 'src/hooks/useAuth';
import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import { _contracts } from 'src/_mock';
import { varAlpha } from 'src/theme/styles';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetEntrepriseById } from 'src/actions/entreprise';
import { useGetEmployees, useDeleteEmployee, useGetEmployeesByCompany } from 'src/actions/employee';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  rowInPage,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { UserTableRow } from '../employee-table-row';
import { UserTableToolbar } from '../employee-table-toolbar';
import { EmployeePayslipDialog } from '../employee-payslip-dialog';
import { UserTableFiltersResult } from '../employee-table-filters-result';
// import en from 'dayjs/locale/en';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export function EmployeeListView() {
  const { t } = useTranslation();
  const { userData } = useAuth();
  const isEntreprise = userData?.roles?.includes('entreprise');
  const isAideComptable = userData?.roles?.includes('aide-comptable');

  const searchParams = useSearchParams();
  const urlCompanyId = searchParams.get('company_id');

  // If user is entreprise, force use of their company_id
  const companyId = isEntreprise ? userData?.company_id : urlCompanyId;
  
  const STATUS_OPTIONS = [
    { value: 'all', label: t('all') },
    { value: 'working', label: t('Working') },
    { value: 'not_working', label: t('notworking') },
  ];

  const TABLE_HEAD = [
    { id: 'first_name', label: t('employees.full_name') },
    { id: 'cin', label: t('employees.cin'), width: 180 },
    { id: 'hiring_date', label: t('employees.hiring_date'), width: 180 },
    { id: 'contract_end_date', label: t('employees.contract_end_date'), width: 220 },
    { id: 'contract_type', label: t('employees.contract_type'), width: 100 },
    { id: 'salary', label: t('employees.salary'), width: 100 },
    { id: 'status', label: t('employees.status'), width: 100 },
    { id: '', width: 88 },
  ];
  
  const table = useTable();

  // Use different hooks based on whether we're filtering by company
  const {employeesData: allEmployeesData} = useGetEmployees();
  const {employeesData: companyEmployeesData} = useGetEmployeesByCompany(companyId);
  
  // Fetch company data when companyId is available
  const { entrepriseData: companyData } = useGetEntrepriseById(companyId);
  
  // Use company-specific data if companyId is provided, otherwise use all employees
  const employeesData = companyId ? companyEmployeesData : allEmployeesData;

  const navigate = useNavigate();
  const confirm = useBoolean();
  
  // Payslip dialog state
  const payslipDialog = useBoolean();
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [tableData, setTableData] = useState(employeesData);

  useEffect(() => {
    if (companyEmployeesData) {
        setTableData(companyEmployeesData); 
    }
}, [companyEmployeesData]);

  const filters = useSetState({ name: '', role: [], status: 'all' });

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
    // here
    companyId,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset =
    !!filters.state.name || filters.state.role.length > 0 || filters.state.status !== 'all';

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const { deleteEmployee } = useDeleteEmployee();

  const handleDeleteRow = async (id) => {
    toast.promise(
      async () => {
        await deleteEmployee(id);
      },
      {
        loading: t('deleting'),
        success: t('employeeDeletedSuccessfully'),
        error: t('deleteFailed'),
      }
    );
  };

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));

    toast.success(t('deleteSuccess'));

    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, tableData, t]);

  const handleEditRow = useCallback(
    (id) => {
      navigate(paths.dashboard.users.employee.show(id));
    },
    [navigate]
  );

  const handlePayslipView = useCallback(
    (employee) => {
      setSelectedEmployee(employee);
      payslipDialog.onTrue();
    },
    [payslipDialog]
  );

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      table.onResetPage();
      filters.setState({ status: newValue });
    },
    [filters, table]
  );

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading={companyId && companyData?.company_name ? `${t('companyEmployees')} - ${companyData.company_name}` : t('list')}
          links={[
            { name: t('dashboard'), href: paths.dashboard.root },
            { name: t('users'), href: paths.dashboard.users.root },
            { name: t('employee') },
            ...(companyId ? [{ name: t('companyEmployees') }] : []),
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.users.employee.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              {t('newEmployee')}
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <Card>
          <Tabs
            value={filters.state.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: (theme) =>
                `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
            }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab
                key={tab.value}
                iconPosition="end"
                value={tab.value}
                label={tab.label}
                icon={
                  <Label
                    variant={
                      ((tab.value === 'all' || tab.value === filters.state.status) && 'filled') ||
                      'soft'
                    }
                    color={
                      (tab.value === 'working' && 'success') ||
                      (tab.value === 'not_working' && 'warning') ||
                      'default'
                    }
                  >
                    {['working', 'not_working'].includes(tab.value)
                      ? tableData.filter((user) => user.status === tab.value).length
                      : tableData.length}
                  </Label>
                }
              />
            ))}
          </Tabs>
          <UserTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            options={{ roles: _contracts }}
          />

          {canReset && (
            <UserTableFiltersResult
              filters={filters}
              totalResults={dataFiltered.length}
              onResetPage={table.onResetPage}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <Box sx={{ position: 'relative' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row.id)
                )
              }
              action={
                <Tooltip title={t('delete')}>
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />
            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={dataFiltered.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={
                    (checked) =>
                      table.onSelectAllRows(
                        checked,
                        dataFiltered.map((row) => row.id)
                      )
                  }
                  checkbox
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <UserTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onEditRow={() => handleEditRow(row.id)}
                        onPayslipView={() => handlePayslipView(row)}
                        isEntreprise={isEntreprise}
                        isAideComptable={isAideComptable}
                        showCheckbox
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

          <TablePaginationCustom
            page={table.page}
            dense={table.dense}
            count={dataFiltered.length}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onChangeDense={table.onChangeDense}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </Card>
      </DashboardContent>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={t('delete')}
        content={
          <>
            {t('areYouSureDeleteItems', { count: table.selected.length })}
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            {t('delete')}
          </Button>
        }
      />
      
      <EmployeePayslipDialog
        open={payslipDialog.value}
        onClose={payslipDialog.onFalse}
        employee={selectedEmployee}
      />
    </>
  );
}

function applyFilter({ inputData, comparator, filters }) {
  const { name, status, role } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (user) => 
        user.first_name?.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        user.last_name?.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        `${user.first_name} ${user.last_name}`.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((user) => user.status === status);
  }

  if (role.length) {
    inputData = inputData.filter((user) => user.contract_type && role.includes(user.contract_type));
  }

  return inputData;
}