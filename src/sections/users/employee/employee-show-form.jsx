import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { Avatar } from '@mui/material';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { Label } from 'src/components/label';

// ----------------------------------------------------------------------

export function UserShowForm({ currentUser }) {
  const { t } = useTranslation();
  return (
    <Grid container spacing={3}>
      <Grid xs={12} md={4}>
        <Card sx={{ pt: 12, pb: 5, px: 3 }}>
          {currentUser && (
            <Label
              color={
                (currentUser.status === 'working' && 'success') ||
                (currentUser.status === 'not_working' && 'error') ||
                'warning'
              }
              sx={{ position: 'absolute', top: 24, right: 24 }}
            >
              {currentUser.status === 'working' ? t('Working') : t('notworking')}
            </Label>
          )}

          <Box sx={{ mb: 5, textAlign: 'center' }}>
            <Avatar
              alt={currentUser?.full_name}
              src={currentUser?.avatar ? `${import.meta.env.VITE_SERVER}/storage/${currentUser?.avatar}` : undefined}
              sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
            >
              {currentUser?.first_name?.charAt(0)?.toUpperCase()}
            </Avatar>
            <Typography variant="h6">{currentUser?.first_name} {currentUser?.last_name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {currentUser?.cin}
            </Typography>
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
              <Typography variant="subtitle2">{t('employees.full_name')}</Typography>
              <Typography variant="body2">{currentUser?.first_name} {currentUser?.last_name}</Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2">{t('employees.cin')}</Typography>
              <Typography variant="body2">{currentUser?.cin}</Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2">{t('employees.hiring_date')}</Typography>
              <Typography variant="body2">{currentUser?.hiring_date}</Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2">{t('employees.contract_end_date')}</Typography>
              <Typography variant="body2">{currentUser?.contract_end_date || 'N/A'}</Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2">{t('employees.contract_type')}</Typography>
              <Typography variant="body2">{currentUser?.contract_type}</Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2">{t('employees.salary')}</Typography>
              <Typography variant="body2">{currentUser?.salary ? `${currentUser?.salary} TND` : 'N/A'}</Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2">{t('employees.status')}</Typography>
              <Label
                color={
                  (currentUser?.status === 'working' && 'success') ||
                  (currentUser?.status === 'not_working' && 'error') ||
                  'default'
                }
              >
                {currentUser?.status === 'working' ? t('Working') : t('notworking')}
              </Label>
            </Stack>
          </Box>
        </Card>
      </Grid>

      <Grid xs={12} md={12}>
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
              <Typography variant="subtitle2">{t('email')}</Typography>
              <Typography variant="body2">{currentUser?.email || 'N/A'}</Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2">{t('phoneNumber')}</Typography>
              <Typography variant="body2">{currentUser?.phone_number || 'N/A'}</Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2">{t('address')}</Typography>
              <Typography variant="body2">{currentUser?.address || 'N/A'}</Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2">{t('city')}</Typography>
              <Typography variant="body2">{currentUser?.city || 'N/A'}</Typography>
            </Stack>
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
} 