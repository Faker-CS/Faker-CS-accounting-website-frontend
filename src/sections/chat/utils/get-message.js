export function getMessage({ message, participants, currentUserId }) {
  // Find the sender in participants
  const sender = participants.find((participant) => participant.id === message.senderId);

  // Check if the message is from the current user
  const isMe = message.senderId === currentUserId;

  // Get sender details
  const senderDetails = isMe
    ? { type: 'me', firstName: 'You' }
    : {
        avatarUrl: sender?.avatarUrl,
        firstName: sender?.name?.split(' ')[0] || 'Unknown',
      };

  const hasImage = message.contentType === 'image';

  return {
    hasImage,
    me: isMe,
    senderDetails,
  };
}
