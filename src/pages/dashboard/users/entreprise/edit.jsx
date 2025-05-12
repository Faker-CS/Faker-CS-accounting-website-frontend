import { Helmet } from 'react-helmet-async';

import { Button, Container } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { CONFIG } from 'src/config-global';
import { useGetEntreprise } from 'src/actions/entreprise';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';

import { EntrepriseEditView } from 'src/sections/users/entreprise/view/entreprise-edit-view';

// ----------------------------------------------------------------------

const metadata = { title: `Edit Entreprise | Dashboard - ${CONFIG.appName}` };

export default function Page() {
    const { id = '' } = useParams();

    // console.log(id)
    const {entrepriseData, entrepriseLoading, entrepriseError} = useGetEntreprise(id);
console.log(entrepriseData)
    if (entrepriseLoading) {
        return <div>Loading...</div>;
    }
    if (entrepriseError) {
      return (
        <Container sx={{ my: 5 }}>
          <EmptyContent
            filled
            title="Formulaire non trouvé !"
            action={
              <Button
                component={RouterLink}
                href={paths.dashboard.users.entreprise}
                startIcon={<Iconify width={16} icon="eva:arrow-ios-back-fill" />}
                sx={{ mt: 3 }}
              >
                Go back to the liste
              </Button>
            }
            sx={{ py: 10 }}
          />
        </Container>
      );
    }
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <EntrepriseEditView 
        currentUser={entrepriseData}

      
      />
    </>
  );
}
