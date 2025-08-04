/* eslint-disable import/no-unresolved */
import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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

import { useRouter } from 'src/routes/hooks';

import { fData } from 'src/utils/format-number';

import { useAddEntreprise, useUpdateEntreprise } from 'src/actions/entreprise';

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

// Add company creation schema
const CompanySchema = zod.object({
  Industrie: zod.string().min(1, { message: 'The industrie field is required.' }),
  adresseSiegeSocial: zod.string().min(1, { message: 'The adresse siege social field is required.' }),
  activiteEntreprise: zod.string().min(1, { message: 'The code company type field is required.' }),
  refCnss: zod.string().min(1, { message: 'The code company value field is required.' }),
  zipCode: zod.number().min(1, { message: 'The code postale field is required.' }),
  email: zod.string().min(1, { message: 'The email field is required.' }).email({ message: 'Email must be valid.' }),
  formeJuridique: zod.string().min(1, { message: 'The forme juridique field is required.' }),
  date: zod.string().min(1, { message: 'The founded field is required.' }),
  phoneNumber: zod.string().min(1, { message: 'The phone number field is required.' }),
  raisonSociale: zod.string().min(1, { message: 'The raison sociale field is required.' }),
  city: zod.string().min(1, { message: 'The ville field is required.' }),
  siren: zod.number().min(1, { message: 'The matricule fiscale field is required.' }),
  chiffreAffaire: zod
  .number({
    required_error: 'The chiffre affaire field is required.',
    invalid_type_error: 'The chiffre affaire field must be a number.',
  })
  .min(0, { message: 'The chiffre affaire must be greater than or equal to 0.' }),
  trancheA: zod
    .number()
    .min(1, { message: 'The tranche A field is required.' }),

  trancheB: zod
    .number()
    .min(1, { message: 'The tranche B field is required.' }),
  
    nombreSalaries: zod.preprocess(
      (val) => Number(val),
      zod.number().min(0, { message: 'The number of employees is required.' })
    ),
  
    moyenneAge: zod.preprocess(
      (val) => Number(val),
      zod.number().min(0, { message: 'The average age is required.' })
    ),
  
    nombreSalariesCadres: zod.preprocess(
      (val) => Number(val),
      zod.number().min(0, { message: 'The number of executives is required.' })
    ),
  
    moyenneAgeCadres: zod.preprocess(
      (val) => Number(val),
      zod.number().min(0, { message: 'The average age of executives is required.' })
    ),
  
    nombreSalariesNonCadres: zod.preprocess(
      (val) => Number(val),
      zod.number().min(0, { message: 'The number of non-executives is required.' })
    ),
  
    moyenneAgeNonCadres: zod.preprocess(
      (val) => Number(val),
      zod.number().min(0, { message: 'The average age of non-executives is required.' })
    ),
  
    status: zod
      .string()
      .optional(),
  
    avatarUrl: zod
      .any()
      .optional(),

});

// ----------------------------------------------------------------------

export function UserNewEditForm({ currentUser }) {
  const { t } = useTranslation();
  const router = useRouter();
  const defaultValues = useMemo(
    () => ({
      status: currentUser?.status || 'Pending',
      avatarUrl: currentUser?.logo || null,
      // isVerified: currentUser?.isVerified || true,
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
    resolver: zodResolver(CompanySchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const values = watch();
  const { addEntreprise } = useAddEntreprise();

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentUser && currentUser.id) {
        await updateEntreprise(currentUser.id, data);
        toast.success(t('updateSuccess'));
      } else {
        await addEntreprise(data);
        toast.success(t('companyCreated'));
      }
      reset();
      router.push('/dashboard/users');
    } catch (error) {
      console.error('Update failed:', error);
      toast.error(t('updateFailed'));
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
                    {t('allowedFileTypes')}
                    <br /> {t('maxFileSize', { size: fData(3145728) })}
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
                      {t('inactive')}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {t('applyDisableAccount')}
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
                    {t('emailVerified')}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {t('emailVerificationNote')}
                  </Typography>
                </>
              }
              sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
            />

            {currentUser && (
              <Stack justifyContent="center" alignItems="center" sx={{ mt: 3 }}>
                <Button variant="soft" color="error">
                  {t('deleteUser')}
                </Button>
              </Stack>
            )}
          </Card>
        </Grid>

        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {t('generalInformations')}
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
                label={t('formeJuridique')}
                placeholder={t('chooseLegalForm')}
                error={!!errors.formeJuridique}
                helperText={errors.formeJuridique?.message}
              >
                {[
                  { label: t('sarl'), value: 'SARL' },
                  { label: t('sarls'), value: 'SARL-S' },
                  { label: t('suarl'), value: 'SUARL' },
                  { label: t('sa'), value: 'SA' },
                  { label: t('snc'), value: 'SNC' },
                ].map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>
              <Field.Text name="raisonSociale" label={t('raisonSociale')} color="primary" error={!!errors.raisonSociale} helperText={errors.raisonSociale?.message} />
              <Field.DatePicker name="date" label={t('date')} color="primary" error={!!errors.date} helperText={errors.date?.message} />
              <Field.Text name="siren" type="number" label={t('siren')} color="primary" error={!!errors.siren} helperText={errors.siren?.message} />
              <Field.Text name="refCnss" label={t('refCnss')} color="primary" error={!!errors.refCnss} helperText={errors.refCnss?.message} />
              <Field.Text name="adresseSiegeSocial" label={t('adresseSiegeSocial')} color="primary" error={!!errors.adresseSiegeSocial} helperText={errors.adresseSiegeSocial?.message} />
              <Field.Text name="zipCode" type="number" label={t('codePostale')} color="primary" error={!!errors.zipCode} helperText={errors.zipCode?.message} />
              <Field.Text name="city" label={t('ville')} color="primary" error={!!errors.city} helperText={errors.city?.message} />
              <Field.Select
                name="activiteEntreprise"
                label={t('activiteEntreprise')}
                placeholder={t('chooseBusinessActivity')}
                error={!!errors.activiteEntreprise}
                helperText={errors.activiteEntreprise?.message}
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
              <Field.Select name="Industrie" label={t('industrie')} placeholder={t('chooseIndustry')} error={!!errors.Industrie} helperText={errors.Industrie?.message}>
                {[
                  { label: t('services'), value: 'Services' },
                  { label: t('commerce'), value: 'Commerce' },
                  { label: t('artisanat'), value: 'Artisanat' },
                  { label: t('agriculture'), value: 'Agriculture' },
                  { label: t('btp'), value: 'BTP' },
                  { label: t('transports'), value: 'Transports' },
                  { label: t('hotellerie'), value: 'Hôtellerie' },
                  { label: t('restauration'), value: 'Restauration' },
                  { label: t('sante'), value: 'Santé' },
                  { label: t('industrie'), value: 'Industrie' },
                  { label: t('education'), value: 'Éducation' },
                  { label: t('culture'), value: 'Culture' },
                  { label: t('loisirs'), value: 'Loisirs' },
                  { label: t('autres'), value: 'Autres' },
                ].map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>
              <Field.Text name="chiffreAffaire" type="number" label={t('chiffreAffaire')} color="primary" />
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
              <Field.Text name="trancheA" type="number" label={t('masseSalarialeTrancheA')} color="primary" />
              <Field.Text name="trancheB" type="number" label={t('masseSalarialeTrancheB')} color="primary" />
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
              <Field.Text name="nombreSalaries" type="number" label={t('nombreSalaries')} color="primary" />
              <Field.Text name="moyenneAge" type="number" label={t('moyenneAge')} color="primary" />
              <Field.Text
                name="nombreSalariesCadres"
                type="number"
                label={t('nombreSalariesCadres')}
                color="primary"
              />
              <Field.Text name="moyenneAgeCadres" type="number" label={t('moyenneAgeCadres')} color="primary" />
              <Field.Text
                name="nombreSalariesNonCadres"
                type="number"
                label={t('nombreSalariesNonCadres')}
                color="primary"
              />
              <Field.Text
                name="moyenneAgeNonCadres"
                type="number"
                label={t('moyenneAgeNonCadres')}
                color="primary"
              />
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
              <Field.Text name="email" label={t('email')} color="primary" error={!!errors.email} helperText={errors.email?.message} />
              <Field.Phone name="phoneNumber" label={t('phoneNumber')} color="primary" country="TN" error={!!errors.phoneNumber} helperText={errors.phoneNumber?.message} />
            </Box>
            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentUser ? t('createCompany') : t('saveChanges')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
