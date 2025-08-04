/* eslint-disable import/no-unresolved */
import axios from 'axios';
import { z as zod } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { FileManagerShareDialog } from 'src/sections/file-manager/file-manager-share-dialog';

import { useAuthContext } from '../../hooks';
import { FormHead } from '../../components/form-head';
import { signInWithPassword } from '../../context/jwt';

// ----------------------------------------------------------------------

export const SignInSchema = (t) => zod.object({
  email: zod
    .string()
    .min(1, { message: t('emailRequired') })
    .email({ message: t('emailMustBeValid') }),
  password: zod
    .string()
    .min(1, { message: t('passwordRequired') })
    .min(6, { message: t('passwordMinLength') }),
});

// ----------------------------------------------------------------------

export function JwtSignInView() {
  const { t } = useTranslation();
  
  const router = useRouter();

  const { signIn, checkUserSession } = useAuthContext();

  const [errorMsg, setErrorMsg] = useState('');

  const password = useBoolean();

  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [sending, setSending] = useState(false);

  const defaultValues = {
    email: '',
    password: '',
  };

  const methods = useForm({
    resolver: zodResolver(SignInSchema(t)),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      // cookie-based sunctum login
      await signInWithPassword({ email: data.email, password: data.password });

      // refresh my local session
      await checkUserSession?.();

      router.refresh();
    } catch (error) {
      console.error(error);
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });

  const handleForgot = async (email) => {
    setSending(true);
    try {
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/auth/forgot-password`, { email });
      toast.success(t('passwordSentToEmail'));
      setForgotOpen(false);
      setForgotEmail('');
    } catch (err) {
      toast.error(t('notPartOfTeam'));
    }
    setSending(false);
  };

  const renderForm = (
    <Box gap={3} display="flex" flexDirection="column">
      <Field.Text name="email" label={t('emailAddress')} placeholder={t('enterYourEmail')} InputLabelProps={{ shrink: true }} />

      <Box gap={1.5} display="flex" flexDirection="column">
        <Link
          component="button"
          variant="body2"
          color="inherit"
          sx={{ alignSelf: 'flex-end' }}
          onClick={() => setForgotOpen(true)}
          // tabIndex={-1}
          type="button"   
        >
          {t('forgotPassword')}
        </Link>

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
      </Box>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator={t('signingIn')}
      >
        {t('signIn')}
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <FormHead
        title={t('signInToAccount')}
        description={
          <>
            {t('dontHaveAccount')}
            {/* <Link component={RouterLink} href={paths.auth.jwt.signUp} variant="subtitle2">
              Get started
            </Link> */}
          </>
        }
        sx={{ textAlign: { xs: 'center', md: 'left' } }}
      />

      <Alert severity="info" sx={{ mb: 3 }}>
        {t('useEmailWithPassword')} <strong>{t('email')}</strong>
        {t('withYourPassword')} <strong>{t('yourPassword')}</strong> {t('weSendToYou')}
      </Alert>

      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>

      <FileManagerShareDialog
        open={forgotOpen}
        onClose={() => setForgotOpen(false)}
        inviteEmail={forgotEmail}
        onChangeInvite={e => setForgotEmail(e.target.value)}
        onSendEmail={handleForgot}
        sending={sending}
      />
    </>
  );
}
