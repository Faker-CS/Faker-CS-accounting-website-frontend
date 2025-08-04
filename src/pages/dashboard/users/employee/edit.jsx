import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import { Button, Container } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { CONFIG } from 'src/config-global';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';

import { EmployeeListView } from 'src/sections/users/employee/view';

// ----------------------------------------------------------------------

const metadata = { title: `Edit Employee | Dashboard - ${CONFIG.appName}` };

export default function Page() {
    const { t } = useTranslation();
    const { id = '' } = useParams();

    // eslint-disable-next-line no-undef
    const {employeeData, employeeLoading, employeeError} = useGetEmployee(id);

    const pageTitle = `${t('editEmployee')} | Dashboard - ${CONFIG.appName}`;
    if (employeeLoading) {
        return <div>{t('loading')}</div>;
    }
    if (employeeError) {
      return (
        <Container sx={{ my: 5 }}>
          <EmptyContent
            filled
            title={t('formNotFound')}
            action={
              <Button
                component={RouterLink}
                href={paths.dashboard.users.employee}
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

      <EmployeeListView
        currentUser={employeeData}
      />
    </>
  );
}
