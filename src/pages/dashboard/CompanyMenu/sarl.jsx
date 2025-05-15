import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useGetDocuments } from 'src/actions/documents';

import SarlPageView from 'src/sections/client/sarl/sarl-page-view';

// ----------------------------------------------------------------------

const metadata = { title: `SARL - ${CONFIG.appName}` };

export default function Page() {
  const { documents, documentsLoading } = useGetDocuments(2);
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <SarlPageView data={documents} loading={documentsLoading}/>
    </>
  );
}