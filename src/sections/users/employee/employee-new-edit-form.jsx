import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useAuth } from 'src/hooks/useAuth';

import { useAddEmployee, useUpdateEmployee } from 'src/actions/employee';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export const NewUserSchema = zod.object({
  company_id: zod.union([zod.string(), zod.number()]).refine(val => val !== null && val !== undefined && val !== '', { message: 'Company is required!' }),
  first_name: zod.string().min(1, { message: 'First name is required!' }),
  last_name: zod.string().min(1, { message: 'Last name is required!' }),
  cin: zod.string().min(1, { message: 'CIN is required!' }).max(8, { message: 'CIN must be maximum 8 characters!' }),
  hiring_date: zod.string().min(1, { message: 'Hiring date is required!' }),
  contract_end_date: zod.string().optional(),
  contract_type: zod.string().min(1, { message: 'Contract type is required!' }),
  salary: zod.number().min(0, { message: 'Salary must be positive!' }),
  status: zod.enum(['working', 'not_working'], { message: 'Status is required!' }),
});

// ----------------------------------------------------------------------

export function UserNewEditForm({ currentUser }) {
  const { t } = useTranslation();
  const router = useRouter();
  const { userData } = useAuth();
  const { addEmployee } = useAddEmployee();
  const { updateEmployee } = useUpdateEmployee();

  // Get company_id from logged-in user
  const loggedInCompanyId = userData?.company_id;

  const defaultValues = useMemo(
    () => ({
      company_id: userData?.company_id || '',
      first_name: currentUser?.first_name || '',
      last_name: currentUser?.last_name || '',
      cin: currentUser?.cin || '',
      hiring_date: currentUser?.hiring_date || '',
      contract_end_date: currentUser?.contract_end_date || '',
      contract_type: currentUser?.contract_type || '',
      salary: currentUser?.salary || 0,
      status: currentUser?.status || 'working',
    }),
    [currentUser, userData]
  );

  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  // Set company_id when component mounts or loggedInCompanyId changes
  useEffect(() => {
    if (loggedInCompanyId && !currentUser) {
      setValue('company_id', loggedInCompanyId);
    }
  }, [loggedInCompanyId, setValue, currentUser]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Format dates to YYYY-MM-DD format for Laravel
      const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
      };

      // Ensure company_id is included from logged-in user
      const formData = {
        ...data,
        company_id: loggedInCompanyId || data.company_id,
        hiring_date: formatDate(data.hiring_date),
        contract_end_date: data.contract_end_date ? formatDate(data.contract_end_date) : '',
      };
      
      if (currentUser) {
        // Update existing employee
        await updateEmployee(currentUser.id, formData);
        toast.success(t('Update success!'));
      } else {
        // Create new employee
        await addEmployee(formData);
        toast.success(t('Create success!'));
      }
      
      reset();
      router.push(paths.dashboard.users.employee.root);
    } catch (error) {
      console.error('Error in form submission:', error);
      toast.error(currentUser ? t('Update failed!') : t('Create failed!'));
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card sx={{ pt: 5, pb: 5, px: 3 }}>
            {currentUser && (
              <Label
                color={
                  (values.status === 'working' && 'success') ||
                  (values.status === 'not_working' && 'warning') ||
                  'default'
                }
                sx={{ position: 'absolute', top: 24, right: 24 }}
              >
                {values.status}
              </Label>
            )}

            <Typography variant="h6" sx={{ mb: 3 }}>
              {t('employeeStatus')}
            </Typography>

            <Field.Select
              name="status"
              label={t('Employment Status')}
              placeholder={t('Select Employment Status')}
            >
              {[
                { label: t('Working'), value: 'working' },
                { label: t('Not Working'), value: 'not_working' },
              ].map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Field.Select>

            {currentUser && (
              <Stack justifyContent="center" alignItems="center" sx={{ mt: 3 }}>
                <Button variant="soft" color="error">
                  {t('deleteEmployee')}
                </Button>
              </Stack>
            )}
          </Card>
        </Grid>

        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
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
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
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

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton 
                type="submit" 
                variant="contained" 
                loading={isSubmitting}
              >
                {!currentUser ? t('Create Employee') : t('Save Changes')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
