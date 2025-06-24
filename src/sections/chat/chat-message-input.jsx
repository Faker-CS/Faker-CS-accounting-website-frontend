/* eslint-disable import/no-unresolved */
import { mutate } from 'swr';
import { useRef, useMemo, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useAuth } from 'src/hooks/useAuth';

import { today } from 'src/utils/format-time';

import { sendMessage, uploadAttachment, createConversation } from 'src/actions/chat';

import { Iconify } from 'src/components/iconify';

import { useMockedUser } from 'src/auth/hooks';

import { initialConversation } from './utils/initial-conversation';

// ----------------------------------------------------------------------

export function ChatMessageInput({
  disabled,
  recipients,
  onAddRecipients,
  selectedConversationId,
}) {
  const router = useRouter();

  const { user } = useMockedUser();
  const { userData } = useAuth();

  const fileRef = useRef(null);
  const [message, setMessage] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [uploading, setUploading] = useState(false);

  const myContact = useMemo(
    () => ({
      id: `${userData?.id}`,
      role: `${userData?.roles}`,
      email: `${userData?.email}`,
      address: `${userData?.address}`,
      name: `${userData?.name}`,
      lastActivity: today(),
      avatarUrl: `${userData?.photoURL}`,
      phoneNumber: `${userData?.phoneNumber}`,
      status: 'online',
    }),
    [userData]
  );

  const { messageData, conversationData } = initialConversation({
    message,
    recipients,
    me: myContact,
  });

  const handleAttach = useCallback(() => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  }, []);

  const handleFileChange = useCallback(async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await uploadAttachment(formData);
      setAttachment({
        path: response.path,
        type: file.type,
        name: file.name
      });
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
    }
  }, []);

  const handleChangeMessage = useCallback((event) => {
    setMessage(event.target.value);
  }, []);

  const handleSendMessage = useCallback(
    async (event) => {
      if (event.key !== 'Enter' || (!message && !attachment)) {
        return;
      }

      try {
        if (selectedConversationId) {
          const newMessage = {
            body: message,
            conversation_id: selectedConversationId,
            attachment_path: attachment?.path,
            attachment_type: attachment?.type,
          };

          await sendMessage(newMessage);
          setMessage('');
          setAttachment(null);
        } else if (recipients.length > 0) {
          const newConversation = {
            recipient_id: recipients[0].id,
            message,
            attachment_path: attachment?.path,
            attachment_type: attachment?.type,
          };

          const res = await createConversation(newConversation);

          const conversationId = res?.conversation?.id || res?.id;
          if (conversationId) {
            router.push(`${paths.dashboard.chat}?id=${conversationId}`);
            mutate('/api/conversations');
            mutate(`/api/conversations/${conversationId}`);
            onAddRecipients([]);
            setMessage('');
            setAttachment(null);
          }
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    },
    [message, attachment, recipients, onAddRecipients, router, selectedConversationId]
  );

  const handleKeyPress = useCallback((event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSendMessage(event);
    }
  }, [handleSendMessage]);

  const handleRemoveAttachment = useCallback(() => {
    setAttachment(null);
  }, []);

  return (
    <>
      {attachment && (
        <Box sx={{ p: 1, borderTop: (theme) => `solid 1px ${theme.vars.palette.divider}` }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify icon="eva:attach-2-fill" />
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {attachment.name}
            </Typography>
            <IconButton size="small" onClick={handleRemoveAttachment}>
              <Iconify icon="eva:close-fill" />
            </IconButton>
          </Stack>
        </Box>
      )}

      <InputBase
        name="chat-message"
        id="chat-message-input"
        value={message}
        onKeyPress={handleKeyPress}
        onChange={handleChangeMessage}
        placeholder={recipients.length > 0 ? "Type a message" : "Select a recipient to start chatting"}
        disabled={uploading}
        startAdornment={
          <IconButton>
            <Iconify icon="eva:smiling-face-fill" />
          </IconButton>
        }
        endAdornment={
          <Stack direction="row" sx={{ flexShrink: 0 }}>
            <IconButton onClick={handleAttach} disabled={uploading}>
              <Iconify icon="solar:gallery-add-bold" />
            </IconButton>
            <IconButton onClick={handleAttach} disabled={uploading}>
              <Iconify icon="eva:attach-2-fill" />
            </IconButton>
            <IconButton disabled={uploading}>
              <Iconify icon="solar:microphone-bold" />
            </IconButton>
          </Stack>
        }
        sx={{
          px: 1,
          height: 56,
          flexShrink: 0,
          borderTop: (theme) => `solid 1px ${theme.vars.palette.divider}`,
          '& input': {
            height: '100%',
          },
        }}
      />

      <input 
        type="file" 
        ref={fileRef} 
        style={{ display: 'none' }} 
        onChange={handleFileChange}
        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
      />
    </>
  );
}
