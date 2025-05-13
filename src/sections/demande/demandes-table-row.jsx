import { toast } from 'sonner';
import { useState, useCallback } from 'react';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import { LoadingButton } from '@mui/lab';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import {
  Box,
  Alert,
  Dialog,
  Select,
  InputLabel,
  DialogTitle,
  FormControl,
  DialogActions,
  DialogContent,
  OutlinedInput,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDate, fTime } from 'src/utils/format-time';

import { statusData } from 'src/_mock/_status';
import { useUpdateForm } from 'src/actions/forms';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export function DemandesTableRow({
  row,
  onViewRow,
  onDeleteRow,
}) {
  const confirm = useBoolean();

  const { updateForm } = useUpdateForm();

  const [statusValue, setStatusValue] = useState(row.status);

  const edit = useBoolean();

  const popover = usePopover();

  const handleEditRow = useCallback(
    async (id) => {
      toast.promise(
        async () => {
          const result = await updateForm(id, statusValue);
          if (!result.success) throw new Error(result.message);

          edit.onFalse();
        },
        {
          loading: 'Mise à jour en cours...',
          success: 'Formulaire mis à jour avec succès',
          error: 'Erreur lors de la mise à jour du formulaire',
        }
      );
    },
    [updateForm, statusValue, edit]
  );

  return (
    <>
      <TableRow hover>
        <TableCell>
          <Stack spacing={2} direction="row" alignItems="center">
            <Avatar alt={row.user.name}>{row.user.name.charAt(0).toUpperCase()}</Avatar>

            <ListItemText
              disableTypography
              primary={
                <Typography variant="body2" noWrap>
                  {row.user.name}
                </Typography>
              }
              secondary={
                <Link
                  noWrap
                  variant="body2"
                  onClick={onViewRow}
                  sx={{ color: 'text.disabled', cursor: 'pointer' }}
                >
                  #{row.user.id}
                </Link>
              }
            />
          </Stack>
        </TableCell>

        <TableCell>
          <ListItemText
            primary={fDate(row.created_at)}
            secondary={fTime(row.created_at)}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{ mt: 0.5, component: 'span', typography: 'caption' }}
          />
        </TableCell>

        <TableCell>{row.service.name}</TableCell>

        <TableCell>
          {(() => {
            const status = statusData.find((s) => s.value === row.status) || {
              label: row.status,
              color: 'default',
            };

            return (
              <Label variant="soft" color={status.color}>
                {status.label}
              </Label>
            );
          })()}
        </TableCell>

        <TableCell>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              onViewRow();
              popover.onClose();
            }}
          >
            <Iconify icon="solar:eye-bold" />
            Voir
          </MenuItem>

          <MenuItem
            onClick={() => {
              edit.onTrue();
              popover.onClose();
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Modifier
          </MenuItem>

          <Divider sx={{ borderStyle: 'dashed' }} />

          <MenuItem
            onClick={() => {
              confirm.onTrue();
              popover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Supprimer
          </MenuItem>
        </MenuList>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Supprimer"
        content={
          <>
            Êtes-vous sûr de vouloir supprimer la demande de <b>{row.user.name}</b> à{' '}
            <b>{row.service.name}</b>?
          </>
        }
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Supprimer
          </Button>
        }
      />

      <Dialog
        fullWidth
        maxWidth={false}
        open={edit.value}
        onClose={edit.onFalse}
        PaperProps={{ sx: { maxWidth: 720 } }}
      >
        <DialogTitle>Modifier status</DialogTitle>
        <DialogContent>
          <Alert variant="outlined" severity="warning" sx={{ mb: 3 }}>
            Demande en attente de confirmation
          </Alert>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
          >
            <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 200 } }}>
              <InputLabel htmlFor="user-filter-role-select-label">Statut</InputLabel>
              <Select
                value={statusValue}
                onChange={(e) => setStatusValue(e.target.value)}
                inputProps={{ id: 'user-filter-role-select-label' }}
                input={<OutlinedInput label="Statut" />}
                name="status"
                label="Statut"
              >
                {statusData
                  .filter((status) => status.value !== 'none')
                  .map((status) => (
                    <MenuItem key={status.value} value={status.value}>
                      {status.label}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => edit.onFalse()}>
            canlcel
          </Button>

          <LoadingButton type="submit" variant="contained" onClick={() => handleEditRow(row.id)}>
            Modify
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
}