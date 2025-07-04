/* eslint-disable import/no-unresolved */
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';

import { varAlpha } from 'src/theme/styles';

import { Iconify } from 'src/components/iconify';
import { SearchNotFound } from 'src/components/search-not-found';

// ----------------------------------------------------------------------

export function ChatHeaderCompose({ contacts = [], onAddRecipients }) {
  const [searchRecipients, setSearchRecipients] = useState('');
  const [selectedRecipients, setSelectedRecipients] = useState([]);

  const handleAddRecipients = useCallback(
    (selected) => {
      setSearchRecipients('');
      setSelectedRecipients(selected);
      onAddRecipients(selected);
    },
    [onAddRecipients]
  );

  // Ensure contacts is always an array and has the required fields
  const contactsArray = Array.isArray(contacts) ? contacts.map(contact => ({
    ...contact,
    avatarUrl: contact.avatarUrl || null,
    role: contact.role || 'no role',
    status: contact.status || 'online',
  })) : [];

  return (
    <>
      <Typography variant="subtitle2" sx={{ color: 'text.primary', mr: 2 }}>
        To:
      </Typography>

      <Autocomplete
        sx={{ minWidth: { md: 320 }, flexGrow: { xs: 1, md: 'unset' } }}
        multiple
        limitTags={3}
        popupIcon={null}
        value={selectedRecipients}
        disableCloseOnSelect
        noOptionsText={<SearchNotFound query={searchRecipients} />}
        onChange={(event, newValue) => handleAddRecipients(newValue)}
        onInputChange={(event, newValue) => setSearchRecipients(newValue)}
        options={contactsArray}
        getOptionLabel={(recipient) => recipient?.name || ''}
        isOptionEqualToValue={(option, value) => option?.id === value?.id}
        renderInput={(params) => <TextField {...params} placeholder="+ Recipients" />}
        renderOption={(props, recipient, { selected }) => {
          const { key, ...otherProps } = props;
          return (
            <li key={key} {...otherProps}>
              <Box
                sx={{
                  mr: 1,
                  width: 32,
                  height: 32,
                  overflow: 'hidden',
                  borderRadius: '50%',
                  position: 'relative',
                }}
              >
                <Avatar 
                  alt={recipient?.name} 
                  src={recipient?.avatarUrl} 
                  sx={{ width: 1, height: 1 }}
                />
                <Stack
                  alignItems="center"
                  justifyContent="center"
                  sx={{
                    top: 0,
                    left: 0,
                    width: 1,
                    height: 1,
                    opacity: 0,
                    position: 'absolute',
                    bgcolor: (theme) => varAlpha(theme.vars.palette.grey['900Channel'], 0.8),
                    transition: (theme) =>
                      theme.transitions.create(['opacity'], {
                        easing: theme.transitions.easing.easeInOut,
                        duration: theme.transitions.duration.shorter,
                      }),
                    ...(selected && { opacity: 1, color: 'primary.main' }),
                  }}
                >
                  <Iconify icon="eva:checkmark-fill" />
                </Stack>
              </Box>

              {recipient?.name}
            </li>
          );
        }}
        renderTags={(selected, getTagProps) =>
          selected.map((recipient, index) => (
            <Chip
              {...getTagProps({ index })}
              key={recipient?.id}
              label={recipient?.name}
              avatar={<Avatar alt={recipient?.name} src={recipient?.avatarUrl} />}
              size="small"
              variant="soft"
            />
          ))
        }
      />
    </>
  );
}
