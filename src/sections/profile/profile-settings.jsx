import { mutate } from 'swr';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider } from 'react-hook-form';
import { useRef, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

// eslint-disable-next-line import/no-unresolved
import { useAuth } from 'src/hooks/useAuth';

// eslint-disable-next-line import/no-unresolved
import { fData } from 'src/utils/format-number';
// eslint-disable-next-line import/no-unresolved
import { endpoints, axiosInstance } from 'src/utils/axios';

// eslint-disable-next-line import/no-unresolved
import { Iconify } from 'src/components/iconify';
// eslint-disable-next-line import/no-unresolved
import { Field } from 'src/components/hook-form/fields';

export function ProfileSettings() {
  const { userData, setUserData } = useAuth();
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef(null);

  
  const methods = useForm({
    defaultValues: {
      photo: userData?.photo || '',
      name: userData?.name || '',
      email: userData?.email || '',
      phoneNumber: userData?.phoneNumber || '',
      address: userData?.address || '',
      city: userData?.city || '',
      state: userData?.state || '',
      zipCode: userData?.zipCode || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });
  const { handleSubmit, control, watch, reset } = methods;
  const values = watch();

  useEffect(() => {
    if (userData) {
      reset({
        name: userData.name || '',
        email: userData.email || '',
        phoneNumber: userData.phoneNumber || '',
        address: userData.address || '',
        city: userData.city || '',
        state: userData.state || '',
        zipCode: userData.zipCode || '',
        photo: userData.photo || '',
      });
    }
  }, [userData, reset]);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = useCallback((event) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
    }
  }, []);

  const imageUrl = selectedFile ? URL.createObjectURL(selectedFile) : userData?.photo;
  const avatarUrl = userData?.photo
    ? `${import.meta.env.VITE_SERVER}/storage/${userData.photo}?t=${Date.now()}`
    : undefined;

  const onSubmit = async (data) => {
    if (!data.name || !data.email) {
      toast.error(t('nameEmailRequired'));
      return;
    }
    try {
      setIsSubmitting(true);

      // Create FormData for file upload
      const formData = new FormData();
      
      // Add basic info - ensure all fields are strings and not empty
      formData.append('name', String(data.name || ''));
      formData.append('email', String(data.email || ''));
      if (data.phoneNumber) formData.append('phoneNumber', String(data.phoneNumber));
      if (data.address) formData.append('address', String(data.address));
      if (data.city) formData.append('city', String(data.city));
      if (data.state) formData.append('state', String(data.state));
      if (data.zipCode) formData.append('zipCode', String(data.zipCode));

      // Handle password update
      if (data.newPassword) {
        formData.append('currentPassword', String(data.currentPassword));
        formData.append('newPassword', String(data.newPassword));
        formData.append('newPassword_confirmation', String(data.confirmPassword));
      }

      // Add _method for Laravel to treat as PUT
      formData.append('_method', 'PUT');

      // Use the file from react-hook-form state
      if (data.photo instanceof File) {
        formData.append('photo', data.photo);
      }

      // Use POST instead of PUT for file upload
      const response = await axiosInstance.post(`${import.meta.env.VITE_SERVER}/api/profile`, formData, {
        headers: {
          'Accept': 'application/json',
        },
        transformRequest: [(requestData) => requestData], // Prevent axios from transforming the FormData
      });

      // Update user data in context
      setUserData(response.data.user);

      // Optionally refresh user data from the server
      mutate(endpoints.auth.me);

      toast.success(t('profileUpdatedSuccessfully'));
      
      // Reset password fields
      reset({
        ...data,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      
      // Handle validation errors
      if (error.response?.status === 422) {
        const validationErrors = error.response.data.errors;
        if (validationErrors) {
          // Show all validation errors
          Object.values(validationErrors).forEach(errors => {
            errors.forEach(err => toast.error(err));
          });
        } else {
          toast.error(error.response.data.message || t('validationFailed'));
        }
      } else {
        toast.error(error.response?.data?.message || t('failedToUpdateProfile'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              {/* Profile Photo */}
              <Card sx={{ pt: 12, pb: 5, px: 3 }}>
                <Box sx={{ mb: 5 }}>
                  <Field.UploadAvatar
                    name="photo"
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
                        <br /> {t('maxSize')} {fData(3145728)}
                      </Typography>
                    }
                  />
                </Box>
              </Card>
            </Grid>

            <Grid item xs={12} md={8}>
              {/* Login Settings */}
              <Card>
                <CardHeader title={t('loginSettings')} />
                <Stack spacing={2.69} sx={{ p: 3 }}>
                  <Field.Text
                    name="name"
                    label={t('fullName')}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Iconify icon="eva:person-fill" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Field.Text
                    name="email"
                    label={t('email')}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Iconify icon="fluent:mail-24-filled" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Field.Text
                    name="currentPassword"
                    label={t('currentPassword')}
                    type={showPassword ? 'text' : 'password'}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Iconify icon="eva:lock-fill" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleClickShowPassword} edge="end">
                            <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Field.Text
                    name="newPassword"
                    label={t('newPassword')}
                    type={showPassword ? 'text' : 'password'}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Iconify icon="eva:lock-fill" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Field.Text
                    name="confirmPassword"
                    label={t('confirmNewPassword')}
                    type={showPassword ? 'text' : 'password'}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Iconify icon="eva:lock-fill" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Stack>
              </Card>
            </Grid>
          </Grid>

          {/* Contact Information */}
          <Card>
            <CardHeader title={t('contactInformation')} />
            <Stack spacing={3} sx={{ p: 3 }}>
              <Field.Text
                name="phoneNumber"
                label={t('phoneNumber')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon="eva:phone-fill" />
                    </InputAdornment>
                  ),
                }}
              />
              <Field.Text
                name="address"
                label={t('address')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon="solar:home-angle-2-bold-duotone" />
                    </InputAdornment>
                  ),
                }}
              />
              <Box
                sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}
              >
                <Field.Text
                  name="city"
                  label={t('city')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Iconify icon="mingcute:location-fill" />
                      </InputAdornment>
                    ),
                  }}
                />
                <Field.Text
                  name="state"
                  label={t('state')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Iconify icon="eva:map-fill" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              <Field.Text
                name="zipCode"
                label={t('zipCode')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon="eva:map-fill" />
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>
          </Card>

          {/* Update Button */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button 
              variant="contained" 
              type="submit" 
              disabled={isSubmitting}
              sx={{ minWidth: 200 }}
            >
              {isSubmitting ? t('updating') : t('updateProfile')}
            </Button>
          </Box>
        </Stack>
      </form>
    </FormProvider>
  );
}
