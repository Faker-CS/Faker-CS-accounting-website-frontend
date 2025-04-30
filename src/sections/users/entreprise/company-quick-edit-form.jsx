import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
// eslint-disable-next-line import/no-extraneous-dependencies
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { USER_STATUS_OPTIONS } from 'src/_mock';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
// Adjust the path based on the actual location of schemaHelper

// ----------------------------------------------------------------------

export const UserQuickEditSchema = zod.object({
  raison_sociale: zod.string().min(1, { message: 'Name is required!' }),
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
  phone_number: schemaHelper.phoneNumber({ isValidPhoneNumber }),
  country: schemaHelper.objectOrNull({
    message: { required_error: 'Country is required!' },
  }),
  state: zod.string().min(1, { message: 'State is required!' }),
  ville: zod.string().min(1, { message: 'City is required!' }),
  adresse_siege_social: zod.string().min(1, { message: 'Address is required!' }),
  code_postale: zod.string().min(1, { message: 'Zip code is required!' }),
  company_name: zod.string().min(1, { message: 'Company is required!' }),
  industry: zod.string().min(1, { message: 'Industry is required!' }),
  // Not required
  status: zod.string(),
});

// ----------------------------------------------------------------------

export function UserQuickEditForm({ currentUser, open, onClose }) {
  const defaultValues = useMemo(
    () => ({
      name: currentUser?.raison_sociale || '',
      email: currentUser?.email || '',
      phone_number: currentUser?.phone_number || '',
      address: currentUser?.adresse_siege_social || '',
      country: currentUser?.country || '',
      state: currentUser?.state || '',
      ville: currentUser?.ville || '',
      zipCode: currentUser?.code_postale || '',
      status: currentUser?.status,
      company: currentUser?.company_name || '',
      role: currentUser?.industry || '',
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

  const onSubmit = handleSubmit(async (data) => {
    const promise = new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      reset();
      onClose();

      toast.promise(promise, {
        loading: 'Loading...',
        success: 'Update success!',
        error: 'Update error!',
      });

      await promise;

      console.info('DATA', data);
    } catch (error) {
      console.error(error);
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
        <DialogTitle>Quick Update</DialogTitle>

        <DialogContent>
          <Alert variant="outlined" severity="info" sx={{ mb: 3 }}>
            Account is waiting for confirmation
          </Alert>

          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
          >
            <Field.Select name="status" label="Status">
              {USER_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>

            <Box sx={{ display: { xs: 'none', sm: 'block' } }} />

            <Field.Text name="name" label="Raison Sociale" />
            <Field.Text name="email" label="Email address" />
            <Field.Phone name="phone_number" label="Phone number" />

           
            <Field.Text name="ville" label="City" />
            <Field.Text name="address" label="Address" />
            <Field.Text name="zipCode" label="Zip/code" />
            <Field.Text name="company" label="Company Name" />
            <Field.Text name="role" label="Industry" />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Update
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
