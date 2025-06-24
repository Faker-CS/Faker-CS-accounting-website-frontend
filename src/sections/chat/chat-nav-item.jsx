/* eslint-disable import/no-unresolved */
import { useCallback } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import useSWR, { mutate } from 'swr';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import AvatarGroup from '@mui/material/AvatarGroup';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useAuth } from 'src/hooks/useAuth';
import { useResponsive } from 'src/hooks/use-responsive';

import { fToNow } from 'src/utils/format-time';

import { clickConversation } from 'src/actions/chat';

import { getNavItem } from './utils/get-nav-item';

// ----------------------------------------------------------------------

export function ChatNavItem({ selected, collapse, conversation, onCloseMobile }) {
  const { userData } = useAuth();

  const mdUp = useResponsive('up', 'md');

  const router = useRouter();

  const handleClickConversation = useCallback(async () => {
    try {
      if (!mdUp) {
        onCloseMobile();
      }

      // Add check for conversation.id
      if (!conversation?.id) {
        console.error('ChatNavItem: conversation.id is undefined');
        return;
      }

      // First navigate to the conversation
      router.push(`${paths.dashboard.chat}?id=${conversation.id}`);

      // Then trigger the click conversation logic
      await clickConversation(conversation.id);

      // Finally revalidate the conversation data
      mutate(`/api/conversations/${conversation.id}`);

    } catch (error) {
      console.error('Error in handleClickConversation:', error);
    }
  }, [conversation?.id, mdUp, onCloseMobile, router]);

  // Add early return if conversation is not defined
  if (!conversation) {
    console.warn('ChatNavItem: conversation is undefined');
    return null;
  }

  const { group, displayName, displayText, otherParticipants, lastActivity, hasOnlineInGroup } =
    getNavItem({ conversation, currentUserId: userData?.id });

  // Find the single participant for one-to-one chats from otherParticipants
  const singleParticipant = otherParticipants.length === 1 ? otherParticipants[0] : {};

  const { name = '', avatarUrl = '', status = 'offline', roles = '', photo = null } = singleParticipant;

  const renderGroup = (
    <Badge
      variant={hasOnlineInGroup ? 'online' : 'invisible'}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <AvatarGroup variant="compact" sx={{ width: 48, height: 48 }}>
        {/* Use otherParticipants for AvatarGroup */}
        {otherParticipants.slice(0, 2).map((participant) => (
          <Avatar 
            key={participant?.id || 'unknown'} 
            alt={participant?.name || 'Unknown'} 
            src={participant?.photo || participant?.avatarUrl} 
          />
        ))}
      </AvatarGroup>
    </Badge>
  );

  const renderSingle = (
    <Badge key={status} variant={status} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
      <Avatar alt={name} src={photo || avatarUrl} sx={{ width: 48, height: 48 }} />
    </Badge>
  );

  return (
    <Box component="li" sx={{ display: 'flex' }}>
      <ListItemButton
        onClick={handleClickConversation}
        sx={{
          py: 1.5,
          px: 2.5,
          gap: 2,
          ...(selected && { bgcolor: 'action.selected' }),
        }}
      >
        <Badge
          color="error"
          overlap="circular"
          badgeContent={collapse ? conversation.unreadCount : 0}
        >
          {/* Use singleParticipant for renderSingle */}
          {group ? renderGroup : renderSingle}
        </Badge>

        {!collapse && (
          <>
            <ListItemText
              primary={displayName}
              primaryTypographyProps={{ noWrap: true, component: 'span', variant: 'subtitle2' }}
              secondary={displayText}
              secondaryTypographyProps={{
                noWrap: true,
                component: 'span',
                variant: conversation.unreadCount ? 'subtitle2' : 'body2',
                color: conversation.unreadCount ? 'text.primary' : 'text.secondary',
              }}
            />

            <Stack alignItems="flex-end" sx={{ alignSelf: 'stretch' }}>
              <Typography
                noWrap
                variant="body2"
                component="span"
                sx={{ mb: 1.5, fontSize: 12, color: 'text.disabled' }}
              >
                {fToNow(lastActivity)}
              </Typography>

              {conversation.unreadCount > 0 && (
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    bgcolor: 'info.main',
                    borderRadius: '50%',
                  }}
                />
              )}
            </Stack>
          </>
        )}
      </ListItemButton>
    </Box>
  );
}
