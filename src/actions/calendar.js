/* eslint-disable import/no-extraneous-dependencies */
import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import axios, { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

const enableServer = true;

const CALENDAR_ENDPOINT = endpoints.calendar;

const swrOptions = {
  revalidateIfStale: enableServer,
  revalidateOnFocus: enableServer,
  revalidateOnReconnect: enableServer,
};

// ----------------------------------------------------------------------

export function useGetEvents() {
  const { data, isLoading, error, isValidating } = useSWR(CALENDAR_ENDPOINT, fetcher, swrOptions);

  const memoizedValue = useMemo(() => {
    const events = data?.events.map((event) => ({
      ...event,
      textColor: event.color,
    }));

    return {
      events: events || [],
      eventsLoading: isLoading,
      eventsError: error,
      eventsValidating: isValidating,
      eventsEmpty: !isLoading && !data?.events.length,
    };
  }, [data?.events, error, isLoading, isValidating]);

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function createEvent(eventData) {
  /**
   * Work on server
   */

  if (enableServer) {
    try {
      const data = { eventData };
      const response = await axios.post(CALENDAR_ENDPOINT, data);
      await mutate(CALENDAR_ENDPOINT);
      return response.data;
    } catch (error) {
      console.error('Failed to create event:', error);
      throw error;
    }
  }

  /**
   * Work in local
   */
  const result = await mutate(
    CALENDAR_ENDPOINT,
    (currentData) => {
      const currentEvents = currentData?.events || [];
      const events = [...currentEvents, eventData];
      return { ...currentData, events };
    },
    { revalidate: true }
  );

  return result;
}

// ----------------------------------------------------------------------

export async function updateEvent(eventData) {
  /**
   * Work on server
   */
  if (enableServer) {
    try {
      const data = { eventData };
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/calendar/${eventData.id}`,
        eventData
      );
      await mutate(CALENDAR_ENDPOINT);
      return response.data;
    } catch (error) {
      console.error('Failed to update event:', error);
      throw error;
    }
  }

  /**
   * Work in local
   */
  const result = await mutate(
    CALENDAR_ENDPOINT,
    (currentData) => {
      const currentEvents = currentData?.events || [];
      const events = currentEvents.map((event) =>
        event.id === eventData.id ? { ...event, ...eventData } : event
      );
      return { ...currentData, events };
    },
    false
  );

  return result;
}

// ----------------------------------------------------------------------

export async function deleteEvent(eventId) {
  /**
   * Work on server
   */
  if (enableServer) {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/calendar/${eventId}`
      );
      await mutate(CALENDAR_ENDPOINT);
      return response.data;
    } catch (error) {
      console.error('Failed to delete event:', error);
      throw error;
    }
  }

  /**
   * Work in local
   */
  const result = await mutate(
    CALENDAR_ENDPOINT,
    (currentData) => {
      const currentEvents = currentData?.events || [];
      const events = currentEvents.filter((event) => event.id !== eventId);
      return { ...currentData, events };
    },
    false
  );

  return result;
}
