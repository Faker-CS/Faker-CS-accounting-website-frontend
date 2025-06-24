import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { paths } from 'src/routes/paths';

import { statusData } from 'src/_mock/_status';
import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ProductItemSkeleton } from 'src/components/skeleton/product-skeleton';

import { STORAGE_KEY } from 'src/auth/context/jwt';

import { FileManagerView } from '../single-files/view';

export default function SuarlPageView({ data, loading }) {
  const renderLoading = <ProductItemSkeleton />;
  const { t } = useTranslation();
  const [serviceStatus, setServiceStatus] = useState({
    value: 'loading',
    label: t('loading'),
    color: 'default',
  });

  useEffect(() => {
    const fetchServiceStatus = async () => {
      try {
        const response = await axios.get(`http://35.171.211.165:8000/api/status/3`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem(STORAGE_KEY)}`,
            'Content-Type': 'application/json',
          },
        });

        const fetchedStatus = response.data.status || 'none';

        const selectedStatus =
          statusData.find((status) => status.value === fetchedStatus) || statusData[0];

        setServiceStatus(selectedStatus);
      } catch (error) {
        setServiceStatus(statusData[0]);
      }
    };

    fetchServiceStatus();
  }, [data]);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={t('suarlCompanyFormation')}
        links={[
          {
            name: t('home'),
            href: paths.dashboard.companyMenu.root,
            icon: <Iconify icon="solar:home-angle-2-bold-duotone" />,
          },
          {
            name: t('suarlCompanyFormation'),
            href: '#',
          },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
        action={<Label color={serviceStatus.color}>{serviceStatus.label}</Label>}
      />
      {loading ? (
        renderLoading
      ) : (
        <FileManagerView files={data} setServiceStatus={setServiceStatus} serviceId={4} />
      )}
    </DashboardContent>
  );
} 