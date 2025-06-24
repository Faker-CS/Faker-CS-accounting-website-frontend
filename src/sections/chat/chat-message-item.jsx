/* eslint-disable import/no-unresolved */
import { useMemo } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { useAuth } from 'src/hooks/useAuth';

import { fToNow } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';

import { getMessage } from './utils/get-message';

// ----------------------------------------------------------------------

export function ChatMessageItem({ message, participants, onOpenLightbox }) {
  const { userData } = useAuth();

  // Find the sender in participants or fallback to message.sender
  const sender = participants.find((p) => p.id === message.sender_id) || message.sender || {};
  const isMe = message.sender_id === userData?.id;

  const { firstName, avatarUrl } = sender;

  const { body, createdAt } = message;

  const renderInfo = (
    <Typography
      noWrap
      variant="caption"
      sx={{ mb: 1, color: 'text.disabled', ...(!isMe && { mr: 'auto' }) }}
    >
      {isMe ? 'You' : firstName || 'Unknown'}, {createdAt ? fToNow(createdAt) : fToNow(message.created_at)}
    </Typography>
  );

  const renderBody = (
    <Stack
      sx={{
        p: 1.5,
        minWidth: 48,
        maxWidth: 320,
        borderRadius: 1,
        typography: 'body2',
        bgcolor: isMe ? 'primary.lighter' : 'background.neutral',
        color: isMe ? 'grey.800' : 'inherit',
      }}
    >
      {body}
    </Stack>
  );

  const renderActions = (
    <Stack
      direction="row"
      className="message-actions"
      sx={{
        pt: 0.5,
        left: 0,
        opacity: 0,
        top: '100%',
        position: 'absolute',
        transition: (theme) =>
          theme.transitions.create(['opacity'], {
            duration: theme.transitions.duration.shorter,
          }),
        ...(isMe && { right: 0, left: 'unset' }),
      }}
    >
      <IconButton size="small">
        <Iconify icon="solar:reply-bold" width={16} />
      </IconButton>

      <IconButton size="small">
        <Iconify icon="eva:smiling-face-fill" width={16} />
      </IconButton>

      <IconButton size="small">
        <Iconify icon="solar:trash-bin-trash-bold" width={16} />
      </IconButton>
    </Stack>
  );

  const renderAttachment = () => {
    if (!message.attachment_path) return null;

    if (message.attachment_type?.startsWith('image/')) {
      return (
        <Box
          component="img"
          alt="attachment"
          src={message.attachment_path}
          onClick={() => onOpenLightbox(message.attachment_path)}
          sx={{
            minHeight: 200,
            minWidth: 200,
            maxHeight: 400,
            maxWidth: 400,
            borderRadius: 1,
            cursor: 'pointer',
          }}
        />
      );
    }

    if (message.attachment_type?.startsWith('application/pdf')) {
      return (
        <Link
          href={message.attachment_path}
          target="_blank"
          rel="noopener"
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <Iconify icon="mdi:file-pdf-box" width={24} />
          <Typography variant="body2">View PDF</Typography>
        </Link>
      );
    }

    if (message.attachment_type?.includes('word') || message.attachment_type?.includes('excel')) {
      return (
        <Link
          href={message.attachment_path}
          target="_blank"
          rel="noopener"
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <Iconify 
            icon={message.attachment_type?.includes('word') ? 'mdi:file-word' : 'mdi:file-excel'} 
            width={24} 
          />
          <Typography variant="body2">View Document</Typography>
        </Link>
      );
    }

    return (
      <Link
        href={message.attachment_path}
        target="_blank"
        rel="noopener"
        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
      >
        <Iconify icon="mdi:file" width={24} />
        <Typography variant="body2">Download File</Typography>
      </Link>
    );
  };

  if (!message.body) {
    return null;
  }

  return (
    <Stack direction="row" justifyContent={isMe ? 'flex-end' : 'flex-start'} sx={{ mb: 5 }}>
      {!isMe && (
        <Avatar
          alt={sender.name || 'Unknown'}
          src={sender.avatarUrl || sender.avatar_url || sender.photo || null}
          sx={{ width: 32, height: 32, mr: 2 }}
        />
      )}

      <Stack alignItems={isMe ? 'flex-end' : 'flex-start'}>
        {renderInfo}

        <Stack
          direction="row"
          alignItems="center"
          sx={{
            position: 'relative',
            '&:hover': { '& .message-actions': { opacity: 1 } },
          }}
        >
          {renderBody}
          {renderActions}
        </Stack>
      </Stack>
    </Stack>
  );
}
