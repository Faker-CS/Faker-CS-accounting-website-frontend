/* eslint-disable import/no-unresolved */
import { mutate } from 'swr';
import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
// eslint-disable-next-line import/no-extraneous-dependencies
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { useUpdateAideComptable } from 'src/actions/aideComptable';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
// Adjust the path based on the actual location of schemaHelper

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export function UserQuickEditForm({ currentUser, open, onClose }) {
  const { t } = useTranslation();
  
  const UserQuickEditSchema = zod.object({
    name: zod.string().min(1, { message: t('nameRequired') }),
    email: zod
      .string()
      .min(1, { message: t('emailRequired') })
      .email({ message: t('emailMustBeValid') }),
    phoneNumber: schemaHelper.phoneNumber({ isValidPhoneNumber }),
    state: zod.string().min(1, { message: t('stateRequired') }),
    city: zod.string().min(1, { message: t('cityRequired') }),
    address: zod.string().min(1, { message: t('addressRequired') }),
    zipCode: zod.number().min(1, { message: t('zipCodeRequired') }),
  });
  
  const defaultValues = useMemo(
    () => ({
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      phoneNumber: currentUser?.phoneNumber || '',
      address: currentUser?.address || '',
      state: currentUser?.state || '',
      city: currentUser?.city || '',
      zipCode: currentUser?.zipCode || '',
    }),
    [currentUser]
  );
  
  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(UserQuickEditSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const { updateAideComptable } = useUpdateAideComptable();

  const onSubmit = handleSubmit(async (data) => {
    try {
      const result =  updateAideComptable(currentUser.id, data);
    toast.promise(result, {
        loading: t('loading'),
        success: t('updateSuccess'),
        error: t('updateError'),
      });
      mutate();
    } catch (error) {
      console.error(error);
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

            <Box sx={{ display: { xs: 'none', sm: 'block' } }} />

            <Field.Text name="name" label={t('fullName')} color="primary"/>
            <Field.Text name="email" label={t('emailAddress')} color="primary"/>
            <Field.Phone name="phoneNumber" label={t('phoneNumber')} color="primary"/>
            <Field.Text name="state" label={t('stateRegion')} color="primary"/>
            <Field.Text name="city" label={t('city')} color="primary"/>
            <Field.Text name="address" label={t('address')} color="primary"/>
            <Field.Text name="zipCode" label={t('zipCode')} color="primary"/>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            {t('cancel')}
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting} >
            {t('update')}
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
