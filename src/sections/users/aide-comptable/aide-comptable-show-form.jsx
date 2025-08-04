import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { Avatar } from '@mui/material';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

// eslint-disable-next-line import/no-unresolved
import { Label } from 'src/components/label';

// ----------------------------------------------------------------------

export function AideComptableShowForm({ currentUser }) {
  const { t } = useTranslation();
  
  return (
    <Grid container spacing={3}>
      <Grid xs={12} md={4}>
        <Card sx={{ pt: 12, pb: 5, px: 3 }}>
          <Box sx={{ mb: 5, textAlign: 'center' }}>
            <Avatar
              alt={currentUser?.name}
              src={currentUser?.photo ? `${import.meta.env.VITE_SERVER}/storage/${currentUser?.photo}` : undefined}
              sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
            >
              {currentUser?.name?.charAt(0)?.toUpperCase()}
            </Avatar>
            <Typography variant="h6">{currentUser?.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {t('accounterHelper')}
            </Typography>
            {/* <Label color="success" sx={{ mt: 2 }}>
              {t('active')}
            </Label> */}
          </Box>
        </Card>
      </Grid>

      <Grid xs={12} md={8}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t('generalInformation')}
          </Typography>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            <Stack spacing={1}>
              <Typography variant="subtitle2">{t('name')}</Typography>
              <Typography variant="body2">{currentUser?.name || 'N/A'}</Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2">{t('email')}</Typography>
              <Typography variant="body2">{currentUser?.email || 'N/A'}</Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2">{t('phoneNumber')}</Typography>
              <Typography variant="body2">{currentUser?.phoneNumber || 'N/A'}</Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2">{t('city')}</Typography>
              <Typography variant="body2">{currentUser?.city || 'N/A'}</Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2">{t('state')}</Typography>
              <Typography variant="body2">{currentUser?.state || 'N/A'}</Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2">{t('zipCode')}</Typography>
              <Typography variant="body2">{currentUser?.zipCode || 'N/A'}</Typography>
            </Stack>
          </Box>
        </Card>
      </Grid>

      <Grid xs={12}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t('contactInformation')}
          </Typography>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            <Stack spacing={1}>
              <Typography variant="subtitle2">{t('address')}</Typography>
              <Typography variant="body2">{currentUser?.address || 'N/A'}</Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2">{t('registrationDate')}</Typography>
              <Typography variant="body2">
                {currentUser?.created_at ? new Date(currentUser.created_at).toLocaleDateString() : 'N/A'}
              </Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2">{t('lastUpdate')}</Typography>
              <Typography variant="body2">
                {currentUser?.updated_at ? new Date(currentUser.updated_at).toLocaleDateString() : 'N/A'}
              </Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2">{t('role')}</Typography>
              <Label color="info">
                {t('accounterHelper')}
              </Label>
            </Stack>
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
} 
