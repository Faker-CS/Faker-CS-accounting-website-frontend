import { useState } from 'react';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { Logo } from 'src/components/logo';

import { Main, CompactContent } from './main';
import { LayoutSection } from '../core/layout-section';
import { HeaderSection } from '../core/header-section';
import { SettingsButton } from '../components/settings-button';

// ----------------------------------------------------------------------

export function SimpleLayout({ sx, children, header, content }) {
  const layoutQuery = 'md';
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <LayoutSection
      /** **************************************
       * Header
       *************************************** */
      headerSection={
        <HeaderSection
          layoutQuery={layoutQuery}
          slotProps={{ container: { maxWidth: false } }}
          sx={header?.sx}
          slots={{
            topArea: (
              <Alert severity="info" sx={{ display: 'none', borderRadius: 0 }}>
                This is an info Alert.
              </Alert>
            ),
            leftArea: <Logo />,
            rightArea: (
              <Box display="flex" alignItems="center" gap={{ xs: 1, sm: 1.5 }}>
                {/* -- Help link -- */}
                <Button
                  variant="text"
                  color="inherit"
                  sx={{ typography: 'subtitle2', p: 0, minWidth: 0 }}
                  onClick={() => setHelpOpen(true)}
                >
                  Need help?
                </Button>
                {/* -- Settings button -- */}
                <SettingsButton />
              </Box>
            ),
          }}
        />
      }
      /** **************************************
       * Footer
       *************************************** */
      footerSection={null}
      /** **************************************
       * Style
       *************************************** */
      cssVars={{
        '--layout-simple-content-compact-width': '448px',
      }}
      sx={sx}
    >
      <Main>
        {content?.compact ? (
          <CompactContent layoutQuery={layoutQuery}>{children}</CompactContent>
        ) : (
          children
        )}
      </Main>
      <Dialog open={helpOpen} onClose={() => setHelpOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Need help?</DialogTitle>
        <DialogContent>
          <Box sx={{ py: 2 }}>
            Welcome in MoneyTeers, Accounting website. If you need to apply to work with us, you can send an email to <b>MoneyTeers@exemple.com</b> or by phone <b>+216 20 277 060</b>.
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHelpOpen(false)} variant="outlined" color="inherit">Close</Button>
        </DialogActions>
      </Dialog>
    </LayoutSection>
  );
}
