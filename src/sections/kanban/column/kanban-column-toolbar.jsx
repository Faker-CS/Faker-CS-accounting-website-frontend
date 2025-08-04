/* eslint-disable import/no-unresolved */
import { useTranslation } from 'react-i18next';
import { useRef, useState, useEffect, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';

import { useAuth } from 'src/hooks/useAuth';
import { useBoolean } from 'src/hooks/use-boolean';

import { varAlpha } from 'src/theme/styles';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { KanbanInputName } from '../components/kanban-input-name';

// ----------------------------------------------------------------------

export function KanbanColumnToolBar({
  columnName,
  totalTasks,
  handleProps,
  onClearColumn,
  onToggleAddTask,
  onDeleteColumn,
  onUpdateColumn,
}) {
  const { t } = useTranslation();
  const renameRef = useRef(null);
  const popover = usePopover();
  const confirmDialog = useBoolean();
  const [name, setName] = useState(columnName);
  const { userData } = useAuth();

  const isComptable = Array.isArray(userData?.roles)
    ? userData.roles.includes("comptable")
    : userData?.roles === "comptable";

  useEffect(() => {
    if (popover.open) {
      if (renameRef.current) {
        renameRef.current.focus();
      }
    }
  }, [popover.open]);

  const handleChangeName = useCallback((event) => {
    setName(event.target.value);
  }, []);

  const handleKeyUpUpdateColumn = useCallback(
    (event) => {
      if (event.key === 'Enter') {
        if (renameRef.current) {
          renameRef.current.blur();
        }
        onUpdateColumn?.(name);
      }
    },
    [name, onUpdateColumn]
  );

  return (
    <>
      <Stack direction="row" alignItems="center">
        <Label
          sx={{
            borderRadius: '50%',
            borderColor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.24),
          }}
        >
          {totalTasks}
        </Label>

        <KanbanInputName
          inputRef={renameRef}
          placeholder={t('columnName')}
          value={name}
          onChange={handleChangeName}
          onKeyUp={handleKeyUpUpdateColumn}
          inputProps={{ id: `input-column-${name}` }}
          sx={{ mx: 1 }}
        />

        {isComptable && (
          <IconButton size="small" color="inherit" onClick={onToggleAddTask}>
            <Iconify icon="solar:add-circle-bold" />
          </IconButton>
        )}

        <IconButton
          size="small"
          color={popover.open ? 'inherit' : 'default'}
          onClick={popover.onOpen}
        >
          <Iconify icon="solar:menu-dots-bold-duotone" />
        </IconButton>

        <IconButton size="small" {...handleProps}>
          <Iconify icon="nimbus:drag-dots" />
        </IconButton>
      </Stack>

      <CustomPopover open={popover.open} anchorEl={popover.anchorEl} onClose={popover.onClose}>
        {isComptable && (
          <MenuList>
            <MenuItem
              onClick={() => {
                onClearColumn?.();
                popover.onClose();
              }}
            >
              <Iconify icon="solar:eraser-bold" />
              {t('clear')}
            </MenuItem>
          </MenuList>
        )}
      </CustomPopover>

      {/* <ConfirmDialog
        open={confirmDialog.value}
        onClose={confirmDialog.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete column?
            <Box sx={{ typography: 'caption', color: 'error.main', mt: 2 }}>
              <strong> NOTE: </strong> All tasks related to this category will also be deleted.
            </Box>
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              onDeleteColumn?.();
              confirmDialog.onFalse();
            }}
          >
            Delete
          </Button>
        }
      /> */}
    </>
  );
}
