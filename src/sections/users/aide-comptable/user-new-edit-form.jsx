/* eslint-disable import/no-unresolved */
import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fData } from 'src/utils/format-number';

import { useAddAideComptable } from 'src/actions/aideComptable';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export function UserNewEditForm({ currentUser }) {
  const { t } = useTranslation();
  
  const NewUserSchema = zod.object({
    avatarUrl: schemaHelper.file({
      message: { required_error: t('avatarRequired') },
    }),
    name: zod.string().min(1, { message: t('nameRequired') }),
    email: zod
      .string()
      .min(1, { message: t('emailRequired') })
      .email({ message: t('emailMustBeValid') }),
    phoneNumber: schemaHelper.phoneNumber({ isValidPhoneNumber }),
    address: zod.string().min(1, { message: t('addressRequired') }),
    state: zod.string().min(1, { message: t('stateRequired') }),
    city: zod.string().min(1, { message: t('cityRequired') }),
    zipCode: zod.string().min(1, { message: t('zipCodeRequired') }),
    isVerified: zod.boolean(),
  });
  
  const router = useRouter();

  const defaultValues = useMemo(
    () => ({
      avatarUrl: currentUser?.avatarUrl || null,
      isVerified: currentUser?.isVerified || true,
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      phoneNumber: currentUser?.phoneNumber || '',
      state: currentUser?.state || '',
      city: currentUser?.city || '',
      address: currentUser?.address || '',
      zipCode: currentUser?.zipCode || '',
    }),
    [currentUser]
  );

  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(NewUserSchema),
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
  const { addAideComptable } = useAddAideComptable();
  const onSubmit = handleSubmit(async (data) => {
    try {
      // await new Promise((resolve) => setTimeout(resolve, 500));
      await addAideComptable(data);

      reset();
      toast.success(currentUser ? t('updateSuccess') : t('createSuccess'));
      router.push(paths.dashboard.users.aideComptable);

    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
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
                label={
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      {t('banned')}
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
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <Field.Text name="name" label={t('fullName')} color="primary" error={!!errors.name} helperText={errors.name?.message} />
              <Field.Text name="email" label={t('emailAddress')} color="primary" error={!!errors.email} helperText={errors.email?.message} />
              <Field.Phone name="phoneNumber" label={t('phoneNumber')} color="primary" country="TN" error={!!errors.phoneNumber} helperText={errors.phoneNumber?.message} />
              <Field.Text name="city" label={t('city')} country="TN" color="primary" error={!!errors.city} helperText={errors.city?.message} />
              <Field.Text name="state" label={t('stateRegion')} color="primary" error={!!errors.state} helperText={errors.state?.message} />
              <Field.Text name="address" label={t('address')} color="primary" error={!!errors.address} helperText={errors.address?.message} />
              <Field.Text name="zipCode" label={t('zipCode')} color="primary" error={!!errors.zipCode} helperText={errors.zipCode?.message} />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentUser ? t('createAccounterHelper') : t('saveChanges')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
