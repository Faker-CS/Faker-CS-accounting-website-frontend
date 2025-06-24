import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useGetDocuments } from 'src/actions/documents';

import SaPageView from 'src/sections/client/sa/sa-page-view';

// ----------------------------------------------------------------------

const metadata = { title: `SA - ${CONFIG.appName}` };

export default function Page() {
  const { documents, documentsLoading } = useGetDocuments(5);
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <SaPageView data={documents} loading={documentsLoading} />
    </>
  );
}
