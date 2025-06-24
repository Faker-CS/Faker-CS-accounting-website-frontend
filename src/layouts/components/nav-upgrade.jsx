import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { alpha as hexAlpha } from '@mui/material/styles';

// import { paths } from 'src/routes/paths';

import { useAuth } from 'src/hooks/useAuth';

import { bgGradient } from 'src/theme/styles';

import { useMockedUser } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export function NavUpgrade({ sx, ...other }) {
  const { user } = useMockedUser();

  const { userData } = useAuth();

  // return (
  //   <Stack sx={{ px: 2, py: 5, textAlign: 'center', ...sx }} {...other}>
  //     <Stack alignItems="center">
  //       <Box sx={{ position: 'relative' }}>
  //         <Avatar src={`${import.meta.env.VITE_SERVER}/storage/${userData?.photo}`} alt={user?.displayName} sx={{ width: 48, height: 48 }}>
  //           {user?.displayName?.charAt(0).toUpperCase()}
  //         </Avatar>
  //       </Box>

  //       <Stack spacing={0.5} sx={{ mb: 2, mt: 1.5, width: 1 }}>
  //         <Typography
  //           variant="subtitle2"
  //           noWrap
  //           sx={{ color: 'var(--layout-nav-text-primary-color)' }}
  //         >
  //           {/* {userData?.name} */}
  //         </Typography>

  //         <Typography
  //           variant="body2"
  //           noWrap
  //           sx={{ color: 'var(--layout-nav-text-disabled-color)' }}
  //         >
  //           {/* {userData?.email} */}
  //         </Typography>
  //       </Stack>
  //     </Stack>
  //   </Stack>
  // );
}

// ----------------------------------------------------------------------

export function UpgradeBlock({ sx, ...other }) {
  return (
    <Box
      sx={{
        ...bgGradient({
          startColor: (theme) => hexAlpha(theme.palette.warning.main, 0.72),
          endColor: (theme) => hexAlpha(theme.palette.warning.dark, 0.72),
        }),
        borderRadius: 2,
        position: 'relative',
        overflow: 'hidden',
        ...sx,
      }}
      {...other}
    >
      {/* Removed rocket image */}

      <Stack alignItems="flex-start" sx={{ position: 'relative' }}>
        {/* Removed promotional text and button */}
      </Stack>
    </Box>
  );
}
