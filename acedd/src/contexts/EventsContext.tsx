"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Event } from "@/app/(pages)/etkinlikler/constants";

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

  // MongoDB'den etkinlikleri yükle
  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/events');
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      console.error('Error fetching events from MongoDB:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
      // Fallback olarak local storage'dan yükle
      const savedEvents = localStorage.getItem("acedd-events");
      if (savedEvents) {
        try {
          const parsedEvents = JSON.parse(savedEvents);
          setEvents(parsedEvents);
        } catch (localError) {
          console.error("Error loading events from localStorage:", localError);
          setEvents([]);
        }
      } else {
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
      
      // Local storage'a da kaydet (fallback için)
      localStorage.setItem("acedd-events", JSON.stringify([newEvent, ...events]));
    } catch (err) {
      console.error('Error creating event:', err);
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
      
      // Local storage'ı güncelle
      const updatedEvents = events.map(event => event.id === id ? updatedEvent : event);
      localStorage.setItem("acedd-events", JSON.stringify(updatedEvents));
    } catch (err) {
      console.error('Error updating event:', err);
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
      
      // Local storage'dan da sil
      const updatedEvents = events.filter(event => event.id !== id);
      localStorage.setItem("acedd-events", JSON.stringify(updatedEvents));
    } catch (err) {
      console.error('Error deleting event:', err);
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
