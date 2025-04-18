import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { EntrepriseListView } from 'src/sections/employees/entreprise/view/entreprise-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `Companies list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      {/* <UserListView /> */}
      <EntrepriseListView />
    </>
  );
}