import { useTranslation } from 'react-i18next';

import {
  Box,
  Card,
  Table,
  Tooltip,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  IconButton,
  Typography,
  TableContainer,
} from '@mui/material';

// eslint-disable-next-line import/no-unresolved
import { paths } from 'src/routes/paths';
// eslint-disable-next-line import/no-unresolved
import { useRouter } from 'src/routes/hooks';

// eslint-disable-next-line import/no-unresolved
import { statusData } from 'src/_mock/_status';

// eslint-disable-next-line import/no-unresolved
import { Label } from 'src/components/label';
// eslint-disable-next-line import/no-unresolved
import { Iconify } from 'src/components/iconify';
// eslint-disable-next-line import/no-unresolved
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

export function AssignedDemandsTable({ demands = [] }) {
  const { t } = useTranslation();
  const router = useRouter();

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleViewDemand = (demandId) => {
    // Navigate to demand details in the same tab
    router.push(paths.dashboard.viewForm(demandId));
  };

  if (!demands || demands.length === 0) {
    return (
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          {t('assignedDemands')}
        </Typography>
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body2" color="text.secondary">
            {t('noAssignedDemands')}
          </Typography>
        </Box>
      </Card>
    );
  }

  return (
    <Card>
      <Box sx={{ p: 3, pb: 0 }}>
        <Typography variant="h6">{t('assignedDemands')} ({demands.length})</Typography>
      </Box>

      <TableContainer sx={{ overflow: 'unset' }}>
        <Scrollbar>
          <Table sx={{ minWidth: 680 }}>
            <TableHead>
              <TableRow>
                <TableCell>{t('service')}</TableCell>
                <TableCell>{t('company')}</TableCell>
                <TableCell>{t('status')}</TableCell>
                <TableCell>{t('assignedDate')}</TableCell>
                <TableCell align="right">{t('actions')}</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {demands.map((helperForm) => {
                const { form } = helperForm;
                const company = form?.user?.company;
                
                return (
                  <TableRow key={helperForm.id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2" noWrap>
                          {form?.service?.name || '-'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {form?.service?.type || '-'}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2" noWrap>
                          {company?.company_name || form?.user?.name || '-'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {company?.email || form?.user?.email || '-'}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      {(() => {
                        const status = statusData.find((s) => s.value === form?.status) || {
                          label: form?.status || 'pending',
                          color: 'default',
                        };

                        return (
                          <Label variant="soft" color={status.color}>
                            {status.label}
                          </Label>
                        );
                      })()}
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(helperForm.created_at)}
                      </Typography>
                    </TableCell>

                    <TableCell align="right">
                      <Tooltip title={t('viewDetails')} placement="top" arrow>
                        <IconButton
                          color="default"
                          onClick={() => handleViewDemand(form?.id)}
                        >
                          <Iconify icon="solar:eye-bold" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>
    </Card>
  );
}
