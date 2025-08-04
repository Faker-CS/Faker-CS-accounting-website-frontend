import { useTranslation } from 'react-i18next';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { UserNewEditForm } from '../employee-new-edit-form';

// ----------------------------------------------------------------------

export function EmployeeCreateView() {
  const { t } = useTranslation();
  
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={t('createNewEmployee')}
        links={[
          { name: t('dashboard'), href: paths.dashboard.root },
          { name: t('entreprise') },
          { name: t('newEmployee') },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <UserNewEditForm />
    </DashboardContent>
  );
}
