/* eslint-disable import/no-unresolved */
import { useState, useEffect, useCallback, useMemo } from 'react';

import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useAuth } from 'src/hooks/useAuth';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetContacts, useGetConversation, useGetConversations } from 'src/actions/chat';

import { EmptyContent } from 'src/components/empty-content';

import { useMockedUser } from 'src/auth/hooks';

import { Layout } from '../layout';
import { ChatNav } from '../chat-nav';
import { ChatRoom } from '../chat-room';
import { ChatMessageList } from '../chat-message-list';
import { ChatMessageInput } from '../chat-message-input';
import { ChatHeaderDetail } from '../chat-header-detail';
import { ChatHeaderCompose } from '../chat-header-compose';
import { useCollapseNav } from '../hooks/use-collapse-nav';

// ----------------------------------------------------------------------

export function ChatView() {
  const router = useRouter();

  const { user } = useMockedUser();
  const { userData } = useAuth();

  // Add check for userData
  useEffect(() => {
    if (!userData?.id) {
      router.push(paths.auth.login);
    }
  }, [userData, router]);

  const { contacts } = useGetContacts(userData?.id || null);

  const searchParams = useSearchParams();
  const selectedConversationId = searchParams.get('id') || '';

  const [recipients, setRecipients] = useState([]);

  const { conversations, conversationsLoading } = useGetConversations(userData?.id || null);

  const { conversation, conversationError, conversationLoading } = useGetConversation(
    selectedConversationId || null
  );

  const roomNav = useCollapseNav();

  const conversationsNav = useCollapseNav();

  const participants = useMemo(
    () => (conversation?.participants && Array.isArray(conversation.participants))
      ? conversation.participants
      : [],
    [conversation]
  );

  const otherParticipant = useMemo(
    () => participants.find((participant) => `${participant?.id}` !== `${userData?.id}`),
    [participants, userData?.id]
  );

  // Only redirect if there's an error or no access, and we have a selected conversation
  useEffect(() => {
    if (
      selectedConversationId &&
      !conversationLoading &&
      conversationError
    ) {
      router.push(paths.dashboard.chat);
    }
  }, [conversationError, router, selectedConversationId, conversationLoading]);

  const handleAddRecipients = useCallback((selected) => {
    

    // Filter recipients based on user role
    const filteredRecipients = selected.filter((recipient) => {
      
      
      // If no user data or roles, don't allow any recipients
      if (!userData?.roles) {

        return false;
      }

      // If no recipient role, don't allow
      if (!recipient?.role) {
        return false;
      }

      let isAllowed = false;
      let canMessage = false;

      switch (userData.roles) {
        case 'comptable':
          isAllowed = recipient.role === 'aide-comptable' || recipient.role === 'entreprise';
          
          return isAllowed;

        case 'aide-comptable':
          if (recipient.role === 'comptable') {
            
            return true;
          }
          if (recipient.role === 'entreprise') {
            canMessage = recipient.aide_comptable_id === userData.id;
            
            return canMessage;
          }

          return false;

        case 'entreprise':
          if (recipient.role === 'comptable') {

            return true;
          }
          if (recipient.role === 'aide-comptable') {
            canMessage = userData.aide_comptable_id === recipient.id;

            return canMessage;
          }

          return false;

        default:

          return false;
      }
    });


    setRecipients(filteredRecipients);
  }, [userData]);

  const isOneToOne = conversation?.type === 'ONE_TO_ONE';

  return (
    <DashboardContent
      maxWidth={false}
      sx={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column' }}
    >
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Chat
      </Typography>

      <Layout
        sx={{
          minHeight: 0,
          flex: '1 1 0',
          borderRadius: 2,
          position: 'relative',
          bgcolor: 'background.paper',
          boxShadow: (theme) => theme.customShadows.card,
        }}
        slots={{
          header: selectedConversationId ? (
            <ChatHeaderDetail
              collapseNav={roomNav}
              participants={isOneToOne ? (otherParticipant ? [otherParticipant] : []) : participants}
              loading={conversationLoading}
            />
          ) : (
            <ChatHeaderCompose 
              contacts={contacts} 
              onAddRecipients={handleAddRecipients}
            />
          ),
          nav: (
            <ChatNav
              contacts={contacts}
              conversations={conversations}
              loading={conversationsLoading}
              selectedConversationId={selectedConversationId}
              collapseNav={conversationsNav}
            />
          ),
          main: (
            <>
              {selectedConversationId && !conversationLoading ? (
                <ChatMessageList
                  messages={conversation?.messages ?? []}
                  participants={participants}
                  loading={conversationLoading}
                />
              ) : (
                <EmptyContent
                  imgUrl={`${CONFIG.assetsDir}/assets/icons/empty/ic-chat-active.svg`}
                  title="Good morning!"
                  description="Write something awesome..."
                />
              )}

              <ChatMessageInput
                recipients={recipients}
                onAddRecipients={handleAddRecipients}
                selectedConversationId={selectedConversationId}
                disabled={false}
              />
            </>
          ),
          details: selectedConversationId && !conversationLoading && (
            <ChatRoom
              collapseNav={roomNav}
              participants={isOneToOne ? (otherParticipant ? [otherParticipant] : []) : participants}
              loading={conversationLoading}
              messages={conversation?.messages ?? []}
            />
          ),
        }}
      />
    </DashboardContent>
  );
}
