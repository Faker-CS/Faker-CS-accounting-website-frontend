/* eslint-disable import/no-unresolved */
import {
  Card,
  Chip,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  CardContent,
  TableContainer,
} from '@mui/material';

import { useGetCompanyServices } from 'src/actions/services';

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

export default function CompanyServicesDisplayCard({ companyId }) {
  // Get company's assigned services only
  const { 
    companyServicesData, 
    companyServicesLoading 
  } = useGetCompanyServices(companyId);

  if (companyServicesLoading) {
    return <LoadingScreen />;
  }

  // The companyServicesData contains the company's assigned services with service details
  const assignedServices = companyServicesData || [];

  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Services de l'entreprise
      </Typography>

      {assignedServices.length > 0 && (
        <>
          <Typography variant="subtitle2" sx={{ mb: 2, color: 'success.main' }}>
            Services Actifs ({assignedServices.length})
          </Typography>
          
          <TableContainer sx={{ mb: 3 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Service</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Statut</TableCell>
                  <TableCell>Période</TableCell>
                  <TableCell>Prix</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assignedServices.map((companyService) => (
                  <TableRow key={companyService.id} hover>
                    <TableCell>
                      <Typography variant="subtitle2">{companyService.service.name}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {companyService.service.description || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={companyService.status || 'Actif'}
                        size="small"
                        color="success"
                        variant="filled"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={companyService.frequency || companyService.service.period_type}
                        size="small"
                        color={getFrequencyColor(companyService.frequency || companyService.service.period_type)}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {companyService.service.price ? `${companyService.service.price} TND` : 'Gratuit'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {(!assignedServices || assignedServices.length === 0) && (
        <CardContent>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Aucun service assigné à cette entreprise
          </Typography>
        </CardContent>
      )}
    </Card>
  );
}
