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

import { FileManagerView } from '../../file-manager/view';

export default function DepotView({ data, loading }) {
  const renderLoading = <ProductItemSkeleton />;

  const [serviceStatus, setServiceStatus] = useState({
    value: 'loading',
    label: 'Chargement...',
    color: 'default',
  });

  useEffect(() => {
    const fetchServiceStatus = async () => {
      try {
        const response = await axios.get(`https://as-compta.ckcom.fr/api/status/4`, {
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
        heading="Déclaration d'impôt"
        links={[
          {
            name: 'Accueil',
            href: paths.dashboard.root,
            icon: <Iconify icon="solar:home-angle-2-bold-duotone" />,
          },
          {
            name: 'Déclaration d’impôt',
            href: '#',
          },
        ]}
        action={<Label color={serviceStatus.color}>{serviceStatus.label}</Label>} // ✅ Dynamic status
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      {loading ? (
        renderLoading
      ) : (
        <FileManagerView
          folders={data}
          setServiceStatus={setServiceStatus}
          status={serviceStatus.value}
        />
      )}
    </DashboardContent>
  );
}