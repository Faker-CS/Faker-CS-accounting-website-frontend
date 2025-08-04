import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { useBoolean } from 'src/hooks/use-boolean';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { UserQuickEditForm } from './employee-quick-edit-form';

// ----------------------------------------------------------------------

export function UserTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow, onPayslipView, isEntreprise, isAideComptable, showCheckbox }) {
  const { t } = useTranslation();
  const confirm = useBoolean();

  const popover = usePopover();

  const quickEdit = useBoolean();

  return (
    <>
      <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
        <TableCell padding="checkbox">
          <Checkbox id={String(row.id)} checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell>
          <Stack spacing={2} direction="row" alignItems="center">
            <Avatar alt={row.first_name} src={row.avatarUrl} />

            <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
              <Tooltip title={t('employeeDetails')} placement="top" arrow>
                <Link color="inherit" onClick={onEditRow} sx={{ cursor: 'pointer' }}>
                  {row.first_name}
                </Link>
              </Tooltip>
              <Box component="span" sx={{ color: 'text.secondary', fontSize: 13 }}>
                {row.last_name}
              </Box>
            </Stack>
          </Stack>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.cin}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.hiring_date}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.contract_end_date || 'Not Defined !'}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.contract_type}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.salary}</TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={
              (row.status === 'working' && 'success') ||
              (row.status === 'not_working' && 'warning') ||
              'default'
            }
          >
            {row.status === 'working' ? t('Working') : t('notworking')}
          </Label>
        </TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center">
            <Tooltip title={t('quickEdit')} placement="top" arrow>
              <IconButton
                color={quickEdit.value ? 'inherit' : 'default'}
                onClick={quickEdit.onTrue}
              >
                <Iconify icon="solar:pen-bold" />
              </IconButton>
            </Tooltip>

            <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </Stack>
        </TableCell>
      </TableRow>

      <UserQuickEditForm currentUser={row} open={quickEdit.value} onClose={quickEdit.onFalse} />

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>

          <MenuItem
              onClick={() => {
               onEditRow();
               popover.onClose();
              }}
          >
              <Iconify icon="solar:eye-bold" />
             {t('see')}
          </MenuItem>

          <MenuItem
            onClick={() => {
              onPayslipView();
              popover.onClose();
            }}
          >
            <Iconify icon="solar:folder-bold" />
            {t('paymentCard')}
          </MenuItem>

          <MenuItem
            onClick={() => {
              confirm.onTrue();
              popover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            {t('delete')}
          </MenuItem>

        </MenuList>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={t('delete')}
        content={t('areYouSureDeleteEmployee')}
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            {t('delete')}
          </Button>
        }
      />
    </>
  );
}
