import { useState, useCallback } from 'react';

import Badge from '@mui/material/Badge';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';

// eslint-disable-next-line import/no-unresolved
import { useBoolean } from 'src/hooks/use-boolean';

import { CollapseButton } from './styles';
import { ChatRoomParticipantDialog } from './chat-room-participant-dialog';

// ----------------------------------------------------------------------

export function ChatRoomGroup({ participants }) {
  // Always call hooks first
  const collapse = useBoolean(true);
  const [selected, setSelected] = useState(null);

  const handleOpen = useCallback((participant) => {
    setSelected(participant);
  }, []);

  const handleClose = useCallback(() => {
    setSelected(null);
  }, []);

  if (!participants || participants.length <= 1) {
    // Don't render anything for one-to-one conversations
    return null;
  }

  const totalParticipants = participants.length;

  const renderList = (
    <>
      {participants.map((participant) => (
        <ListItemButton key={participant.id} onClick={() => handleOpen(participant)}>
          <Badge
            variant={participant.status}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Avatar alt={participant.name} src={participant.avatarUrl} />
          </Badge>

          <ListItemText
            sx={{ ml: 2 }}
            primary={participant.name}
            secondary={participant.role}
            primaryTypographyProps={{ noWrap: true, typography: 'subtitle2' }}
            secondaryTypographyProps={{ noWrap: true, component: 'span', typography: 'caption' }}
          />
        </ListItemButton>
      ))}
    </>
  );

  return (
    <>
      <Typography variant="subtitle2" sx={{ px: 2, pt: 2, pb: 1 }}>
        IN ROOM ({participants.length})
      </Typography>
      <Stack spacing={2} sx={{ px: 2, pb: 2 }}>
        {participants.map((participant) => (
          <Stack key={participant.id} direction="row" alignItems="center" spacing={2}>
            <Avatar
              alt={participant.name}
              src={participant.avatarUrl || participant.avatar_url || participant.photo || null}
            />
            <Typography variant="body2">{participant.name}</Typography>
          </Stack>
        ))}
      </Stack>

      <CollapseButton
        selected={collapse.value}
        disabled={!totalParticipants}
        onClick={collapse.onToggle}
      >
        {`In room (${totalParticipants})`}
      </CollapseButton>

      <Collapse in={collapse.value}>{renderList}</Collapse>

      {selected && (
        <ChatRoomParticipantDialog participant={selected} open={!!selected} onClose={handleClose} />
      )}
    </>
  );
}
