import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useGetDocuments } from 'src/actions/documents';

import DemandePageView from 'src/sections/client/demande/views/demande-page-view';

// ----------------------------------------------------------------------

const metadata = { title: `Demande d'autorisation de constitution - ${CONFIG.appName}` };

export default function Page() {
  const { documents, documentsLoading } = useGetDocuments(1);
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <DemandePageView data={documents} loading={documentsLoading}/>
    </>
  );
}