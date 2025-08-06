/* eslint-disable import/no-unresolved */
import { Helmet } from 'react-helmet-async';

import { Container, Typography } from '@mui/material';

import { CONFIG } from 'src/config-global';

import { useSettingsContext } from 'src/components/settings';

import ServicesView from 'src/sections/services/view/services-view';

// ----------------------------------------------------------------------

const metadata = { title: `Services | Dashboard - ${CONFIG.appName}` };

export default function ServicesPage() {
  const settings = useSettingsContext();

  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Services
        </Typography>

        <ServicesView />
      </Container>
    </>
  );
} 