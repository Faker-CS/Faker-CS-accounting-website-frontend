import { useTranslation } from 'react-i18next';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { UserNewEditForm } from '../company-new-edit-form';

// ----------------------------------------------------------------------

export function EntrepriseCreateView() {
  const { t } = useTranslation();
  
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={t('createNewEntreprise')}
        links={[
          { name: t('dashboard'), href: paths.dashboard.root },
          { name: t('entreprise'), href: paths.dashboard.users.newEntreprise },
          { name: t('newEntreprise') },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <UserNewEditForm />
    </DashboardContent>
  );
}
