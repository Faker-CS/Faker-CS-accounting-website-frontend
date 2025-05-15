import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useGetDocuments } from 'src/actions/documents';

import SarlssViewPage from 'src/sections/client/sarl-s/sarls-view-page';

// ----------------------------------------------------------------------

const metadata = { title: `SARL-S - ${CONFIG.appName}` };
const form_id = 3;
export default function Page() {
  const { documents, documentsLoading } = useGetDocuments(form_id);
  
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <SarlssViewPage data={documents} loading={documentsLoading} formId={form_id}/>
    </>
  );
}