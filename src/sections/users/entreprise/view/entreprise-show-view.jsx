import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { UserShowForm } from '../company-show-form';

// ----------------------------------------------------------------------

export function EntrepriseShowView({ currentUser }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Company Details"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Entreprise', href: paths.dashboard.users.newEntreprise },
          { name: 'Company Details' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <UserShowForm currentUser={currentUser} />
    </DashboardContent>
  );
} 