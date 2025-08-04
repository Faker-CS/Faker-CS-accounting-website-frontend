import { useTranslation } from 'react-i18next';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { UserNewEditForm } from 'src/sections/users/aide-comptable/user-new-edit-form';

// ----------------------------------------------------------------------

export function AideComptableCreateView() {
  const { t } = useTranslation();
  
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={t('createNewUser')}
        links={[
          { name: t('dashboard'), href: paths.dashboard.root },
          { name: t('accounterHelper'), href: paths.dashboard.users.newAideComptable },
          { name: t('newAccounterHelper') },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <UserNewEditForm />
    </DashboardContent>
  );
}
