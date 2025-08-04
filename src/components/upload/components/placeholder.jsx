import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { UploadIllustration } from 'src/assets/illustrations';

// ----------------------------------------------------------------------

export function UploadPlaceholder({ sx, ...other }) {
  const { t } = useTranslation();
  
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      sx={sx}
      {...other}
    >
      <UploadIllustration hideBackground sx={{ width: 200 }} />

      <Stack spacing={1} sx={{ textAlign: 'center' }}>
        <Box sx={{ typography: 'h6' }}>{t('dropOrSelectFile')}</Box>
        <Box sx={{ typography: 'body2', color: 'text.secondary' }}>
          {t('dropFilesHere')}
          <Box
            component="span"
            sx={{ mx: 0.5, color: 'primary.main', textDecoration: 'underline' }}
          >
            {t('browse')}
          </Box>
          {t('throughYourMachine')}
        </Box>
      </Stack>
    </Box>
  );
}
