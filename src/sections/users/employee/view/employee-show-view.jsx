import { useTranslation } from 'react-i18next';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { UserShowForm } from '../employee-show-form';

// ----------------------------------------------------------------------

export function EmployeeShowView({ currentUser }) {
  const { t } = useTranslation();
  
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={t('employee')}
        links={[
          { name: t('dashboard'), href: paths.dashboard.root },
          { name: t('users'), href: paths.dashboard.users.root },
          { name: t('employee'), href: paths.dashboard.users.employee.root },
          { name: currentUser?.first_name && currentUser?.last_name ? `${currentUser.first_name} ${currentUser.last_name}` : t('employee') },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <UserShowForm currentUser={currentUser} />
    </DashboardContent>
  );
} 