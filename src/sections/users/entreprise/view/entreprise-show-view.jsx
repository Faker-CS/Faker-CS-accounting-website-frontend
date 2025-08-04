import { useTranslation } from 'react-i18next';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { UserShowForm } from '../company-show-form';

// ----------------------------------------------------------------------

export function EntrepriseShowView({ currentUser }) {
  const { t } = useTranslation();
  
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={t('companyDetails')}
        links={[
          { name: t('dashboard'), href: paths.dashboard.root },
          { name: t('entreprise'), href: paths.dashboard.users.newEntreprise },
          { name: t('companyDetails') },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <UserShowForm currentUser={currentUser} />
    </DashboardContent>
  );
} 