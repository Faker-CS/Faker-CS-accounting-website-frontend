import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { AideComptableListView } from 'src/sections/users/aide-comptable/view';

// ----------------------------------------------------------------------

const metadata = { title: `Companies list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      {/* <UserListView /> */}
      <AideComptableListView />
    </>
  );
}
