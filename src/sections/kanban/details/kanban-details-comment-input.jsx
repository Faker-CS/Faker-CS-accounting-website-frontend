import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';

import { useAuth } from 'src/hooks/useAuth';

import { Iconify } from 'src/components/iconify';

import { useMockedUser } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export function KanbanDetailsCommentInput({ taskId, onAddComment }) {
  const theme = useTheme();
  const { userData } = useAuth();
  const [message, setMessage] = useState('');
  const { user } = useMockedUser();

  const handleChangeMessage = useCallback((event) => {
    setMessage(event.target.value);
  }, []);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      if (message.trim()) {
        onAddComment({
          content: message.trim(),
          user: userData,
          created_at: new Date().toISOString(),
        });
        setMessage('');
      }
    },
    [message, onAddComment, userData]
  );

  return (
    <Stack
      component="form"
      onSubmit={handleSubmit}
      direction="row"
      alignItems="flex-start"
      spacing={2}
      sx={{ py: 3, px: 2.5 }}
    >
      <Avatar src={`${import.meta.env.VITE_SERVER}/storage/${userData?.photo}`} alt={userData?.name}>
        {userData?.name?.charAt(0).toUpperCase()}
      </Avatar>

      <Paper
        variant="outlined"
        sx={{
          p: 1,
          flexGrow: 1,
          bgcolor: 'transparent',
          position: 'relative',
        }}
      >
        <InputBase
          fullWidth
          multiline
          rows={2}
          placeholder="Type a message"
          value={message}
          onChange={handleChangeMessage}
          sx={{ px: 1, pr: 12, py: 2 }}
        />

        <Box
          sx={{
            position: 'absolute',
            right: 16,
            bottom: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Button
            type="submit"
            variant="contained"
            disabled={!message.trim()}
            sx={{ minWidth: 100, height: 36 }}
          >
            Comment
          </Button>
        </Box>
      </Paper>
    </Stack>
  );
}
