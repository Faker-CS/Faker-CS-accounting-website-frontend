import { useRef } from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';

import { useAuth } from 'src/hooks/useAuth';

import { Iconify } from 'src/components/iconify';


// ----------------------------------------------------------------------

export function ProfileHome({ info, posts }) {
  const fileRef = useRef(null);
  const { userData } = useAuth();
  const { t } = useTranslation();

  const roleMap = {
    'comptable': t('accountant'),
    'aide-comptable': t('assistantAccountant'),
    'entreprise': t('company'),
  };
  let userRole = t('accountant');
  if (userData?.roles) {
    if (Array.isArray(userData.roles) && userData.roles.length > 0) {
      userRole = roleMap[userData.roles[0]?.toLowerCase()] || userData.roles[0];
    } else if (typeof userData.roles === 'string') {
      userRole = roleMap[userData.roles?.toLowerCase()] || userData.roles;
    }
  }

  const handleAttach = () => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  };

  const renderFollows = (
    <Card sx={{ py: 3, textAlign: 'center', typography: 'h4' }}>
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
      >
        {/* <Stack width={1}>
          {fNumber(info.totalFollowers)}
          <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
            Companies 
          </Box>
        </Stack> */}

        
      </Stack>
    </Card>
  );

  const renderAbout = (
    <Card>
      <CardHeader title={t('about')} />

      <Stack spacing={2} sx={{ p: 3, typography: 'body2' }}>
        {/* <Box>{info.quote}</Box> */}

        <Box display="flex">
          <Iconify width={26} icon="mingcute:location-fill" sx={{ mr: 2 }} />
          {t('liveAt')}
          <Link variant="subtitle2" color="inherit">
            &nbsp;{userData?.address}
          </Link>
        </Box>

        <Box display="flex">
          <Iconify width={24} icon="fluent:mail-24-filled" sx={{ mr: 2 }} />
          {userData?.email}
        </Box>

        <Box display="flex">
          <Iconify width={24} icon="ic:round-business-center" sx={{ mr: 2 }} />
          {userRole}
        </Box>
      </Stack>
    </Card>
  );

  const renderPostInput = (
    <Card sx={{ p: 3 }}>
      

      <input ref={fileRef} type="file" style={{ display: 'none' }} />
    </Card>
  );


  return (
    <Grid container spacing={3}>
      <Grid xs={12} md={4}>
        <Stack spacing={3}>
          {renderAbout}
        </Stack>
      </Grid>
    </Grid>
  );
}
