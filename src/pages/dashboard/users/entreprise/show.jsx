import { Helmet } from 'react-helmet-async';

import { Container } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { CONFIG } from 'src/config-global';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';

import { EntrepriseShowView } from 'src/sections/users/entreprise/view/entreprise-show-view';
import { useGetEntrepriseById } from 'src/actions/entreprise';

// ----------------------------------------------------------------------

const metadata = { title: `Show Entreprise | Dashboard - ${CONFIG.appName}` };

export default function Page() {
    const { id = '' } = useParams();

    // console.log(id)
    const {entrepriseData, entrepriseLoading, entrepriseError} = useGetEntrepriseById(id);
    if (entrepriseLoading) {
        return <div>Loading...</div>;
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
