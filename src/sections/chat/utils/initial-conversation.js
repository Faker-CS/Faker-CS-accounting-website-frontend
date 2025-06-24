/* eslint-disable import/no-unresolved */
import { uuidv4 } from 'src/utils/uuidv4';
import { fSub } from 'src/utils/format-time';

// ----------------------------------------------------------------------

export function initialConversation({ message = '', recipients, me }) {
  const isGroup = recipients.length > 1;

  const messageData = {
    id: uuidv4(),
    attachments: [],
    body: message,
    contentType: 'text',
    createdAt: fSub({ minutes: 1 }),
    senderId: me.id,
  };

  // Create a unique conversation ID
  const conversationId = uuidv4();

  // Ensure we have all participants
  const allParticipants = [...recipients];
  
  // Only add the current user if they're not already in the recipients
  if (!allParticipants.some(participant => participant.id === me.id)) {
    allParticipants.push(me);
  }

  const conversationData = {
    id: conversationId,
    messages: [messageData],
    participants: allParticipants,
    type: isGroup ? 'GROUP' : 'ONE_TO_ONE',
    unreadCount: 0,
  };

  return { messageData, conversationData };
}
