import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { FileManagerInvitedItem } from './file-manager-invited-item';

// ----------------------------------------------------------------------

export function FileManagerShareDialog({
  open,
  shared,
  onClose,
  onCopyLink,
  inviteEmail,
  onChangeInvite,
  onSendEmail,
  sending,
  ...other
}) {
  const hasShared = shared && !!shared.length;

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose} {...other}>
      <DialogTitle> Send to Email </DialogTitle>

      <Box sx={{ px: 3 }}>
        {onChangeInvite && (
          <TextField
            fullWidth
            value={inviteEmail}
            placeholder="Email"
            onChange={onChangeInvite}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    color="inherit"
                    variant="contained"
                    disabled={!inviteEmail || sending}
                    sx={{ mr: -0.75 }}
                    onClick={() => onSendEmail && onSendEmail(inviteEmail)}
                  >
                    {sending ? 'Sending...' : 'Send Email'}
                  </Button>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
        )}
      </Box>

      {hasShared && (
        <Scrollbar sx={{ height: 60 * 5, px: 3 }}>
          <Box component="ul">
            {shared.map((person) => (
              <FileManagerInvitedItem key={person.id} person={person} />
            ))}
          </Box>
        </Scrollbar>
      )}

      <DialogActions sx={{ justifyContent: 'space-between' }}>
        {onCopyLink && (
          <Button startIcon={<Iconify icon="eva:link-2-fill" />} onClick={onCopyLink}>
            Copy link
          </Button>
        )}

        {onClose && (
          <Button variant="outlined" color="inherit" onClick={onClose}>
            Close
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
