import { createContext, useContext, useMemo, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface Event {
  id: string;
  title: string;
  year: number;
  month: number;
  day: number;
  hour: number;
  endYear: number;
  endMonth: number;
  endDay: number;
  endHour: number;
}

interface EventsContextValue {
  events: Event[];
  addEvent: (e: Event) => void;
  updateEvent: (id: string, updates: Partial<Event>) => void;
  removeEvent: (id: string) => void;
}

const EventsContext = createContext<EventsContextValue | undefined>(undefined);


export function EventsProvider({ children }: { children: ReactNode }) {
  const STORAGE_KEY = 'events';

  const normalize = (list: Event[]): Event[] =>
    list.map(e => ({
      ...e,
      month: e.month > 11 ? e.month - 1 : e.month,
      endMonth: e.endMonth > 11 ? e.endMonth - 1 : e.endMonth,
    }));

  const [events, setEvents] = useState<Event[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Event[];
        if (Array.isArray(parsed)) return normalize(parsed);
      }
    } catch {}
    return [];
  });

  const addEvent = useCallback((e: Event) => {
    setEvents(prev => [...prev, e]);
  }, []);

  const updateEvent = useCallback((id: string, updates: Partial<Event>) => {
    setEvents(prev => prev.map(ev => (ev.id === id ? { ...ev, ...updates } : ev)));
  }, []);

  const removeEvent = useCallback((id: string) => {
    setEvents(prev => prev.filter(ev => ev.id !== id));
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    } catch {}
  }, [events]);

  const value = useMemo(() => ({ events, addEvent, updateEvent, removeEvent }), [events]);
  return <EventsContext.Provider value={value}>{children}</EventsContext.Provider>;
}

export function useEvents() {
  const ctx = useContext(EventsContext);
  if (!ctx) throw new Error('useEvents sadece EventsProvider içinde kullanılabilir');
  return ctx;
}


