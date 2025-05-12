import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { AideComptableCreateView } from 'src/sections/users/aide-comptable/view';
// ----------------------------------------------------------------------

const metadata = { title: `Create a new Accounter Helper | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <AideComptableCreateView />
    </>
  );
}
