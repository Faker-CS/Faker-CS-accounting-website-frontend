import axios from 'axios';
import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import AvatarGroup, { avatarGroupClasses } from '@mui/material/AvatarGroup';

import { useBoolean } from 'src/hooks/use-boolean';
import { useCopyToClipboard } from 'src/hooks/use-copy-to-clipboard';

import { fData } from 'src/utils/format-number';
import { fDateTime } from 'src/utils/format-time';

import { maxLine } from 'src/theme/styles';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { FileThumbnail } from 'src/components/file-thumbnail';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { FileManagerShareDialog } from './file-manager-share-dialog';
import { FileManagerFileDetails } from './file-manager-file-details';

// ----------------------------------------------------------------------

export function FileManagerFileItem({ file, selected, onSelect, onDelete, onDownload, sx, ...other }) {
  const { t } = useTranslation();
  const share = useBoolean();



  const confirm = useBoolean();

  const details = useBoolean();

  const popover = usePopover();

  const checkbox = useBoolean();

  const { copy } = useCopyToClipboard();

  const favorite = useBoolean(file.isFavorited);

  const [inviteEmail, setInviteEmail] = useState('');
  const [sending, setSending] = useState(false);

  const handleChangeInvite = useCallback((event) => {
    setInviteEmail(event.target.value);
  }, []);

  const handleCopy = useCallback(() => {
    toast.success(t('copied'));
    copy(file.url);
  }, [copy, file.url, t]);

  const handleSendEmail = async (email) => {
    setSending(true);
    try {
      // Extract companyId and fileName from file.url or file object
      // Assuming file.url is like /storage/company-files/{companyId}/{fileName}
      const match = file.url.match(/company-files\/(\d+)\/(.+)$/);
      if (!match) throw new Error('Invalid file URL');
      const companyId = match[1];
      const fileName = match[2];
      const token = localStorage.getItem('jwt_access_token');
      await axios.post(`${import.meta.env.VITE_SERVER}/api/companies/${companyId}/files/send-email`, {
        email,
        fileName,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(t('emailSent'));
      share.onFalse();
      setInviteEmail('');
    } catch (err) {
      toast.error(t('failedToSendEmail'));
    }
    setSending(false);
  };

  const renderIcon = (
    <Box
      onMouseEnter={checkbox.onTrue}
      onMouseLeave={checkbox.onFalse}
      sx={{ display: 'inline-flex', width: 36, height: 36 }}
    >
      {(checkbox.value || selected) && onSelect ? (
        <Checkbox
          checked={selected}
          onClick={onSelect}
          icon={<Iconify icon="eva:radio-button-off-fill" />}
          checkedIcon={<Iconify icon="eva:checkmark-circle-2-fill" />}
          inputProps={{
            id: `item-checkbox-${file.id}`,
            'aria-label': `Item checkbox`,
          }}
          sx={{ width: 1, height: 1 }}
        />
      ) : (
        <FileThumbnail file={file.name} sx={{ width: 1, height: 1 }} />
      )}
    </Box>
  );

  const renderDirectActions = (
    <Stack direction="row" alignItems="center" sx={{ top: 8, right: 56, position: 'absolute' }}>
      <IconButton onClick={onDownload}>
        <Iconify icon="material-symbols:download-rounded" />
      </IconButton>
      <IconButton color="error" onClick={confirm.onTrue}>
        <Iconify icon="tabler:trash" />
      </IconButton>
    </Stack>
  );

  const renderAction = (
    <Stack direction="row" alignItems="center" sx={{ top: 8, right: 8, position: 'absolute' }}>
      {/* <Checkbox
        color="warning"
        icon={<Iconify icon="eva:star-outline" />}
        checkedIcon={<Iconify icon="eva:star-fill" />}
        checked={favorite.value}
        onChange={favorite.onToggle}
        inputProps={{
          id: `favorite-checkbox-${file.id}`,
          'aria-label': `Favorite checkbox`,
        }}
      /> */}

      <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
        <Iconify icon="eva:more-vertical-fill" />
      </IconButton>
    </Stack>
  );

  const renderText = (
    <>
      <Typography
        variant="subtitle2"
        onClick={details.onTrue}
        sx={(theme) => ({
          ...maxLine({ line: 2, persistent: theme.typography.subtitle2 }),
          mt: 2,
          mb: 0.5,
          width: 1,
        })}
      >
        {file.name}
      </Typography>

      <Stack
        direction="row"
        alignItems="center"
        sx={{
          maxWidth: 0.99,
          whiteSpace: 'nowrap',
          typography: 'caption',
          color: 'text.disabled',
        }}
      >
        {fData(file.size)}

        <Box
          component="span"
          sx={{
            mx: 0.75,
            width: 2,
            height: 2,
            flexShrink: 0,
            borderRadius: '50%',
            bgcolor: 'currentColor',
          }}
        />
        <Typography noWrap component="span" variant="caption">
          {fDateTime(file.modifiedAt)}
        </Typography>
      </Stack>
    </>
  );

  const renderAvatar = (
    <AvatarGroup
      max={3}
      sx={{
        mt: 1,
        [`& .${avatarGroupClasses.avatar}`]: {
          width: 24,
          height: 24,
          '&:first-of-type': { fontSize: 12 },
        },
      }}
    >
      {file.shared?.map((person) => (
        <Avatar key={person.id} alt={person.name} src={person.avatarUrl} />
      ))}
    </AvatarGroup>
  );

  return (
    <>
      <Paper
        variant="outlined"
        sx={{
          width: 240,
          height: 180,
          p: 2.5,
          display: 'flex',
          borderRadius: 2,
          cursor: 'pointer',
          position: 'relative',
          bgcolor: 'transparent',
          flexDirection: 'column',
          alignItems: 'flex-start',
          ...((checkbox.value || selected) && {
            bgcolor: 'background.paper',
            boxShadow: (theme) => theme.customShadows.z20,
          }),
          ...sx,
        }}
        {...other}
      >
        {renderIcon}
        {renderText}
        {renderAvatar}
        {renderDirectActions}
        {renderAction}
      </Paper>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              popover.onClose();
              handleCopy();
            }}
          >
            <Iconify icon="eva:link-2-fill" />
            {t('copyLink')}
          </MenuItem>

          <MenuItem
            onClick={() => {
              popover.onClose();
              share.onTrue();
            }}
          >
            <Iconify icon="solar:share-bold" />
            {t('share')}
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
            {t('delete')}
          </MenuItem>
        </MenuList>
      </CustomPopover>

      <FileManagerFileDetails
        item={file}
        favorited={favorite.value}
        onFavorite={favorite.onToggle}
        onCopyLink={handleCopy}
        open={details.value}
        onClose={details.onFalse}
        onDelete={() => {
          details.onFalse();
          onDelete();
        }}
      />

      <FileManagerShareDialog
        open={share.value}
        onClose={share.onFalse}
        inviteEmail={inviteEmail}
        onChangeInvite={handleChangeInvite}
        onSendEmail={handleSendEmail}
        sending={sending}
      />

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={t('delete')}
        content={t('areYouSureDeleteFile')}
        action={
          <Button variant="contained" color="error" onClick={() => {
            onDelete();
            confirm.onFalse();
          }}>
            {t('delete')}
          </Button>
        }
      />
    </>
  );
}
