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
                (currentUser.status === 'Active' && 'success') ||
                (currentUser.status === 'Inactive' && 'error') ||
                'warning'
              }
              sx={{ position: 'absolute', top: 24, right: 24 }}
            >
              {currentUser.status}
            </Label>
          )}

          <Box sx={{ mb: 5, textAlign: 'center' }}>
            <Avatar
              alt={currentUser?.raison_sociale}
              src={`${import.meta.env.VITE_SERVER}/storage/${currentUser?.logo}`}
              sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
            />
            <Typography variant="h6">{currentUser?.raison_sociale}</Typography>
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
              <Typography variant="subtitle2">{t('formeJuridique')}</Typography>
              <Typography variant="body2">{currentUser?.forme_juridique}</Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2">{t('raisonSociale')}</Typography>
              <Typography variant="body2">{currentUser?.raison_sociale}</Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2">{t('dateDeCreation')}</Typography>
              <Typography variant="body2">{currentUser?.founded}</Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2">{t('siren')}</Typography>
              <Typography variant="body2">{currentUser?.numero_siren}</Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2">{t('refCnss')}</Typography>
              <Typography variant="body2">{currentUser?.code_company_value}</Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2">{t('adresseSiegeSocial')}</Typography>
              <Typography variant="body2">{currentUser?.adresse_siege_social}</Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2">{t('codePostal')}</Typography>
              <Typography variant="body2">{currentUser?.code_postale}</Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2">{t('ville')}</Typography>
              <Typography variant="body2">{currentUser?.ville}</Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2">{t('activiteEntreprise')}</Typography>
              <Typography variant="body2">{currentUser?.code_company_type}</Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2">{t('industrie')}</Typography>
              <Typography variant="body2">{currentUser?.industry}</Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2">{t('chiffreAffaire')}</Typography>
              <Typography variant="body2">{currentUser?.chiffre_affaire}</Typography>
            </Stack>
          </Box>
        </Card>
      </Grid>

      <Grid xs={12} md={15}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t('masseSalarialeAnnuelle')}
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
              <Typography variant="subtitle2">{t('masseSalarialeTrancheA')}</Typography>
              <Typography variant="body2">{currentUser?.tranche_a}</Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2">{t('masseSalarialeTrancheB')}</Typography>
              <Typography variant="body2">{currentUser?.tranche_b}</Typography>
            </Stack>
          </Box>
        </Card>
      </Grid>

      <Grid xs={12} md={15}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t('tailleEntreprise')}
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
              <Typography variant="subtitle2">{t('nombreSalaries')}</Typography>
              <Typography variant="body2">{currentUser?.nombre_salaries}</Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2">{t('moyenneAge')}</Typography>
              <Typography variant="body2">{currentUser?.moyenne_age}</Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2">{t('nombreSalariesCadres')}</Typography>
              <Typography variant="body2">{currentUser?.nombre_salaries_cadres}</Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2">{t('moyenneAgeCadres')}</Typography>
              <Typography variant="body2">{currentUser?.moyenne_age_cadres}</Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2">{t('nombreSalariesNonCadres')}</Typography>
              <Typography variant="body2">{currentUser?.nombre_salaries_non_cadres}</Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2">{t('moyenneAgeNonCadres')}</Typography>
              <Typography variant="body2">{currentUser?.moyenne_age_non_cadres}</Typography>
            </Stack>
          </Box>
        </Card>
      </Grid>

      <Grid xs={12} md={15}>
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
              <Typography variant="body2">{currentUser?.email}</Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2">{t('phoneNumber')}</Typography>
              <Typography variant="body2">{currentUser?.phone_number}</Typography>
            </Stack>
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
} 