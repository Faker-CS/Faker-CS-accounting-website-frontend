/* eslint-disable import/no-unresolved */
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { useUpdateEntreprise } from 'src/actions/entreprise';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
// Adjust the path based on the actual location of schemaHelper

// ----------------------------------------------------------------------

// export const UserQuickEditSchema = zod.object({
//   name: zod.string().min(1, 'Name is required'),
//   email: zod.string().email('Email must be a valid email address'),
//   phone_number: zod
//     .string()
//     .refine((value) => isValidPhoneNumber(value), 'Phone number must be valid'),
//   address: zod.string().min(1, 'Address is required'),
//   country: zod.string().min(1, 'Country is required'),
//   state: zod.string().min(1, 'State is required'),
//   ville: zod.string().min(1, 'City is required'),
// });

// ----------------------------------------------------------------------

export function UserQuickEditForm({ currentUser, open, onClose }) {
  const { t } = useTranslation();
  
  const defaultValues = useMemo(
    () => ({
      name: currentUser?.raison_sociale || '',
      email: currentUser?.email || '',
      phone_number: currentUser?.phone_number || '',
      address: currentUser?.adresse_siege_social || '',
      ville: currentUser?.ville || '',
      zipCode: currentUser?.code_postale || '',
      status: currentUser?.status,
    }),
    [currentUser]
  );

  

  const methods = useForm({
    mode: 'all',
    // resolver: zodResolver(UserQuickEditSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const { updateEntreprise } = useUpdateEntreprise();

  const onSubmit = handleSubmit(async (data) => {
    try {
      const result = updateEntreprise(currentUser.id, data);

      toast.promise(result, {
        loading: t('loading'),
        success: t('updateSuccess'),
        error: t('updateError'),
      });
    } catch (error) {
      console.error('Update failed:', error);
      toast.error(t('updateFailed'));
    }
  });

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { maxWidth: 720 } }}
    >
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>{t('quickUpdate')}</DialogTitle>

        <DialogContent>
          <Alert variant="outlined" severity="info" sx={{ mb: 3 }}>
            {t('accountWaitingConfirmation')}
          </Alert>

          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
          >
            <Field.Select name="status" label={t('status')}>
              {[
                { value: 'Active', label: t('active') }, 
                { value: 'Inactive', label: t('inactive') }, 
                { value: 'Pending', label: t('pending') }
              ].map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>

            <Box sx={{ display: { xs: 'none', sm: 'block' } }} />

            <Field.Text name="name" label={t('raisonSociale')} />
            <Field.Text name="email" label={t('emailAddress')} />
            <Field.Phone name="phone_number" label={t('phoneNumber')} />

            <Field.Text name="ville" label={t('city')} />
            <Field.Text name="address" label={t('address')} />
            <Field.Text name="zipCode" label={t('zipCode')} />
            {/* <Field.Text name="company" label="Company Name" /> */}
            <Field.Text name="role" label={t('industry')} disabled className="cursor-default text-black bg-white" />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            {t('cancel')}
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {t('update')}
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
