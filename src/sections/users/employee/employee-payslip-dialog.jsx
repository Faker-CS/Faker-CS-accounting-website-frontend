import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';

import {
  Box,
  Grid,
  Alert,
  Stack,
  Button,
  Dialog,
  TextField,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
  CircularProgress,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

import { PayslipPDF } from './PayslipPDF';

// Sample payslip data structure matching French payroll format
const generateSamplePayslip = (employee) => {
  const baseSalary = employee.salary || 800;
  const primePerformance = 800;
  const cnssRate = 0.0446; // 4.46%
  const amoRate = 0.0226; // 2.26%
  const irRate = 0.10; // 10%
  
  const cnssAmount = baseSalary * cnssRate;
  const amoAmount = baseSalary * amoRate;
  const irAmount = (baseSalary + primePerformance - cnssAmount - amoAmount) * irRate;
  
  return {
    employee: {
      id: employee.id || '01',
      firstName: employee.first_name || 'Omar',
      lastName: employee.last_name || 'Nasraoui',
      status: employee.status === 'working' ? 'Actif' : 'Inactif',
      department: employee.department || 'Direction Financière',
      children: employee.children || 0,
    },
    editionDate: new Date(),
    month: new Date().toLocaleString('fr-FR', { month: 'long' }),
    year: new Date().getFullYear(),
    baseSalary,
    rows: [
      { 
        code: '100', 
        label: 'Salaire de base', 
        number: '26.00', 
        gain: baseSalary, 
        retenue: 0 
      },
      { 
        code: '200', 
        label: 'Salaire Brut', 
        number: '0.00', 
        gain: primePerformance, 
        retenue: 0 
      },
      { 
        code: '210', 
        label: 'C.N.S.S', 
        number: '0.00', 
        gain: 0, 
        retenue: cnssAmount 
      },
      { 
        code: '240', 
        label: 'Salaire Imposable', 
        number: '0.00', 
        gain: 728.500, 
        retenue: 0 
      },
      { 
        code: '250', 
        label: 'Impôts', 
        number: '0.00', 
        gain: 0, 
        retenue: 61.685 
      },
      { 
        code: '400', 
        label: 'Net à payer avant déduction', 
        number: '0.00', 
        gain: 664.875, 
        retenue: 0 
      },
      { 
        code: '470', 
        label: 'Net à payer net avances', 
        number: '0.00', 
        gain: 664.875, 
        retenue: 0 
      },
      { 
        code: '500', 
        label: 'Net à Payer', 
        number: '0.00', 
        gain: 664.875, 
        retenue: 0 
      },
    ],
    netToPay: 664.875,
    paymentMode: 'Espèces',
    leaves: {
      droit: 22,
      pris: 0,
      solde: 22,
    },
  };
};

export function EmployeePayslipDialog({ open, onClose, employee }) {
  const { t } = useTranslation();
  const [payslipData, setPayslipData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('form'); // 'form' or 'preview'

  // Initialize payslip data when dialog opens
  useEffect(() => {
    if (open && employee) {
      setPayslipData(generateSamplePayslip(employee));
    }
  }, [open, employee]);

  const handleGeneratePayslip = () => {
    setLoading(true);
    // Simulate API call or processing
    setTimeout(() => {
      setPayslipData(generateSamplePayslip(employee));
      setViewMode('preview');
      setLoading(false);
    }, 1000);
  };

  const handleFieldChange = (field, value) => {
    setPayslipData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRowChange = (index, field, value) => {
    setPayslipData(prev => ({
      ...prev,
      rows: prev.rows.map((row, i) => 
        i === index ? { ...row, [field]: value } : row
      )
    }));
  };

  const calculateNetToPay = () => {
    if (!payslipData) return 0;
    const totalGains = payslipData.rows.reduce((sum, row) => sum + (row.gain || 0), 0);
    const totalRetenues = payslipData.rows.reduce((sum, row) => sum + (row.retenue || 0), 0);
    return totalGains - totalRetenues;
  };

  if (!employee) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      PaperProps={{
        style: { height: '90vh' }
      }}
    >
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="solar:folder-bold" />
          <Typography variant="h6">
            {t('paymentCard')} - {employee.first_name} {employee.last_name}
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent>
        {viewMode === 'form' && (
          <Stack spacing={3}>
            <Alert severity="info">
              {t('Configure the payslip details below and generate the PDF')}
            </Alert>

            {payslipData && (
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t('month')}
                    value={payslipData.month}
                    onChange={(e) => handleFieldChange('month', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t('year')}
                    type="number"
                    value={payslipData.year}
                    onChange={(e) => handleFieldChange('year', parseInt(e.target.value, 10))}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t('Base Salary')}
                    type="number"
                    value={payslipData.baseSalary}
                    onChange={(e) => handleFieldChange('baseSalary', parseFloat(e.target.value))}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t('Payment Mode')}
                    value={payslipData.paymentMode}
                    onChange={(e) => handleFieldChange('paymentMode', e.target.value)}
                  />
                </Grid>
              </Grid>
            )}

            <Box display="flex" justifyContent="center" mt={3}>
              <Button
                variant="contained"
                size="large"
                onClick={handleGeneratePayslip}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <Iconify icon="solar:file-text-bold" />}
              >
                {loading ? t('Generating...') : t('Generate Payslip')}
              </Button>
            </Box>
          </Stack>
        )}

        {viewMode === 'preview' && payslipData && (
          <Box sx={{ height: '60vh', border: '1px solid #ddd', borderRadius: 1 }}>
            <PDFViewer width="100%" height="100%">
              <PayslipPDF payslip={payslipData} />
            </PDFViewer>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        {viewMode === 'preview' && payslipData && (
          <>
            <Button
              variant="outlined"
              onClick={() => setViewMode('form')}
              startIcon={<Iconify icon="solar:square-double-alt-arrow-left-bold-duotone" />}
              sx={{ mr: 2 }}
            >
              {t('back')}
            </Button>
            <PDFDownloadLink
              document={<PayslipPDF payslip={payslipData} />}
              fileName={`payslip-${employee.first_name}-${employee.last_name}-${payslipData.month}-${payslipData.year}.pdf`}
            >
              {({ loading: downloadLoading }) => (
                <Button
                  variant="contained"
                  disabled={downloadLoading}
                  startIcon={<Iconify icon="solar:archive-down-minimlistic-bold-duotone" />}
                  sx={{ mr: 2 }}
                >
                  {downloadLoading ? t('Preparing...') : t('Download PDF')}
                </Button>
              )}
            </PDFDownloadLink>
          </>
        )}
        <Button onClick={onClose}>
          {t('close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
