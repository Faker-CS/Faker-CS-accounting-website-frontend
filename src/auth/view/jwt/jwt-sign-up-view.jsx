import { z as zod } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { register } from '../../context/jwt';
import { useAuthContext } from '../../hooks';
import { FormHead } from '../../components/form-head';
import { SignUpTerms } from '../../components/sign-up-terms';

// ----------------------------------------------------------------------

export const SignUpSchema = (t) => zod.object({
  name: zod.string().min(1, { message: t('nameRequired') }),
  email: zod
    .string()
    .min(1, { message: t('emailRequired') })
    .email({ message: t('emailMustBeValid') }),
  password: zod
    .string()
    .min(1, { message: t('passwordRequired') })
    .min(6, { message: t('passwordMinLength') }),
  role: zod.string().min(1, { message: t('roleRequired') }),
});

// ----------------------------------------------------------------------

export function JwtSignUpView() {
  const { t } = useTranslation();
  
  const { checkUserSession } = useAuthContext();

  const router = useRouter();

  const password = useBoolean();

  const [errorMsg, setErrorMsg] = useState('');

  const defaultValues = {
    name: '',
    email: '',
    password: '',
    role: 'entreprise',
  };

  const methods = useForm({
    resolver: zodResolver(SignUpSchema(t)),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await register({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      });
      await checkUserSession?.();

      router.refresh();
    } catch (error) {
      console.error(error);
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });

  const renderForm = (
    <Box gap={3} display="flex" flexDirection="column">
      <Box display="flex" gap={{ xs: 3, sm: 2 }} flexDirection={{ xs: 'column', sm: 'row' }}>
        <Field.Text name="name" label={t('fullName')} InputLabelProps={{ shrink: true }} fullWidth />
        <Field.Select
          name="role"
          label={t('role')}
          InputLabelProps={{ shrink: true }}
          fullWidth
        >
          <MenuItem value="comptable">{t('accountant')}</MenuItem>
          <MenuItem value="aide-comptable">{t('accountantAssistant')}</MenuItem>
          <MenuItem value="entreprise">{t('company')}</MenuItem>
        </Field.Select>
      </Box>

      <Field.Text name="email" label={t('emailAddress')} InputLabelProps={{ shrink: true }} />

      <Field.Text
        name="password"
        label={t('password')}
        placeholder={t('passwordPlaceholder')}
        type={password.value ? 'text' : 'password'}
        InputLabelProps={{ shrink: true }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={password.onToggle} edge="end">
                <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator={t('creatingAccount')}
      >
        {t('createAccount')}
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <FormHead
        title={t('getStartedFree')}
        description={
          <>
            {t('alreadyHaveAccount')}
            <Link component={RouterLink} href={paths.auth.jwt.signIn} variant="subtitle2">
              {t('getStarted')}
            </Link>
          </>
        }
        sx={{ textAlign: { xs: 'center', md: 'left' } }}
      />

      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>

      <SignUpTerms />
    </>
  );
}