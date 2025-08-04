import { useTranslation } from 'react-i18next';

import { Stack } from '@mui/material';

// eslint-disable-next-line import/no-unresolved
import { paths } from 'src/routes/paths';

// eslint-disable-next-line import/no-unresolved
import { DashboardContent } from 'src/layouts/dashboard';
// eslint-disable-next-line import/no-unresolved
import { useGetAideComptableById } from 'src/actions/aideComptable';

// eslint-disable-next-line import/no-unresolved
import { LoadingScreen } from 'src/components/loading-screen';
// eslint-disable-next-line import/no-unresolved
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { AssignedDemandsTable } from '../assigned-demands-table';
import { AideComptableShowForm } from '../aide-comptable-show-form';

// ----------------------------------------------------------------------

export function AideComptableShowView({ id }) {
  const { t } = useTranslation();
  const { aideComptableData, aideComptableLoading, aideComptableError } = useGetAideComptableById(id);
  
  if (aideComptableLoading) {
    return <LoadingScreen />;
  }

  if (aideComptableError || !aideComptableData) {
    return (
      <DashboardContent>
        <CustomBreadcrumbs
          heading={t('accounterHelper')}
          links={[
            { name: t('dashboard'), href: paths.dashboard.root },
            { name: t('users'), href: paths.dashboard.users.root },
            { name: t('accounterHelpers'), href: paths.dashboard.users.aideComptable },
            { name: t('details') },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h3>{t('errorLoadingData')}</h3>
          <p>{t('unableToLoadAideComptableDetails')}</p>
        </div>
      </DashboardContent>
    );
  }
  
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={t('accounterHelper')}
        links={[
          { name: t('dashboard'), href: paths.dashboard.root },
          { name: t('users'), href: paths.dashboard.users.root },
          { name: t('accounterHelpers'), href: paths.dashboard.users.aideComptable },
          { name: aideComptableData?.name || t('details') },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Stack spacing={3}>
        <AideComptableShowForm currentUser={aideComptableData} />
        
        <AssignedDemandsTable demands={aideComptableData?.helper_forms || []} />
      </Stack>
    </DashboardContent>
  );
} 
