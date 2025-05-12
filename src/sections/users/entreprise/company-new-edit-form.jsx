import { z as zod } from 'zod';
import { useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
// eslint-disable-next-line import/no-extraneous-dependencies
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { MenuItem } from '@mui/material';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fData } from 'src/utils/format-number';

import { form } from 'src/theme/core/components/form';
import { useUpdateEntreprise } from 'src/actions/entreprise';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export const NewUserSchema = zod.object({
  avatarUrl: schemaHelper.file({
    message: { required_error: 'Avatar is required!' },
  }),
  name: zod.string().min(1, { message: 'Name is required!' }),
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
  phoneNumber: schemaHelper.phoneNumber({ isValidPhoneNumber }),
  country: schemaHelper.objectOrNull({
    message: { required_error: 'Country is required!' },
  }),
  address: zod.string().min(1, { message: 'Address is required!' }),
  company: zod.string().min(1, { message: 'Company is required!' }),
  state: zod.string().min(1, { message: 'State is required!' }),
  city: zod.string().min(1, { message: 'City is required!' }),
  role: zod.string().min(1, { message: 'Role is required!' }),
  zipCode: zod.string().min(1, { message: 'Zip code is required!' }),
  trancheA: zod.string().min(1, { message: 'Masse salariale Tranche A is required!' }),
  trancheB: zod.string().min(1, { message: 'Masse salariale Tranche B is required!' }),
  nombreSalaries: zod.number().min(1, { message: 'Nombre de salariés is required!' }),
  moyenneAge: zod.string().min(1, { message: "Moyenne d'âge is required!" }),
  nombreSalariesCadres: zod.number().min(1, { message: 'Nombre de salariés cadres is required!' }),
  moyenneAgeCadres: zod
    .string()
    .min(1, { message: "Moyenne d'âge des salariés cadres is required!" }),
  nombreSalariesNonCadres: zod
    .number()
    .min(1, { message: 'Nombre de salariés non cadres is required!' }),
  // Not required
  status: zod.string(),
  isVerified: zod.boolean(),
});

// ----------------------------------------------------------------------

export function UserNewEditForm({ currentUser }) {
  const router = useRouter();
//  console.log(currentUser);
  const defaultValues = useMemo(
    () => ({
      status: currentUser?.status || '',
      avatarUrl: currentUser?.logo || null,
      isVerified: currentUser?.isVerified || true,
      formeJuridique: currentUser?.forme_juridique || '',
      raisonSociale: currentUser?.raison_sociale || '',
      date: currentUser?.founded || '',
      email: currentUser?.email || '',
      activiteEntreprise: currentUser?.code_company_type || '',
      phoneNumber: currentUser?.phone_number || '',
      matriculeFiscale: currentUser?.numero_tva || '',
      siren: currentUser?.numero_siren || '',
      city: currentUser?.ville || '',
      adresseSiegeSocial: currentUser?.adresse_siege_social || '',
      zipCode: currentUser?.code_postale || '',
      chiffreAffaire: currentUser?.chiffre_affaire || '',
      Industrie: currentUser?.industry || '',
      trancheA: currentUser?.tranche_a || '',
      trancheB: currentUser?.tranche_b || '',
      refCnss: currentUser?.code_company_value || '',
      nombreSalaries: currentUser?.nombre_salaries || 0,
      moyenneAge: currentUser?.moyenne_age || '',
      nombreSalariesCadres: currentUser?.nombre_salaries_cadres || 0,
      moyenneAgeCadres: currentUser?.moyenne_age_cadres || '',
      nombreSalariesNonCadres: currentUser?.nombre_salaries_non_cadres || 0,
      moyenneAgeNonCadres: currentUser?.moyenne_age_non_cadres || '',
    }),
    [currentUser]
  );
  const { updateEntreprise } = useUpdateEntreprise();

  const methods = useForm({
    mode: 'all',
    // resolver: zodResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      // console.log("Submitting ..")
      await updateEntreprise(currentUser?.id, data );

      toast.success('Update success!');
      reset();
      
    }catch (error) {
      console.error('Update failed:', error);
      toast.error('Update failed!');
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card sx={{ pt: 12, pb: 5, px: 3 }}>
            {currentUser && (
              <Label
                color={
                  (values.status === 'Active' && 'success') ||
                  (values.status === 'Inactive' && 'error') ||
                  'warning'
                }
                sx={{ position: 'absolute', top: 24, right: 24 }}
              >
                {values.status}
              </Label>
            )}

            <Box sx={{ mb: 5 }}>
              <Field.UploadAvatar
                name="avatarUrl"
                maxSize={3145728}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 3,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.disabled',
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
            </Box>

            {currentUser && (
              <FormControlLabel
                labelPlacement="start"
                control={
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        {...field}
                        checked={field.value !== 'Active'}
                        onChange={(event) =>
                          field.onChange(event.target.checked ? 'Inactive' : 'Active')
                        }
                      />
                    )}
                  />
                }
                label={
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Inactive
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Apply disable account
                    </Typography>
                  </>
                }
                sx={{
                  mx: 0,
                  mb: 3,
                  width: 1,
                  justifyContent: 'space-between',
                }}
              />
            )}

            <Field.Switch
              name="isVerified"
              labelPlacement="start"
              label={
                <>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    Email verified
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Disabling this will automatically send the user a verification email
                  </Typography>
                </>
              }
              sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
            />

            {currentUser && (
              <Stack justifyContent="center" alignItems="center" sx={{ mt: 3 }}>
                <Button variant="soft" color="error">
                  Delete user
                </Button>
              </Stack>
            )}
          </Card>
        </Grid>

        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Information générale
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
              <Field.Select
                name="formeJuridique"
                label="Forme juridique"
                placeholder="Choisir Forme Juridique"
              >
                {[
                  { label: 'Société à responsabilité limitée', value: 'SARL' },
                  { label: 'Société par actions simplifiée', value: 'SAS' },
                  { label: 'Société anonyme', value: 'SA' },
                  { label: 'Société en nom collectif', value: 'SNC' },
                  { label: 'Société en commandite simple', value: 'SCS' },
                  { label: 'Entreprise individuelle', value: 'EI' },
                  { label: 'Société civile', value: 'SC' },
                  { label: 'Société coopérative', value: 'SCOP' },
                  { label: 'Association', value: 'ASSO' },
                  { label: 'Groupement d’intérêt économique', value: 'GIE' },
                  { label: 'Société européenne', value: 'SE' },
                  { label: 'Société à responsabilité limitée à associé unique', value: 'EURL' },
                  { label: 'Société par actions simplifiée unipersonnelle', value: 'SASU' },
                ].map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>
              <Field.Text name="raisonSociale" label="Raison sociale" />
              <Field.Text name="date" label="Date" />
              <Field.Text name="matriculeFiscale" label="Matricule Fiscale" />
              <Field.Text name="siren" label="SIREN" />
              <Field.Text name="refCnss" label="Réf CNSS" />
              <Field.Text name="adresseSiegeSocial" label="Adresse du siège social" />
              <Field.Text name="zipCode" label="Code postale" />
              <Field.Text name="city" label="Ville" />
              <Field.Select
                name="activiteEntreprise"
                label="Activité de l'entreprise / Code APE/NAF"
                placeholder="Choisir Activité de l'entreprise"
              >
                {[
                  { label: 'APE', value: 'APE' },
                  { label: 'NEF', value: 'NEF' },
                ].map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>
              <Field.Select name="Industrie" label="Industrie" placeholder="Choisir Industrie" >
                {[
                  { label: 'Services', value: 'Services' },
                  { label: 'Commerce', value: 'Commerce' },
                  { label: 'Artisanat', value: 'Artisanat' },
                  { label: 'Agriculture', value: 'Agriculture' },
                  { label: 'BTP', value: 'BTP' },
                  { label: 'Transports', value: 'Transports' },
                  { label: 'Hôtellerie', value: 'Hôtellerie' },
                  { label: 'Restauration', value: 'Restauration' },
                  { label: 'Santé', value: 'Santé' },
                  { label: 'Éducation', value: 'Éducation' },
                  { label: 'Culture', value: 'Culture' },
                  { label: 'Loisirs', value: 'Loisirs' },
                  { label: 'Autres', value: 'Autres' },
                ].map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>
              <Field.Text name="chiffreAffaire" label="Chiffre d'affaire" />
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
              <Field.Text name="trancheA" label="Masse salariale Tranche A" />
              <Field.Text name="trancheB" label="Masse salariale Tranche B" />
            </Box>
          </Card>
        </Grid>

        <Grid xs={12} md={15}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Taille de votre entreprise
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
              <Field.Text name="nombreSalaries" type="number" label="Nombre de salariés" />
              <Field.Text name="moyenneAge" label="Moyenne d'âge" />
              <Field.Text name="nombreSalariesCadres" type="number" label="Nombre de salariés cadres" />
              <Field.Text name="moyenneAgeCadres" label="Moyenne d'âge des salariés cadres" />
              <Field.Text name="nombreSalariesNonCadres" type="number" label="Nombre de salariés non cadres" />
              <Field.Text
                name="moyenneAgeNonCadres"
                label="Moyenne d'âge des salariés non cadres"
              />
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
              <Field.Text name="email" label="Email" />
              <Field.Text name="phoneNumber" label="Phone Number" />
            </Box>
            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentUser ? 'Create Company' : 'Save changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
