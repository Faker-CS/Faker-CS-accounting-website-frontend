/* eslint-disable import/no-unresolved */
import Stack from '@mui/material/Stack';
import ButtonBase from '@mui/material/ButtonBase';

import { varAlpha } from 'src/theme/styles';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function KanbanDetailsPriority({ priority, onChangePriority }) {
  return (
    <Stack direction="row" flexWrap="wrap" spacing={1}>
      {['low', 'medium', 'high'].map((option) => (
        <ButtonBase
          key={option}
          onClick={() => onChangePriority(option)}
          sx={{
            py: 0.5,
            pl: 0.75,
            pr: 1.25,
            fontSize: 12,
            borderRadius: 1,
            lineHeight: '20px',
            textTransform: 'capitalize',
            fontWeight: option === priority ? 'bold' : 'fontWeightBold',
            boxShadow: (theme) =>
              `inset 0 0 0 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.24)}`,
            ...(option === priority && {
              boxShadow: (theme) => `inset 0 0 0 2px ${theme.vars.palette.text.primary}`,
              backgroundColor: (theme) => varAlpha(theme.vars.palette.primary.main, 0.08),
              color: (theme) => theme.vars.palette.primary.main,
            }),
          }}
        >
          <Iconify
            icon={
              (option === 'low' && 'solar:double-alt-arrow-down-bold-duotone') ||
              (option === 'medium' && 'solar:double-alt-arrow-right-bold-duotone') ||
              'solar:double-alt-arrow-up-bold-duotone'
            }
            sx={{
              mr: 0.5,
              ...(option === 'low' && { color: 'info.main' }),
              ...(option === 'medium' && { color: 'warning.main' }),
              ...(option === 'high' && { color: 'error.main' }),
            }}
          />
          {option}
        </ButtonBase>
      ))}
    </Stack>
  );
}
