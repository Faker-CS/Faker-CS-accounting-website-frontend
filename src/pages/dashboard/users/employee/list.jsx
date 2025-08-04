import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { EmployeeListView } from 'src/sections/users/employee/view';


// ----------------------------------------------------------------------

const metadata = { title: `Employees list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <EmployeeListView />
    </>
  );
}
