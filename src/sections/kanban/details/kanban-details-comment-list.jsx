/* eslint-disable import/no-unresolved */
import { formatDistanceToNow } from 'date-fns';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { useAuth } from 'src/hooks/useAuth';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function KanbanDetailsCommentList({ comments = [], onDeleteComment }) {
  const { userData } = useAuth();

  return (
    <Stack spacing={3}>
      {comments.map((comment) => {
        const isOwner = comment.user_id === userData?.id;

        return (
          <Stack key={comment.id} direction="row" spacing={2}>
            <Avatar src={`${import.meta.env.VITE_SERVER}/storage/${comment.user?.photo}`} alt={comment.user?.name}>
              {comment.user?.name?.charAt(0).toUpperCase()}
            </Avatar>

            <Stack flexGrow={1}>
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ typography: 'caption' }}
              >
                <Typography variant="subtitle2">{comment.user?.name}</Typography>

                <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                  {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                </Typography>
              </Stack>

              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {comment.content}
              </Typography>
            </Stack>

            {isOwner && (
              <IconButton
                size="small"
                onClick={() => onDeleteComment(comment.id)}
                sx={{ color: 'text.disabled' }}
              >
                <Iconify icon="solar:trash-bin-trash-bold" />
              </IconButton>
            )}
          </Stack>
        );
      })}
    </Stack>
  );
}
