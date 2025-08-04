// eslint-disable-next-line import/no-extraneous-dependencies
import useSWR, { mutate } from 'swr';
import { useState, useCallback } from 'react';

// import { keyBy } from 'src/utils/helper'; // Check if this utility is actually used or needed
import axios, { fetcher, endpoints } from '../utils/axios'; // Correct relative path if axios is in src/utils

import { STORAGE_KEY } from '../auth/context/jwt'; // Correct relative path if jwt context is in src/auth/context

// ----------------------------------------------------------------------

const enableServer = false;

const CHART_ENDPOINT = endpoints.chat;

const swrOptions = {
  revalidateIfStale: enableServer,
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
};

// ----------------------------------------------------------------------

export function useGetContacts(userId) {
  const { data, error, isLoading } = useSWR(
    userId ? endpoints.chat.contacts(userId) : null,
    fetcher,
    {
      ...swrOptions,
      onError: (err) => {
        console.error('Error fetching contacts:', err);
      },
    }
  );

  return {
    contacts: data?.contacts || [],
    contactsLoading: isLoading,
    contactsError: error,
  };
}

// ----------------------------------------------------------------------

export function useGetConversations(userId) {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [allConversations, setAllConversations] = useState({ allIds: [], byId: {}, meta: null });

  const { data, error, isLoading, isValidating, mutate: mutateConversations } = useSWR(
    userId ? endpoints.chat.conversation(userId) : null,
    fetcher,
    {
      ...swrOptions,
      onSuccess: (newData) => {
        if (!newData || !Array.isArray(newData.allIds) || typeof newData.byId !== 'object') {
          console.warn('Invalid conversations data received:', newData);
          return;
        }
        setAllConversations({
          allIds: newData.allIds,
          byId: newData.byId,
          meta: newData.meta || { last_page: 1 }
        });
      },
      onError: (err) => {
        console.error('Error fetching conversations:', err);
        setAllConversations({ allIds: [], byId: {}, meta: { last_page: 1 } });
      },
    }
  );

  const loadNextPage = useCallback(() => {
    if (allConversations.meta && page < allConversations.meta.last_page) {
      setPage(prevPage => prevPage + 1);
    }
  }, [page, allConversations.meta]);

  return {
    conversations: allConversations,
    conversationsLoading: isLoading || isValidating,
    conversationsError: error,
    loadNextPage,
    isLastPage: allConversations.meta ? page >= allConversations.meta.last_page : true,
  };
}

// ----------------------------------------------------------------------

export function useGetConversation(conversationId) {
  // Add state for pagination
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(50);
  const [allMessages, setAllMessages] = useState([]);
  const [conversationData, setConversationData] = useState(null);
  const [messageMeta, setMessageMeta] = useState(null);

  const { data, error, isLoading, isValidating, mutate: mutateConversation } = useSWR(
    conversationId ? `/api/conversations/${conversationId}?page=${page}&per_page=${perPage}` : null,
    fetcher,
    {
      ...swrOptions,
      onSuccess: (newData) => {
        // Store conversation data (excluding messages for now)
        const { messages: fetchedMessages, messages_meta, ...rest } = newData;
        setConversationData(rest);
        setMessageMeta(messages_meta);

        // Prepend new messages to existing messages for chronological display
        setAllMessages(prevMessages => [...fetchedMessages, ...prevMessages]);
      },
      onError: (err) => {
        console.error('Error fetching conversation:', err);
      },
    }
  );

  // Function to load previous page (older messages)
  const loadPreviousPage = useCallback(() => {
    if (messageMeta && page < messageMeta.last_page) {
      setPage(prevPage => prevPage + 1);
    }
  }, [page, messageMeta]);

  // Return combined data, loading state, and loadPreviousPage function
  return {
    conversation: {
      ...conversationData,
      messages: allMessages,
    },
    conversationLoading: isLoading || isValidating,
    conversationError: error,
    loadPreviousPage,
    isFirstPage: messageMeta ? page <= 1 : true,
  };
}

// ----------------------------------------------------------------------

export async function sendMessage(messageData) {
  try {
    // Send message to backend
    const response = await axios.post(endpoints.chat.sendMessage, messageData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(STORAGE_KEY)}`,
      },
    });


    // Update local state
    const conversationId = messageData.conversation_id;
    const conversationUrl = `/api/conversations/${conversationId}`;
    const conversationsUrl = `/api/conversations`;


  mutate(
    conversationUrl,
    (currentData) => {
        if (!currentData) return currentData;
        return {
          ...currentData,
          messages: [...(currentData.messages || []), response.data.message]
      };
    },
    false
  );

  mutate(
    conversationsUrl,
    (currentData) => {
        if (!currentData) return currentData;
        return {
          ...currentData,
          byId: {
            ...currentData.byId,
            [conversationId]: {
              ...currentData.byId[conversationId],
              messages: [...(currentData.byId[conversationId]?.messages || []), response.data.message]
            }
          }
        };
    },
    false
  );

    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

// ----------------------------------------------------------------------

export async function createConversation(conversationData) {
  const url = CHART_ENDPOINT.createConversation;
  const JWT_TOKEN = localStorage.getItem('jwt_access_token') || null;

  // If multiple recipients, send recipient_ids as array for group chat
  let payload = { ...conversationData };
  if (Array.isArray(conversationData.recipients) && conversationData.recipients.length > 1) {
    payload = {
      ...conversationData,
      recipient_ids: conversationData.recipients.map(r => r.id),
    };
    delete payload.recipient;
  }

  try {
    const res = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(STORAGE_KEY)}`,
      },
    });

    mutate(
      '/api/conversations',
      (currentData) => {
        if (!currentData) return currentData;

        const conversationId = res.data.conversation?.id || res.data.id;
        const existingAllIds = currentData.allIds || [];

        // Prevent adding duplicate IDs
        const newAllIds = existingAllIds.includes(conversationId)
          ? existingAllIds
          : [...existingAllIds, conversationId];

        return {
          ...currentData,
          allIds: newAllIds,
          byId: {
            ...currentData.byId,
            [conversationId]: res.data.conversation || res.data
          }
        };
      },
      false
    );

    return res.data;
  } catch (error) {
    console.error('Error creating conversation:', error);
    throw error;
  }
}

// ----------------------------------------------------------------------

export async function clickConversation(conversationId) {
  /**
   * Work on server
   */
  if (enableServer) {
    await axios.get(CHART_ENDPOINT, { params: { conversationId, endpoint: 'mark-as-seen' } });
  }

  /**
   * Work in local
   */
  mutate(
    '/api/conversations',
    (currentData) => {
      if (!currentData) return currentData;

      return {
        ...currentData,
        byId: {
          ...currentData.byId,
          [conversationId]: {
            ...currentData.byId[conversationId],
            unreadCount: 0
          }
        }
      };
    },
    false
  );
}

export async function uploadAttachment(formData) {
  try {
    const response = await axios.post('/api/chat/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem(STORAGE_KEY)}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error uploading attachment:', error);
    throw error;
  }
}
