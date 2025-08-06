import { useState } from 'react';

import { Tab, Card, Tabs, CardContent } from '@mui/material';

import { useAuth } from 'src/hooks/useAuth';

import { useGetCompanyServicesWithStatus, useGetServices } from 'src/actions/services';

import AdminServicesView from './admin-services-view';
import CompanyServicesView from './company-services-view';

// ----------------------------------------------------------------------

export default function ServicesView() {
  const { userData } = useAuth();
  
  // Only comptable role can access Gestion Services
  const isComptable = userData?.roles === 'comptable';
  
  const [currentTab, setCurrentTab] = useState(isComptable ? 'admin' : 'company');

  const handleChangeTab = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const TABS = [
    {
      value: 'company',
      label: 'Mes Services',
      icon: 'solar:widget-bold-duotone',
    },
  ];

  // Add admin tabs if user is comptable
  if (isComptable ) {
    TABS.unshift({
      value: 'admin',
      label: 'Gestion Services',
      icon: 'solar:settings-bold-duotone',
    });
  }

  return (
    <>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Tabs
            value={currentTab}
            onChange={handleChangeTab}
            sx={{
              px: 2,
              bgcolor: 'background.neutral',
            }}
          >
            {TABS.map((tab) => (
              <Tab key={tab.value} value={tab.value} label={tab.label} />
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {currentTab === 'admin' && isComptable && <AdminServicesView />}
      {currentTab === 'company' && <CompanyServicesView />}
    </>
  );
} 