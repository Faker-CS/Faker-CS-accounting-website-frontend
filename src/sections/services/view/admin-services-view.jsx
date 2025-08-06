/* eslint-disable import/no-unresolved */
import { toast } from 'sonner';
import { useState } from 'react';

import {
  Card,
  Chip,
  Grid,
  Stack,
  Table,
  Button,
  Dialog,
  Switch,
  MenuItem,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  IconButton,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
  TableContainer,
  FormControlLabel,
} from '@mui/material';

import { createService, deleteService, updateService, useGetServices } from 'src/actions/services';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { LoadingScreen } from 'src/components/loading-screen';


// ----------------------------------------------------------------------

export default function AdminServicesView() {
  const { servicesData, servicesLoading, mutateServices } = useGetServices();

  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    period_type: 'mensuelle',
    is_default: false,
    price: '',
    requirements: '',
  });

  const handleOpenDialog = (service = null) => {
    if (service) {
      setSelectedService(service);
      setFormData({
        name: service.name,
        description: service.description || '',
        period_type: service.period_type || 'mensuelle',
        is_default: service.is_default || false,
        price: service.price || '',
        requirements: service.requirements || '',
      });
    } else {
      setSelectedService(null);
      setFormData({
        name: '',
        description: '',
        period_type: 'mensuelle',
        is_default: false,
        price: '',
        requirements: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedService(null);
  };

  const handleSubmit = async () => {
    try {
      const submitData = {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : null,
      };

      let result;
      if (selectedService) {
        result = await updateService(selectedService.id, submitData);
      } else {
        result = await createService(submitData);
      }

      if (result.success) {
        toast.success(
          selectedService ? 'Service mis à jour avec succès' : 'Service créé avec succès'
        );
        mutateServices();
        handleCloseDialog();
      } else {
        toast.error(result.error || 'Une erreur est survenue');
      }
    } catch (error) {
      toast.error('Une erreur est survenue');
    }
  };

  const handleDelete = async () => {
    try {
      const result = await deleteService(selectedService.id);
      if (result.success) {
        toast.success('Service supprimé avec succès');
        mutateServices();
        setOpenDeleteDialog(false);
        setSelectedService(null);
      } else {
        toast.error(result.error || 'Une erreur est survenue');
      }
    } catch (error) {
      toast.error('Une erreur est survenue');
    }
  };

  if (servicesLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Typography variant="h5">Gestion des Services</Typography>
        <Button
          variant="contained"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={() => handleOpenDialog()}
        >
          Nouveau Service
        </Button>
      </Stack>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nom</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Période</TableCell>
                <TableCell>Prix</TableCell>
                <TableCell>Par défaut</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {servicesData.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>
                    <Typography variant="subtitle2">{service.name}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {service.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={service.period_type}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    {service.price ? `${service.price} TND` : '-'}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={service.is_default ? 'Oui' : 'Non'}
                      size="small"
                      color={service.is_default ? 'success' : 'default'}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenDialog(service)}
                    >
                      <Iconify icon="solar:pen-bold" />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => {
                        setSelectedService(service);
                        setOpenDeleteDialog(true);
                      }}
                    >
                      <Iconify icon="solar:trash-bin-trash-bold" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Add/Edit Service Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedService ? 'Modifier le Service' : 'Nouveau Service'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nom du service"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                select
                label="Période"
                value={formData.period_type}
                onChange={(e) => setFormData({ ...formData, period_type: e.target.value })}
              >
                <MenuItem value="mensuelle">Mensuelle</MenuItem>
                <MenuItem value="trimestrielle">Trimestrielle</MenuItem>
                <MenuItem value="annuelle">Annuelle</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label="Prix (TND)"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_default}
                    onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                  />
                }
                label="Service par défaut"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Exigences/Prérequis"
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedService ? 'Modifier' : 'Créer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        title="Supprimer le service"
        content="Êtes-vous sûr de vouloir supprimer ce service ? Cette action est irréversible."
        action={
          <Button variant="contained" color="error" onClick={handleDelete}>
            Supprimer
          </Button>
        }
      />
    </>
  );
} 