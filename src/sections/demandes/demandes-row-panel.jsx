import React from 'react';

import { Box, Stack, IconButton, Typography } from '@mui/material';

import { Iconify } from 'src/components/iconify';

export function DemandesRowPanel({
  sx,
  link,
  title,
  filesNumber,
  onOpen,
  subtitle,
  collapse,
  onCollapse,
  ...other
}) {
  return (
    <Stack direction="row" alignItems="center" sx={{ mb: 3, ...sx }} {...other}>
      <Stack flexGrow={1}>
        <Stack direction="row" alignItems="center" spacing={1} flexGrow={1}>
          <Typography variant="h6"> {title} </Typography>
          <Typography variant="subtitle"> ({filesNumber}) </Typography>
        </Stack>

        <Box sx={{ typography: 'body2', color: 'text.disabled', mt: 0.5 }}>{subtitle}</Box>
      </Stack>

      {onCollapse && (
        <IconButton onClick={onCollapse}>
          <Iconify icon={collapse ? 'eva:arrow-ios-downward-fill' : 'eva:arrow-ios-upward-fill'} />
        </IconButton>
      )}
    </Stack>
  );
}