import { Helmet } from 'react-helmet-async';

import { Container } from '@mui/material';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { useGetEntrepriseById } from 'src/actions/entreprise';

import { EmptyContent } from 'src/components/empty-content';
import { LoadingScreen } from 'src/components/loading-screen';

import { EntrepriseShowView } from 'src/sections/users/entreprise/view/entreprise-show-view';

// ----------------------------------------------------------------------

const metadata = { title: `Show Entreprise | Dashboard - ${CONFIG.appName}` };

export default function Page() {
    const { id = '' } = useParams();

    const {entrepriseData, entrepriseLoading, entrepriseError} = useGetEntrepriseById(id);
    if (entrepriseLoading) {
        return <LoadingScreen />;
    }
    if (entrepriseError) {
      return (
        <Container sx={{ my: 5 }}>
          <EmptyContent title="Entreprise not found" />
        </Container>
      );
    }
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <EntrepriseShowView 
        currentUser={entrepriseData}
      />
    </>
  );
}
