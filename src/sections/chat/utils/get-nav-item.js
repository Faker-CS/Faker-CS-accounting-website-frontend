export function getNavItem({ currentUserId, conversation }) {
  if (!conversation) {
    return {
      group: false,
      displayName: '',
      displayText: '',
      otherParticipants: [],
      lastActivity: null,
      hasOnlineInGroup: false,
    };
  }

  const { messages = [], participants = [] } = conversation;


  // Filter out the current user from the participants list
  const otherParticipants = participants.filter(
    (participant) => {
      const isCurrentUser = `${participant?.id}` === `${currentUserId}`;
      return !isCurrentUser;
    }
  );

  const lastMessage = messages[messages.length - 1];

  // Determine if it's a group conversation (more than one other participant)
  const isGroup = otherParticipants.length > 1;

  // Determine the display name
  let displayName;
  if (isGroup) {
    // For group chats, show names of other participants
    displayName = otherParticipants.map((participant) => participant?.name || '').join(', ');
  } else if (otherParticipants.length === 1) {
    // For one-to-one chats, show the name of the single recipient
    displayName = otherParticipants[0]?.name || '';
  } else {
    // Fallback if no other participants found (shouldn't happen in valid conversations)
    displayName = '';
  }

  const hasOnlineInGroup = isGroup
    ? otherParticipants.map((item) => item?.status).includes('online')
    : false;

  let displayText = '';

  if (lastMessage) {
    // Ensure message senderId is compared as string if currentUserId is string
    const sender = `${lastMessage.senderId}` === `${currentUserId}` ? 'You: ' : '';

    const messageBody = lastMessage.contentType === 'image' ? 'Sent a photo' : lastMessage.body;

    displayText = `${sender}${messageBody}`;
  }

  return {
    group: isGroup,
    displayName,
    displayText,
    otherParticipants,
    lastActivity: lastMessage?.createdAt,
    hasOnlineInGroup,
  };
}
