/* eslint-disable import/no-unresolved */
import { toast } from 'sonner';
import { useState } from 'react';

import {
  Box,
  Card,
  Chip,
  Stack,
  Table,
  Alert,
  TableRow,
  Checkbox,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  CardContent,
  TableContainer,
} from '@mui/material';

import { useAuth } from 'src/hooks/useAuth';

import { assignServiceToCompany, removeServiceFromCompany, useGetCompanyServicesWithStatus } from 'src/actions/services';

import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

// Helper function to get frequency color
const getFrequencyColor = (frequency) => {
  switch (frequency?.toLowerCase()) {
    case 'mensuelle':
      return 'primary'; // blue
    case 'annuelle':
      return 'secondary'; // purple
    case 'trimestrielle':
      return 'warning'; // orange
    default:
      return 'default';
  }
};

export default function CompanyServicesView() {
  const { userData, loading: authLoading } = useAuth();
  
  const companyId = userData?.company_id;
  
  const { 
    servicesWithStatusData, 
    servicesWithStatusLoading, 
    mutateServicesWithStatus 
  } = useGetCompanyServicesWithStatus(companyId);

  const [processing, setProcessing] = useState(false);

  const handleServiceToggle = async (service, isChecked) => {
    if (processing) return;
    
    setProcessing(true);
    try {
      if (isChecked) {
        // Add service to company
        const result = await assignServiceToCompany(companyId, {
          service_id: service.id,
          frequency: service.period_type,
          declaration_date: '',
          notes: '',
        });
        if (result.success) {
          toast.success(`Service "${service.name}" ajouté avec succès`);
          mutateServicesWithStatus();
        } else {
          toast.error(result.error || 'Une erreur est survenue');
        }
      } else {
        // Remove service from company
        const result = await removeServiceFromCompany(companyId, service.id);
        if (result.success) {
          toast.success(`Service "${service.name}" supprimé avec succès`);
          mutateServicesWithStatus();
        } else {
          toast.error(result.error || 'Une erreur est survenue');
        }
      }
    } catch (error) {
      toast.error('Une erreur est survenue');
    } finally {
      setProcessing(false);
    }
  };

  if (authLoading || servicesWithStatusLoading) {
    return <LoadingScreen />;
  }

  // If no user data available, show loading
  if (!userData) {
    return <LoadingScreen />;
  }

  // If no company ID (e.g., admin user without company), show message
  if (!companyId) {
    return (
      <Stack direction="row" alignItems="center" justifyContent="center" sx={{ p: 5 }}>
        <Alert severity="info" sx={{ maxWidth: 400 }}>
          Aucune entreprise sélectionnée. Les administrateurs doivent sélectionner une entreprise pour voir ses services.
        </Alert>
      </Stack>
    );
  }

  return (
    <>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Typography variant="h5">Mes Services</Typography>
      </Stack>

      <Card>
        <CardContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Cochez les services que vous souhaitez utiliser. Ils seront automatiquement ajoutés à votre entreprise.
          </Typography>
        </CardContent>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Typography variant="subtitle2">Actif</Typography>
                </TableCell>
                <TableCell>Service</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>Période</TableCell>
                <TableCell>Prix</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {servicesWithStatusData?.map((service) => (
                <TableRow key={service.id} hover>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={service.is_assigned}
                      onChange={(e) => handleServiceToggle(service, e.target.checked)}
                      disabled={processing}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">{service.name}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {service.description || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={service.is_assigned ? 'Actif' : 'Inactif'}
                      size="small"
                      color={service.is_assigned ? 'success' : 'default'}
                      variant={service.is_assigned ? 'filled' : 'outlined'}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={service.period_type}
                      size="small"
                      color={getFrequencyColor(service.period_type)}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {service.price ? `${service.price} TND` : 'Gratuit'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {(!servicesWithStatusData || servicesWithStatusData.length === 0) && (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Aucun service disponible
            </Typography>
          </Box>
        )}
      </Card>
    </>
  );
}
