import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import DemandesListeView from 'src/sections/demandes/view/demandes-liste-view';

// ----------------------------------------------------------------------

const metadata = { title: `Liste des demandes - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <DemandesListeView />
    </>
  );
}
