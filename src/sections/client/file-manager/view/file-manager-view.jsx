import axios from 'axios';
import { toast } from 'sonner';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import { DatePicker } from '@mui/x-date-pickers';
import {
  Button,
  Select,
  Divider,
  MenuItem,
  TextField,
  InputLabel,
  Typography,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { usePutRecords } from 'src/actions/user';

import { useTable } from 'src/components/table';
import { EmptyContent } from 'src/components/empty-content';

import { useMockedUser } from 'src/auth/hooks';
import { STORAGE_KEY } from 'src/auth/context/jwt';

import { FileManagerGridView } from '../file-manager-grid-view';

// ----------------------------------------------------------------------

export function FileManagerView({ folders, setServiceStatus, status }) {
  const { user } = useMockedUser();
  const { updateRecords } = usePutRecords();
  const { t } = useTranslation();

  const canEdit = status === 'pending' || status === 'none' || status === 'rejected';

  const [demenagement, setDemenagement] = useState(user.demenagement);
  const [adresse, setAdresse] = useState(user.adresse);
  const [situation, setSituation] = useState(user.situation);

  const table = useTable({ defaultRowsPerPage: 10 });

  const confirm = useBoolean();

  const notFound = !folders.length;

  const SubmitData = async (e) => {
    e.preventDefault();
    toast.promise(updateRecords({ demenagement, adresse, situation }), {
      loading: t('profileUpdating'),
      success: t('profileUpdateSuccess'),
      error: t('profileUpdateError'),
    });
  };

  const SubmitFiles = async (e) => {
    e.preventDefault();

    if (demenagement && adresse && situation) {
      try {
        const response = await axios.post(
          `http://35.171.211.165:8000/api/form/4`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(STORAGE_KEY)}`,
            },
          }
        );

        // Handle the response status
        switch (response.data.status) {
          case 'form_not_found':
            toast.info(t('fillRequiredDocuments'));
            break;
          case 'submitted_for_review':
            toast.success(t('formSubmittedForReview'));
            setServiceStatus({ value: 'review', label: t('pending'), color: 'warning' });
            break;
          case 'form_in_review':
            toast.warning(t('formAlreadyInReview'));
            break;
          case 'form_accepted':
            toast.success(t('formAccepted'));
            setServiceStatus({ value: 'accepted', label: t('accepted'), color: 'success' });
            break;
          default:
            toast.error(t('unexpectedError'));
            break;
        }
      } catch (error) {
        console.error(t('formSendErrorLog'), error);
        toast.error(t('formSendError'));
      }
    } else {
      toast.info(t('completeYourInfo'));
    }
  };

  return (
    <>
      <Typography mb={2} variant="h6">
        {t('generalInformations')}
      </Typography>
      <Grid container spacing={2}>
        <Grid xs={12} md={4}>
          <InputLabel mb={1}>{t('movingDate')}</InputLabel>
          <DatePicker
            sx={{ width: '100%' }}
            value={demenagement}
            onChange={(newValue) => {
              setDemenagement(newValue);
            }}
            disabled={!canEdit}
          />
        </Grid>
        <Grid xs={12} md={4}>
          <InputLabel mb={1}>{t('currentResidence')}</InputLabel>
          <TextField
            fullWidth
            value={adresse}
            onChange={(e) => setAdresse(e.target.value)}
            disabled={!canEdit}
          />
        </Grid>
        <Grid xs={12} md={4}>
          <InputLabel mb={1}>{t('familySituation')}</InputLabel>
          <Select
            fullWidth
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            disabled={!canEdit}
          >
            <MenuItem value="Célébataire">{t('single')}</MenuItem>
          </Select>
        </Grid>
      </Grid>
      {/* <Stack py={2} alignItems="flex-end">
        <Button variant="contained" color="primary" onClick={(e) => SubmitData(e)}>
          Valider
        </Button>
      </Stack> */}
      <Divider sx={{ my: 1, borderStyle: 'dashed' }} />
      <Typography mb={2} variant="h6">
        {t('documentsToProvide')}
      </Typography>
      {notFound ? (
        <EmptyContent filled sx={{ py: 10 }} />
      ) : (
        <FileManagerGridView
          table={table}
          dataFiltered={folders}
          notFound={notFound}
          onOpenConfirm={confirm.onTrue}
          canEdit={canEdit}
        />
      )}
      <Stack my={2} alignItems="flex-start">
        <Button variant="contained" color="primary" onClick={(e) => SubmitFiles(e)}>
          {t('sendMyRequest')}
        </Button>
      </Stack>
    </>
  );
}
