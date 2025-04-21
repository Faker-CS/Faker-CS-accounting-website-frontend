import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';

import { DashboardContent } from 'src/layouts/dashboard';
import { _bankingContacts, _bankingCreditCard, _bankingRecentTransitions } from 'src/_mock';

import { BankingContacts } from '../banking-contacts';
import { BankingOverview } from '../banking-overview';
import { BankingQuickTransfer } from '../banking-quick-transfer';
import { BankingCurrentBalance } from '../banking-current-balance';
import { BankingBalanceStatistics } from '../banking-balance-statistics';
import { BankingRecentTransitions } from '../banking-recent-transitions';

// ----------------------------------------------------------------------

export function OverviewBankingView() {
  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3}>
        <Grid xs={12} md={7} lg={8}>
          <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
            <BankingOverview />

            <BankingBalanceStatistics
              title="Balance statistics"
              subheader="Statistics on balance over time"
              chart={{
                series: [
                  {
                    name: 'Weekly',
                    categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
                    data: [
                      { name: 'Income', data: [24, 41, 35, 151, 49] },
                      { name: 'Savings', data: [24, 56, 77, 88, 99] },
                      { name: 'Investment', data: [40, 34, 77, 88, 99] },
                    ],
                  },
                  {
                    name: 'Monthly',
                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
                    data: [
                      { name: 'Income', data: [83, 112, 119, 88, 103, 112, 114, 108, 93] },
                      { name: 'Savings', data: [46, 46, 43, 58, 40, 59, 54, 42, 51] },
                      { name: 'Investment', data: [25, 40, 38, 35, 20, 32, 27, 40, 21] },
                    ],
                  },
                  {
                    name: 'Yearly',
                    categories: ['2018', '2019', '2020', '2021', '2022', '2023'],
                    data: [
                      { name: 'Income', data: [76, 42, 29, 41, 27, 96] },
                      { name: 'Savings', data: [46, 44, 24, 43, 44, 43] },
                      { name: 'Investment', data: [23, 22, 37, 38, 32, 25] },
                    ],
                  },
                ],
              }}
            />

            <BankingRecentTransitions
              title="Recent transitions"
              tableData={_bankingRecentTransitions}
              headLabel={[
                { id: 'description', label: 'Description' },
                { id: 'date', label: 'Date' },
                { id: 'amount', label: 'Amount' },
                { id: 'status', label: 'Status' },
                { id: '' },
              ]}
            />
          </Box>
        </Grid>

        <Grid xs={12} md={5} lg={4}>
          <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
            <BankingCurrentBalance list={_bankingCreditCard} />

            <BankingQuickTransfer title="Quick transfer" list={_bankingContacts} />

            <BankingContacts
              title="Contacts"
              subheader="You have 122 contacts"
              list={_bankingContacts.slice(-5)}
            />
          </Box>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
