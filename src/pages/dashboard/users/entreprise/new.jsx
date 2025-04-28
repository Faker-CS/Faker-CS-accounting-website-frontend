import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { EntrepriseCreateView } from 'src/sections/users/entreprise/view';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new Entreprise | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <EntrepriseCreateView />
    </>
  );
}
