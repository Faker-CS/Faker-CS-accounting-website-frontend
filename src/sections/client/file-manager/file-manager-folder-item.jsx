import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import { Link, Tooltip } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';
import { useTranslation } from 'react-i18next';

import { CONFIG } from 'src/config-global';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function FileManagerFolderItem({ sx, folder, selected, onSelect, canEdit, ...other }) {

  const details = useBoolean();

  const checkbox = useBoolean();

  const { t } = useTranslation();

  const renderIcon = (
    <Box
      sx={{ width: 36, height: 36 }}
    >
      {(checkbox.value || selected) && onSelect ? (
        <Checkbox
          checked={selected}
          onClick={onSelect}
          icon={<Iconify icon="eva:radio-button-off-fill" />}
          checkedIcon={<Iconify icon="eva:checkmark-circle-2-fill" />}
          sx={{ width: 1, height: 1 }}
        />
      ) : (
        <Box
          component="img"
          src={`${CONFIG.assetsDir}/assets/icons/files/ic-folder.svg`}
          sx={{ width: 1, height: 1 }}
        />
      )}
    </Box>
  );
  const renderText = (
    <Tooltip title={folder.name}>
      <ListItemText
        onClick={details.onTrue}
        primary={folder.name}
        secondary={t('fileCount', { count: folder.totalFiles })}
        primaryTypographyProps={{ noWrap: true, typography: 'subtitle1', textOverflow: 'ellipsis', maxWidth: '200px' }}
        secondaryTypographyProps={{
          mt: 0.5,
          component: 'span',
          alignItems: 'center',
          typography: 'caption',
          color: 'text.disabled',
          display: 'inline-flex',
        }}
      />
    </Tooltip>
  );

  return (
    <Link component={RouterLink} href={canEdit && paths.dashboard.companyMenu.declarationImpotDrop(folder.id)} >
        <Paper
          variant="outlined"
          sx={{
            gap: 1,
            p: 2.5,
            maxWidth: 222,
            display: 'flex',
            borderRadius: 2,
            cursor: 'pointer',
            position: 'relative',
            bgcolor: 'transparent',
            flexDirection: 'column',
            alignItems: 'flex-start',
            ...((checkbox.value || selected) && {
              bgcolor: 'background.paper',
              boxShadow: (theme) => theme.customShadows.z20,
            }),
            ...sx,
          }}
          {...other}
        >
          {renderIcon}
          {renderText}
        </Paper>
      </Link>
  );
}