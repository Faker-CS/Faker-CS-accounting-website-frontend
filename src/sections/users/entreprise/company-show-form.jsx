import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { Avatar } from '@mui/material';

import { Label } from 'src/components/label';

// ----------------------------------------------------------------------

export function UserShowForm({ currentUser }) {
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
            General Information
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
              <Typography variant="subtitle2">Forme juridique</Typography>
              <Typography variant="body2">{currentUser?.forme_juridique}</Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2">Raison sociale</Typography>
              <Typography variant="body2">{currentUser?.raison_sociale}</Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2">Date de création</Typography>
              <Typography variant="body2">{currentUser?.founded}</Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2">SIREN</Typography>
              <Typography variant="body2">{currentUser?.numero_siren}</Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2">Réf CNSS</Typography>
              <Typography variant="body2">{currentUser?.code_company_value}</Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2">Adresse du siège social</Typography>
              <Typography variant="body2">{currentUser?.adresse_siege_social}</Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2">Code postal</Typography>
              <Typography variant="body2">{currentUser?.code_postale}</Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2">Ville</Typography>
              <Typography variant="body2">{currentUser?.ville}</Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2">Activité de l'entreprise</Typography>
              <Typography variant="body2">{currentUser?.code_company_type}</Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2">Industrie</Typography>
              <Typography variant="body2">{currentUser?.industry}</Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2">Chiffre d'affaire</Typography>
              <Typography variant="body2">{currentUser?.chiffre_affaire}</Typography>
            </Stack>
          </Box>
        </Card>
      </Grid>

      <Grid xs={12} md={15}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Masse salariale annuelle
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
              <Typography variant="subtitle2">Masse salariale Tranche A</Typography>
              <Typography variant="body2">{currentUser?.tranche_a}</Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2">Masse salariale Tranche B</Typography>
              <Typography variant="body2">{currentUser?.tranche_b}</Typography>
            </Stack>
          </Box>
        </Card>
      </Grid>

      <Grid xs={12} md={15}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Taille de l'entreprise
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
              <Typography variant="subtitle2">Nombre de salariés</Typography>
              <Typography variant="body2">{currentUser?.nombre_salaries}</Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2">Moyenne d'âge</Typography>
              <Typography variant="body2">{currentUser?.moyenne_age}</Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2">Nombre de salariés cadres</Typography>
              <Typography variant="body2">{currentUser?.nombre_salaries_cadres}</Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2">Moyenne d'âge des salariés cadres</Typography>
              <Typography variant="body2">{currentUser?.moyenne_age_cadres}</Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2">Nombre de salariés non cadres</Typography>
              <Typography variant="body2">{currentUser?.nombre_salaries_non_cadres}</Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2">Moyenne d'âge des salariés non cadres</Typography>
              <Typography variant="body2">{currentUser?.moyenne_age_non_cadres}</Typography>
            </Stack>
          </Box>
        </Card>
      </Grid>

      <Grid xs={12} md={15}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Contact Information
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
              <Typography variant="subtitle2">Email</Typography>
              <Typography variant="body2">{currentUser?.email}</Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2">Phone Number</Typography>
              <Typography variant="body2">{currentUser?.phone_number}</Typography>
            </Stack>
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
} 