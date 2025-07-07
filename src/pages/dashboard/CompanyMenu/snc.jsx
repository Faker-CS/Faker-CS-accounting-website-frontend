import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useGetDocuments } from 'src/actions/documents';

import SncPageView from 'src/sections/client/snc/snc-page-view';

// ----------------------------------------------------------------------

const metadata = { title: `SNC - ${CONFIG.appName}` };

export default function Page() {
  const { documents, documentsLoading } = useGetDocuments(5);
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <SncPageView data={documents} loading={documentsLoading}/>
    </>
  );
}
