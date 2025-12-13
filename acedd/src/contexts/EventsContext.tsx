"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Event } from "@/app/(pages)/etkinlikler/constants";
import { logClientError, logClientWarn } from "@/lib/utils/clientLogging";

interface EventsContextType {
  events: Event[];
  loading: boolean;
  error: string | null;
  addEvent: (event: Omit<Event, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  updateEvent: (id: string, event: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  getEventById: (id: string) => Event | undefined;
  refreshEvents: () => Promise<void>;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export function EventsProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch events from API
  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/events');
      if (!response.ok) {
        // Try to get error message from response
        let errorMessage = 'Failed to fetch events';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          // If response is not JSON, use status text
          errorMessage = `${errorMessage} (${response.status}: ${response.statusText})`;
        }
        throw new Error(errorMessage);
      }
      const data = await response.json();
      setEvents(data);
      
      // Update localStorage as cache (optional fallback)
      try {
        localStorage.setItem("acedd-events", JSON.stringify(data));
      } catch (localError) {
        // localStorage might be unavailable (e.g., in private mode)
        logClientWarn("[EventsContext][FETCH]", "Could not save events to localStorage", { error: localError });
      }
    } catch (err) {
      logClientError("[EventsContext][FETCH]", err);
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
      
      // Fallback: Try to load from localStorage if API fails
      try {
        const savedEvents = localStorage.getItem("acedd-events");
        if (savedEvents) {
          const parsedEvents = JSON.parse(savedEvents);
          setEvents(parsedEvents);
          logClientWarn("[EventsContext][INIT]", "Loaded events from localStorage cache (API unavailable)");
        } else {
          setEvents([]);
        }
      } catch (localError) {
        logClientError("[EventsContext][INIT]", localError);
        setEvents([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Component mount olduğunda etkinlikleri yükle
  useEffect(() => {
    fetchEvents();
  }, []);

  const addEvent = async (eventData: Omit<Event, "id" | "createdAt" | "updatedAt">) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error('Failed to create event');
      }

      const newEvent = await response.json();
      setEvents(prev => [newEvent, ...prev]);
      
      // Update localStorage cache
      try {
        const updatedEvents = [newEvent, ...events];
        localStorage.setItem("acedd-events", JSON.stringify(updatedEvents));
      } catch (localError) {
        logClientWarn("[EventsContext][ADD]", "Could not update localStorage", { error: localError });
      }
    } catch (err) {
      logClientError("[EventsContext][ADD]", err);
      setError(err instanceof Error ? err.message : 'Failed to create event');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateEvent = async (id: string, eventData: Partial<Event>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to update event: ${errorData.error || response.statusText}`);
      }

      const updatedEvent = await response.json();
      setEvents(prev => 
        prev.map(event => event.id === id ? updatedEvent : event)
      );
      
      // Update localStorage cache
      try {
        const updatedEvents = events.map(event => event.id === id ? updatedEvent : event);
        localStorage.setItem("acedd-events", JSON.stringify(updatedEvents));
      } catch (localError) {
        logClientWarn("[EventsContext][UPDATE]", "Could not update localStorage", { error: localError });
      }
    } catch (err) {
      logClientError("[EventsContext][UPDATE]", err);
      setError(err instanceof Error ? err.message : 'Failed to update event');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to delete event: ${errorData.error || response.statusText}`);
      }

      setEvents(prev => prev.filter(event => event.id !== id));
      
      // Update localStorage cache
      try {
        const updatedEvents = events.filter(event => event.id !== id);
        localStorage.setItem("acedd-events", JSON.stringify(updatedEvents));
      } catch (localError) {
        logClientWarn("[EventsContext][DELETE]", "Could not update localStorage", { error: localError });
      }
    } catch (err) {
      logClientError("[EventsContext][DELETE]", err);
      setError(err instanceof Error ? err.message : 'Failed to delete event');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getEventById = (id: string) => {
    return events.find(event => event.id === id);
  };

  const refreshEvents = async () => {
    await fetchEvents();
  };

  return (
    <EventsContext.Provider value={{
      events,
      loading,
      error,
      addEvent,
      updateEvent,
      deleteEvent,
      getEventById,
      refreshEvents,
    }}>
      {children}
    </EventsContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventsContext);
  if (context === undefined) {
    throw new Error("useEvents must be used within an EventsProvider");
  }
  return context;
}
