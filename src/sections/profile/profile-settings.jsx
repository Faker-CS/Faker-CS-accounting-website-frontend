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

import { useAuth } from 'src/hooks/useAuth';

import { fData } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';
import { Field } from 'src/components/hook-form/fields';

export function ProfileSettings() {
  const { userData } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const fileInputRef = useRef(null);

  const methods = useForm({
    defaultValues: {
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
    },
  });
  const { handleSubmit, control, watch, reset } = methods;
  const values = watch();

  useEffect(() => {
    if (userData) {
      reset({
        email: userData.email || '',
        phone: userData.phoneNumber || '',
        address: userData.address || '',
        city: userData.city || '',
        state: userData.state || '',
        zipCode: userData.zipCode || '',
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

  const onSubmit = (data) => {
    console.log(data);
    // TODO: Implement profile update logic
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              {/* Profile Photo */}
              <Card sx={{ pt: 12, pb: 5, px: 3 }}>
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
                        Allowed *.jpeg, *.jpg, *.png, *.gif
                        <br /> max size of {fData(3145728)}
                      </Typography>
                    }
                  />
                </Box>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              {/* Login Settings */}
              <Card>
                <CardHeader title="Login Settings" />
                <Stack spacing={2.69} sx={{ p: 3 }}>
                  {/* Email Settings */}
                  <Field.Text
                    name="email"
                    label="Email"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Iconify icon="fluent:mail-24-filled" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  {/* Password Settings */}
                  <Field.Text
                    name="currentPassword"
                    label="Current Password"
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
                    label="New Password"
                    type={showPassword ? 'text' : 'password'}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Iconify icon="eva:lock-fill" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Button variant="contained" type="submit" sx={{ mt: 2 }}>
                    Update
                  </Button>
                </Stack>
              </Card>
            </Grid>
          </Grid>

          {/* Contact Information */}
          <Card>
            <CardHeader title="Contact Information" />
            <Stack spacing={3} sx={{ p: 3 }}>
              <Field.Text
                name="phone"
                label="Phone Number"
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
                label="Address"
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
                  label="City"
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
                  label="State"
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
                label="ZIP Code"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon="eva:map-fill" />
                    </InputAdornment>
                  ),
                }}
              />
              <Button variant="contained" type="submit">
                Update Contact Information
              </Button>
            </Stack>
          </Card>
        </Stack>
      </form>
    </FormProvider>
  );
}
