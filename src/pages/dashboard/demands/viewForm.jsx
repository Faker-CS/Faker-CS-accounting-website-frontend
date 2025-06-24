/* eslint-disable import/no-unresolved */
import { useParams } from 'react-router';
import { Helmet } from 'react-helmet-async';

import { Button, Container } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { CONFIG } from 'src/config-global';
import { useGetForm } from 'src/actions/forms';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';

import { DemandesViewPage } from 'src/sections/demandes/view/demandes-view-page';
import { DemandesDetailsSkeleton } from 'src/sections/demandes/demandes-skeleton';

// ----------------------------------------------------------------------

const metadata = { title: `Liste des demandes - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();

  const { form, formLoading, formError } = useGetForm(id);

  if (formLoading) {
    return <DemandesDetailsSkeleton />;
  }

  if (formError) {
    return (
      <Container sx={{ my: 5 }}>
        <EmptyContent
          filled
          title="Formula not found!"
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.demandes}
              startIcon={<Iconify width={16} icon="eva:arrow-ios-back-fill" />}
              sx={{ mt: 3 }}
            >
              Back to the list
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

      <DemandesViewPage form={form} loading={formLoading} error={formError} />
    </>
  );
}
