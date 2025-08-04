import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { EmployeeCreateView } from 'src/sections/users/employee/view/employee-create-view';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new Employee | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <EmployeeCreateView />
    </>
  );
}
