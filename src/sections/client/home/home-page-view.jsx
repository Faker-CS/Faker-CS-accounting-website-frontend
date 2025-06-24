import React from 'react';
import { useTranslation } from 'react-i18next';

import Grid from '@mui/material/Unstable_Grid2';
import { Stack, Button, MenuItem, MenuList } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useAuth } from 'src/hooks/useAuth';

import { DashboardContent } from 'src/layouts/dashboard';
import { SeoIllustration } from 'src/assets/illustrations';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { AppWelcome } from '../app-welcome';

export default function HomePageView() {
  const { userData } = useAuth();
  const popover = usePopover();
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading={t('home')}
          links={[
            {
              name: t('home'),
              href: '#',
              icon: <Iconify icon="solar:home-angle-2-bold-duotone" />,
            },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <Grid spacing={4}>
          <AppWelcome
            title={t('wishYouNiceDay', { name: userData?.name })}
            description={t('startSubmittingApplications')}
            img={<SeoIllustration hideBackground />}
            action={
              <Stack spacing={2} flexDirection={{ sx: 'column', md: 'row' }}>
                <Button
                  variant="contained"
                  color="primary"
                  LinkComponent={RouterLink}
                  href={paths.dashboard.companyMenu.newDemande}
                >
                  {t('authorizationRequest')}
                  <Iconify icon="solar:arrow-right-broken" />
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  LinkComponent={RouterLink}
                  href={paths.dashboard.companyMenu.deposit}
                >
                  {t('taxReturn')}
                  <Iconify icon="solar:arrow-right-broken" />
                </Button>
                <Button onClick={popover.onOpen} variant="contained" color="info">
                  {t('companyIncorporation')}
                  <Iconify icon="solar:arrow-right-broken" />
                </Button>
              </Stack>
            }
          />
        </Grid>
      </DashboardContent>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'top-center' } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              popover.onClose();
              router.push(paths.dashboard.companyMenu.sarl);
            }}
          >
            {t('sarl')}
          </MenuItem>

          <MenuItem
            onClick={() => {
              popover.onClose();
              router.push(paths.dashboard.companyMenu.sarls);
            }}
          >
            {t('sarls')}
          </MenuItem>
          <MenuItem
            onClick={() => {
              popover.onClose();
              router.push(paths.dashboard.companyMenu.suarl);
            }}
          >
            {t('suarl')}
          </MenuItem>
          <MenuItem
            onClick={() => {
              popover.onClose();
              router.push(paths.dashboard.companyMenu.snc);
            }}
          >
            {t('snc')}
          </MenuItem>
          <MenuItem
            onClick={() => {
              popover.onClose();
              router.push(paths.dashboard.companyMenu.sa);
            }}
          >
            {t('sa')}
          </MenuItem>
        </MenuList>
      </CustomPopover>
    </>
  );
}
