/* eslint-disable import/no-unresolved */
import { useState, useEffect } from 'react';

import {
  Card,
  Chip,
  Table,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  CardContent,
  TableContainer,
} from '@mui/material';

import { useGetServices } from 'src/actions/services';

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

export default function CompanyServicesSelectionCard({ selectedServices = [], onServicesChange }) {
  const { servicesData, servicesLoading } = useGetServices();
  const [localSelectedServices, setLocalSelectedServices] = useState(selectedServices);

  // Initialize with default services when data loads
  useEffect(() => {
    if (servicesData && servicesData.length > 0 && localSelectedServices.length === 0) {
      const defaultServices = servicesData
        .filter(service => service.is_default)
        .map(service => service.id);
      
      setLocalSelectedServices(defaultServices);
      if (onServicesChange) {
        onServicesChange(defaultServices);
      }
    }
  }, [servicesData, localSelectedServices.length, onServicesChange]);

  const handleServiceToggle = (serviceId, isChecked) => {
    let updatedServices;
    
    if (isChecked) {
      updatedServices = [...localSelectedServices, serviceId];
    } else {
      updatedServices = localSelectedServices.filter(id => id !== serviceId);
    }
    
    setLocalSelectedServices(updatedServices);
    if (onServicesChange) {
      onServicesChange(updatedServices);
    }
  };

  if (servicesLoading) {
    return <LoadingScreen />;
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Services pour l'entreprise
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Sélectionnez les services que vous souhaitez activer pour cette entreprise. 
          Les services par défaut sont pré-sélectionnés.
        </Typography>
      </CardContent>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Typography variant="subtitle2">Sélectionné</Typography>
              </TableCell>
              <TableCell>Service</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Période</TableCell>
              <TableCell>Prix</TableCell>
              <TableCell>Par défaut</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {servicesData?.map((service) => {
              const isSelected = localSelectedServices.includes(service.id);
              
              return (
                <TableRow key={service.id} hover>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      onChange={(e) => handleServiceToggle(service.id, e.target.checked)}
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
                  <TableCell>
                    <Chip
                      label={service.is_default ? 'Oui' : 'Non'}
                      size="small"
                      color={service.is_default ? 'success' : 'default'}
                      variant={service.is_default ? 'filled' : 'outlined'}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {(!servicesData || servicesData.length === 0) && (
        <CardContent>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Aucun service disponible
          </Typography>
        </CardContent>
      )}
    </Card>
  );
}
