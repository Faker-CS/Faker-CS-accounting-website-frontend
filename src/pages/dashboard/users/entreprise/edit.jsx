import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';

import { EntrepriseEditView } from 'src/sections/users/entreprise/view/entreprise-edit-view';

// ----------------------------------------------------------------------

const metadata = { title: `Edit Entreprise | Dashboard - ${CONFIG.appName}` };

export default function Page() {
    const { id = '' } = useParams();

    console.log(id)

    const currentUser ={
        
    }
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <EntrepriseEditView currentUser={currentUser}/>
    </>
  );
}
