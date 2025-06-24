import React from 'react';
import { useTranslation } from 'react-i18next';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

export default function DepotPageView() {
  const { t } = useTranslation();
  return (
    <DashboardContent>
        <CustomBreadcrumbs
          heading={t('taxReturn')}
          links={[
            {
              name: t('home'),
              href: paths.dashboard.companyMenu.root,
              icon: <Iconify icon="solar:home-angle-2-bold-duotone" />,
            },
            {
              name: t('taxReturn'),
              href: '#',
            },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
      </DashboardContent>
  );
}