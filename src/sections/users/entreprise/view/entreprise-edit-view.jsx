import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { UserNewEditForm } from '../company-new-edit-form';

// ----------------------------------------------------------------------

export function EntrepriseEditView({currentUser}) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit user"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Entreprise', href: paths.dashboard.users.newEntreprise },
          { name: 'New entreprise' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <UserNewEditForm currentUser={currentUser}/>
    </DashboardContent>
  );
}
