import { useEffect, useRef, useCallback, useMemo } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';

import { useAuth } from '../../hooks/useAuth';
import { fToNow } from '../../utils/format-time';
import { Iconify } from '../../components/iconify';
import { ChatMessageItem } from './chat-message-item';
import { Scrollbar } from '../../components/scrollbar';
import { useMessagesScroll } from './hooks/use-messages-scroll';
import { Lightbox, useLightBox } from '../../components/lightbox';

// ----------------------------------------------------------------------

export function ChatMessageList({ 
  messages = [], 
  participants, 
  loading, 
  loadPreviousPage, 
  isFirstPage,
  onMarkAsRead 
}) {
  const { messagesEndRef } = useMessagesScroll(messages);
  const { userData } = useAuth();

  const scrollRef = useRef(null);

  const slides = messages
    .filter((message) => message.attachment_type?.startsWith('image/'))
    .map((message) => ({ src: message.attachment_path }));

  const lightbox = useLightBox(slides);

  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current.containerEl;

      if (scrollElement) {
        const { scrollTop, scrollHeight, clientHeight } = scrollElement;

        // Mark messages as read when scrolled to bottom
        if (scrollHeight - scrollTop - clientHeight < 50) {
          const unreadMessages = messages.filter(
            (message) => !message.seen && message.sender_id !== userData?.id
          );
          if (unreadMessages.length > 0) {
            onMarkAsRead(unreadMessages.map((msg) => msg.id));
          }
        }

        // Load previous messages when scrolled to top
        if (scrollTop === 0 && !loading && !isFirstPage) {
          loadPreviousPage();
        }
      }
    }
  }, [loading, isFirstPage, loadPreviousPage, messages, userData?.id, onMarkAsRead]);

  useEffect(() => {
    const scrollElement = scrollRef.current?.containerEl;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [handleScroll]);

  // Remove duplicate messages by id
  const uniqueMessages = useMemo(() => {
    const map = new Map();
    messages.forEach(msg => {
      if (!map.has(msg.id)) {
        map.set(msg.id, msg);
      }
    });
    return Array.from(map.values());
  }, [messages]);

  if (loading && isFirstPage) {
    return (
      <Stack sx={{ flex: '1 1 auto', position: 'relative' }}>
        <LinearProgress
          color="inherit"
          sx={{
            top: 0,
            left: 0,
            width: 1,
            height: 2,
            borderRadius: 0,
            position: 'absolute',
          }}
        />
      </Stack>
    );
  }

  if (messages.length === 0) {
    return (
      <Stack
        spacing={3}
        alignItems="center"
        justifyContent="center"
        sx={{ height: 1, p: 3 }}
      >
        <Box
          component="img"
          alt="empty"
          src="/assets/icons/empty/ic_empty_chat.svg"
          sx={{ width: 1, maxWidth: 240 }}
        />

        <Typography variant="h6">No messages yet</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Start a conversation by sending a message
        </Typography>
      </Stack>
    );
  }

  return (
    <>
      {loading && !isFirstPage && (
         <Box sx={{ p: 1, textAlign: 'center' }}>
            <CircularProgress size={20} />
         </Box>
      )}
      <Scrollbar ref={scrollRef} onScroll={handleScroll} sx={{ px: 3, pt: 5, pb: 3, flex: '1 1 auto' }}>
        {uniqueMessages.map((message) => (
          <ChatMessageItem
            key={message.id}
            message={message}
            participants={participants}
            onOpenLightbox={() => {
              if (message.attachment_type?.startsWith('image/')) {
                lightbox.onOpen(message.attachment_path);
              }
            }}
          />
        ))}
        <div ref={messagesEndRef} />
      </Scrollbar>

      <Lightbox
        slides={slides}
        open={lightbox.open}
        close={lightbox.onClose}
        index={lightbox.selected}
      />
    </>
  );
}
