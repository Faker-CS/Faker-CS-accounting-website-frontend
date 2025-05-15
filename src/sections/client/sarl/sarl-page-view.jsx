import axios from 'axios';
import React, { useState, useEffect } from 'react';

import { paths } from 'src/routes/paths';

import { statusData } from 'src/_mock/_status';
import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ProductItemSkeleton } from 'src/components/skeleton/product-skeleton';

import { STORAGE_KEY } from 'src/auth/context/jwt';

import { FileManagerView } from '../single-files/view';

export default function SarlPageView({ data, loading }) {
  const renderLoading = <ProductItemSkeleton />;
  const [serviceStatus, setServiceStatus] = useState({
    value: 'loading',
    label: 'Chargement...',
    color: 'default',
  });

  useEffect(() => {
    const fetchServiceStatus = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/status/2`, {
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
        console.error('Erreur lors de la récupération du statut:', error);
        setServiceStatus(statusData[0]);
      }
    };

    fetchServiceStatus();
  }, [data]);
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Constitution d'entreprise SARL"
        links={[
          {
            name: 'Accueil',
            href: paths.dashboard.root,
            icon: <Iconify icon="solar:home-angle-2-bold-duotone" />,
          },
          {
            name: "Constitution d'entreprise SARL",
            href: '#',
          },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
        action={<Label color={serviceStatus.color}>{serviceStatus.label}</Label>} // ✅ Dynamic status
      />

      {loading ? (
        renderLoading
      ) : (
        <FileManagerView files={data} setServiceStatus={setServiceStatus} serviceId={2} />
      )}
    </DashboardContent>
  );
}
