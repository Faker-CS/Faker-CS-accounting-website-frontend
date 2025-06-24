// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { alpha } from '@mui/material/styles';

// eslint-disable-next-line import/no-unresolved
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function ChatRoomAttachments({ attachments = [] }) {
  if (!attachments?.length) {
    return null;
  }

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 1,
        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
      }}
    >
      <Stack spacing={2}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="eva:attach-2-fill" />
          <Box sx={{ typography: 'subtitle2' }}>Attachments ({attachments.length})</Box>
        </Stack>

        <Stack direction="row" flexWrap="wrap" spacing={1}>
          {attachments.map((attachment) => (
            attachment?.preview && (
              <Button
                key={attachment.preview}
                variant="outlined"
                size="small"
                startIcon={<Iconify icon="eva:file-fill" />}
                sx={{
                  flexShrink: 0,
                  borderRadius: 1,
                  typography: 'body2',
                }}
              >
                {attachment.name || 'File'}
              </Button>
            )
          ))}
        </Stack>
      </Stack>
    </Box>
  );
}

ChatRoomAttachments.propTypes = {
  attachments: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      preview: PropTypes.string,
    })
  ),
};
