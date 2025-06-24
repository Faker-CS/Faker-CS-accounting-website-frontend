import { useState, useEffect, useCallback } from 'react';
import { useAuth } from 'src/hooks/useAuth';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import axios from 'axios';

// Constants
const API_URL = 'http://35.171.211.165:8000/api';
const STORAGE_KEY = 'jwt_access_token';

// Styles
const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    backgroundColor: '#f5f5f5',
  },
  sidebar: {
    width: '320px',
    backgroundColor: '#ffffff',
    borderRight: '1px solid #e0e0e0',
    display: 'flex',
    flexDirection: 'column',
  },
  sidebarHeader: {
    padding: '20px',
    borderBottom: '1px solid #e0e0e0',
  },
  searchInput: {
    width: '100%',
    padding: '10px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    marginBottom: '10px',
  },
  conversationList: {
    flex: 1,
    overflowY: 'auto',
  },
  conversationItem: {
    padding: '15px 20px',
    borderBottom: '1px solid #e0e0e0',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    transition: 'background-color 0.2s',
    '&:hover': {
      backgroundColor: '#f5f5f5',
    },
  },
  conversationItemActive: {
    backgroundColor: '#e3f2fd',
  },
  avatar: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  conversationInfo: {
    flex: 1,
  },
  conversationName: {
    fontSize: '16px',
    fontWeight: '500',
    marginBottom: '4px',
  },
  lastMessage: {
    fontSize: '14px',
    color: '#666',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#ffffff',
  },
  chatHeader: {
    padding: '20px',
    borderBottom: '1px solid #e0e0e0',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  messageList: {
    flex: 1,
    padding: '20px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  message: {
    maxWidth: '70%',
    padding: '12px 16px',
    borderRadius: '12px',
    fontSize: '14px',
    lineHeight: '1.4',
  },
  messageSent: {
    alignSelf: 'flex-end',
    backgroundColor: '#e3f2fd',
    color: '#1976d2',
  },
  messageReceived: {
    alignSelf: 'flex-start',
    backgroundColor: '#f5f5f5',
    color: '#333',
  },
  messageInput: {
    padding: '20px',
    borderTop: '1px solid #e0e0e0',
    display: 'flex',
    gap: '12px',
  },
  input: {
    flex: 1,
    padding: '12px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '14px',
    '&:focus': {
      outline: 'none',
      borderColor: '#1976d2',
    },
  },
  sendButton: {
    padding: '12px 24px',
    backgroundColor: '#1976d2',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    '&:hover': {
      backgroundColor: '#1565c0',
    },
  },
};

export function ComptableChat() {
  const { userData } = useAuth();
  const router = useRouter();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Axios instance with auth header
  const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem(STORAGE_KEY)}`,
    },
  });

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEY);
    if (!token || !userData?.id) {
      router.push(paths.auth.login);
    }
  }, [userData, router]);

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/conversations', {
        params: {
          page: 1,
          per_page: 20,
        },
      });
      const data = response.data;
      setConversations(data.byId ? Object.values(data.byId) : []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      if (error.response?.status === 401) {
        router.push(paths.auth.login);
      }
    } finally {
      setLoading(false);
    }
  }, [axiosInstance, router]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Fetch messages for selected conversation
  const fetchMessages = useCallback(async (conversationId, pageNum = 1) => {
    if (!conversationId) return;

    try {
      const response = await axiosInstance.get(`/conversations/${conversationId}`, {
        params: {
          page: pageNum,
          per_page: 50,
        },
      });

      const newMessages = response.data.messages || [];
      
      if (pageNum === 1) {
        setMessages(newMessages);
      } else {
        setMessages((prev) => [...newMessages, ...prev]);
      }

      setHasMore(newMessages.length === 50);
    } catch (error) {
      console.error('Error fetching messages:', error);
      if (error.response?.status === 401) {
        router.push(paths.auth.login);
      }
    }
  }, [axiosInstance, router]);

  // Load more messages when scrolling up
  const handleScroll = useCallback((e) => {
    const { scrollTop } = e.target;
    if (scrollTop === 0 && hasMore && !loading) {
      setPage((prev) => prev + 1);
      fetchMessages(selectedConversation.id, page + 1);
    }
  }, [hasMore, loading, selectedConversation, page, fetchMessages]);

  // Handle conversation selection
  const handleSelectConversation = useCallback((conversation) => {
    setSelectedConversation(conversation);
    setPage(1);
    setMessages([]);
    fetchMessages(conversation.id, 1);
  }, [fetchMessages]);

  // Send message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const response = await axiosInstance.post(
        `/conversations/${selectedConversation.id}/messages`,
        {
          body: newMessage,
        }
      );

      setMessages((prev) => [...prev, response.data]);
      setNewMessage('');
      
      // Refresh conversations to update last message
      fetchConversations();
    } catch (error) {
      console.error('Error sending message:', error);
      if (error.response?.status === 401) {
        router.push(paths.auth.login);
      }
    }
  };

  const getOtherParticipant = (conversation) => {
    return conversation.participants.find((p) => p.id !== userData?.id);
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <input
            type="text"
            placeholder="Search conversations..."
            style={styles.searchInput}
          />
        </div>
        <div style={styles.conversationList}>
          {conversations.map((conversation) => {
            const otherParticipant = getOtherParticipant(conversation);
            return (
              <div
                key={conversation.id}
                style={{
                  ...styles.conversationItem,
                  ...(selectedConversation?.id === conversation.id && styles.conversationItemActive),
                }}
                onClick={() => handleSelectConversation(conversation)}
              >
                <img
                  src={`${import.meta.env.VITE_SERVER}/storage/${otherParticipant?.photo}`|| otherParticipant?.avatarUrl}
                  alt={otherParticipant?.name}
                  style={styles.avatar}
                />
                <div style={styles.conversationInfo}>
                  <div style={styles.conversationName}>{otherParticipant?.name}</div>
                  <div style={styles.lastMessage}>
                    {conversation.messages[0]?.body || 'No messages yet'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {selectedConversation ? (
          <>
            <div style={styles.chatHeader}>
              <img
                src={getOtherParticipant(selectedConversation)?.photo}
                alt={getOtherParticipant(selectedConversation)?.name}
                style={styles.avatar}
              />
              <div>
                <div style={styles.conversationName}>
                  {getOtherParticipant(selectedConversation)?.name}
                </div>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  {getOtherParticipant(selectedConversation)?.status || 'offline'}
                </div>
              </div>
            </div>

            <div 
              style={styles.messageList}
              onScroll={handleScroll}
            >
              {loading && <div style={{ textAlign: 'center', padding: '10px' }}>Loading...</div>}
              {messages.map((message) => (
                <div
                  key={message.id}
                  style={{
                    ...styles.message,
                    ...(message.sender_id === userData?.id
                      ? styles.messageSent
                      : styles.messageReceived),
                  }}
                >
                  {message.body}
                </div>
              ))}
            </div>

            <div style={styles.messageInput}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                style={styles.input}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button onClick={handleSendMessage} style={styles.sendButton}>
                Send
              </button>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <p style={{ color: '#666' }}>Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
} 