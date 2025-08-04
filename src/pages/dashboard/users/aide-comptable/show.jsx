import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

// eslint-disable-next-line import/no-unresolved
import { CONFIG } from 'src/config-global';

// eslint-disable-next-line import/no-unresolved
import { AideComptableShowView } from 'src/sections/users/aide-comptable/view/aide-comptable-show-view';

// ----------------------------------------------------------------------

const metadata = { title: `Show Aide Comptable | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <AideComptableShowView id={id} />
    </>
  );
}
