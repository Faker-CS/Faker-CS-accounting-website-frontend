import { mutate } from 'swr';
import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { endpoints } from 'src/utils/axios';

import { useUpdateEmployee } from 'src/actions/employee';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export const UserQuickEditSchema = zod.object({
  first_name: zod.string().min(1, { message: 'First name is required!' }),
  last_name: zod.string().min(1, { message: 'Last name is required!' }),
  cin: zod.string().min(1, { message: 'CIN is required!' }).max(8, { message: 'CIN must be maximum 8 characters!' }),
  hiring_date: zod.string().min(1, { message: 'Hiring date is required!' }),
  contract_end_date: zod.string().optional(),
  contract_type: zod.string().min(1, { message: 'Contract type is required!' }),
  salary: zod.union([zod.string(), zod.number()]).transform((val) => {
    const num = typeof val === 'string' ? parseFloat(val) : val;
    return Number.isNaN(num) ? 0 : num;
  }).refine((val) => val >= 0, { message: 'Salary must be positive!' }),
  status: zod.enum(['working', 'not_working'], { message: 'Status is required!' }),
  company_id: zod.union([zod.string(), zod.number()]).refine(val => val !== null && val !== undefined && val !== '', { message: 'Company is required!' }),
});

// ----------------------------------------------------------------------

export function UserQuickEditForm({ currentUser, open, onClose }) {
  const { t } = useTranslation();
  const { updateEmployee } = useUpdateEmployee();

  const defaultValues = useMemo(
    () => ({
      first_name: currentUser?.first_name || '',
      last_name: currentUser?.last_name || '',
      cin: currentUser?.cin || '',
      hiring_date: currentUser?.hiring_date || '',
      contract_end_date: currentUser?.contract_end_date || '',
      contract_type: currentUser?.contract_type || '',
      salary: currentUser?.salary || 0,
      status: currentUser?.status || 'working',
      company_id: currentUser?.company_id || '',
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
    try {
      // Format dates to YYYY-MM-DD format for Laravel
      const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
      };

      const formData = {
        ...data,
        hiring_date: formatDate(data.hiring_date),
        contract_end_date: data.contract_end_date ? formatDate(data.contract_end_date) : '',
      };

      await updateEmployee(currentUser.id, formData);
      
      // Refresh the employee list
      mutate(endpoints.employee.list);
      mutate(endpoints.employee.byCompany(currentUser.company_id));
      
      reset();
      onClose();
      toast.success(t('Update success!'));
    } catch (error) {
      console.error(error);
      toast.error(t('Update failed!'));
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
          {/* Hidden field for company_id */}
          <Field.Text 
            name="company_id" 
            type="hidden" 
            sx={{ display: 'none' }}
          />
          
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
          >
            <Field.Select name="status" label={t('Employment Status')}>
              {[
                { label: t('Working'), value: 'working' },
                { label: t('Not Working'), value: 'not_working' },
              ].map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Field.Select>

            <Box sx={{ display: { xs: 'none', sm: 'block' } }} />

            <Field.Text name="first_name" label={t('First Name')} />
            <Field.Text name="last_name" label={t('Last Name')} />
            <Field.Text name="cin" label={t('CIN')} inputProps={{ maxLength: 8 }} />
            
            <Field.DatePicker name="hiring_date" label={t('Hiring Date')} />
            <Field.DatePicker name="contract_end_date" label={t('Contract End Date')} />
            
            <Field.Select
              name="contract_type"
              label={t('Contract Type')}
              placeholder={t('Select Contract Type')}
            >
              {[
                { label: 'CVIP', value: 'cvip' },
                { label: 'CDI', value: 'cdi' },
                { label: 'KARAMA', value: 'karama' },
                { label: 'Freelance', value: 'freelance' },
              ].map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Field.Select>
            
            <Field.Text 
              name="salary" 
              label={t('Salary')} 
              type="number"
              inputProps={{ min: 0, step: 0.01 }}
            />
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
