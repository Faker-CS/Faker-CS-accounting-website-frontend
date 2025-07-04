import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { UserNewEditForm } from '../company-new-edit-form';

// ----------------------------------------------------------------------

export function EntrepriseCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create a new entreprise"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Entreprise', href: paths.dashboard.users.newEntreprise },
          { name: 'New entreprise' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <UserNewEditForm />
    </DashboardContent>
  );
}
