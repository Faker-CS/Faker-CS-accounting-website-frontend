import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useGetDocuments } from 'src/actions/documents';

import DepotView from 'src/sections/client/depot/views/depot-views';

// ----------------------------------------------------------------------

const metadata = { title: `Déclaration d’impôt - ${CONFIG.appName}` };

export default function Page() {
  const { documents, documentsLoading } = useGetDocuments(4);
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <DepotView data={documents} loading={documentsLoading}/>
    </>
  );
}