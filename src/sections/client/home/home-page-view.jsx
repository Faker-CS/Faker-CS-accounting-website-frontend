import React from 'react';

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

import { useMockedUser } from 'src/auth/hooks';

import { AppWelcome } from '../app-welcome';

export default function HomePageView() {
  const { user } = useMockedUser();
  const { userData } = useAuth();
  const popover = usePopover();
  const router = useRouter();

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Home"
          links={[
            {
              name: 'Home',
              href: '#',
              icon: <Iconify icon="solar:home-angle-2-bold-duotone" />,
            },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <Grid spacing={4}>
          <AppWelcome
            title={`Wish you a nice day 👋 \n ${userData?.name}`}
            description="Start submitting your applications now, you can choose between "
            img={<SeoIllustration hideBackground />}
            action={
              <Stack spacing={2} flexDirection={{ sx: 'column', md: 'row' }}>
                <Button
                  variant="contained"
                  color="primary"
                  LinkComponent={RouterLink}
                  href={paths.dashboard.companyMenu.newDemande}
                >
                  Authorization request
                  <Iconify icon="solar:arrow-right-broken" />
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  LinkComponent={RouterLink}
                  href={paths.dashboard.companyMenu.deposit}
                >
                  Tax return
                  <Iconify icon="solar:arrow-right-broken" />
                </Button>
                <Button onClick={popover.onOpen} variant="contained" color="info">
                  Company incorporation ...
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
              router.push(paths.dashboard.sarl);
            }}
          >
            SARL
          </MenuItem>

          <MenuItem
            onClick={() => {
              popover.onClose();
              router.push(paths.dashboard.sarls);
            }}
          >
            SARL-S
          </MenuItem>
        </MenuList>
      </CustomPopover>
    </>
  );
}
