import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useGetDocuments } from 'src/actions/documents';

import SuarlPageView from 'src/sections/client/suarl/suarl-page-view';

// ----------------------------------------------------------------------

const metadata = { title: `SUARL - ${CONFIG.appName}` };

export default function Page() {
  const { documents, documentsLoading } = useGetDocuments(4);
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <SuarlPageView data={documents} loading={documentsLoading}/>
    </>
  );
}
