import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation();
    const { id = '' } = useParams();

    const {entrepriseData, entrepriseLoading, entrepriseError} = useGetEntreprise(id);
    
    const pageTitle = `${t('editEntreprise')} | Dashboard - ${CONFIG.appName}`;
    if (entrepriseLoading) {
        return <div>{t('loading')}</div>;
    }
    if (entrepriseError) {
      return (
        <Container sx={{ my: 5 }}>
          <EmptyContent
            filled
            title={t('formNotFound')}
            action={
              <Button
                component={RouterLink}
                href={paths.dashboard.users.entreprise}
                startIcon={<Iconify width={16} icon="eva:arrow-ios-back-fill" />}
                sx={{ mt: 3 }}
              >
                {t('goBackToList')}
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
        <title> {pageTitle}</title>
      </Helmet>

      <EntrepriseEditView 
        currentUser={entrepriseData}

      
      />
    </>
  );
}
