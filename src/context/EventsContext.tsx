import { createContext, useContext, useMemo, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface CalendarRawEvent {
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
  events: CalendarRawEvent[];
  addEvent: (e: CalendarRawEvent) => void;
}

const EventsContext = createContext<EventsContextValue | undefined>(undefined);

const initialRawEvents: CalendarRawEvent[] = [
  { id: '2', title: 'Toplantı 1', year: 2025, month: 9, day: 2, hour: 0,  endYear: 2025, endMonth: 9, endDay: 2, endHour: 1 },
  { id: '3', title: 'Toplantı 2', year: 2025, month: 9, day: 2, hour: 2, endYear: 2025, endMonth: 9, endDay: 2, endHour: 4 },
  { id: '4', title: 'Toplantı 3', year: 2025, month: 9, day: 2, hour: 5, endYear: 2025, endMonth: 9, endDay: 2, endHour: 6 },
  { id: '5', title: 'Toplantı 4', year: 2025, month: 9, day: 2, hour: 7,  endYear: 2025, endMonth: 9, endDay: 2, endHour: 9 },
  { id: '6', title: 'Toplantı 5', year: 2025, month: 9, day: 2, hour: 10, endYear: 2025, endMonth: 9, endDay: 2, endHour: 11 },
  { id: '7', title: 'Toplantı 6', year: 2025, month: 9, day: 2, hour: 13, endYear: 2025, endMonth: 9, endDay: 2, endHour: 14 },
  { id: '8', title: 'Toplantı 7', year: 2025, month: 9, day: 2, hour: 15, endYear: 2025, endMonth: 9, endDay: 2, endHour: 16 },
  { id: '9', title: 'Toplantı 8', year: 2025, month: 9, day: 2, hour: 22, endYear: 2025, endMonth: 9, endDay: 2, endHour: 23 },
  { id: '10', title: 'Buluşma', year: 2025, month: 9, day: 3, hour: 6, endYear: 2025, endMonth: 9, endDay: 3, endHour: 7 },
  { id: '11', title: 'Yemek', year: 2025, month: 9, day: 3, hour: 14, endYear: 2025, endMonth: 9, endDay: 3, endHour: 15 },
  { id: '12', title: 'Ekip Toplantısı', year: 2025, month: 9, day: 3, hour: 19, endYear: 2025, endMonth: 9, endDay: 3, endHour: 20 },
  { id: '13', title: 'Ekip Toplantısı', year: 2025, month: 10, day: 2, hour: 19, endYear: 2025, endMonth: 10, endDay: 2, endHour: 20 },
  { id: '14', title: 'Toplantı 1', year: 2025, month: 9, day: 4, hour: 2,  endYear: 2025, endMonth: 9, endDay: 4, endHour: 4 },
  { id: '15', title: 'Toplantı 2', year: 2025, month: 9, day: 4, hour: 5,  endYear: 2025, endMonth: 9, endDay: 4, endHour: 6 },
  { id: '16', title: 'Toplantı 3', year: 2025, month: 9, day: 4, hour: 7,  endYear: 2025, endMonth: 9, endDay: 4, endHour: 9 },
  { id: '17', title: 'Toplantı 4', year: 2025, month: 9, day: 4, hour: 10, endYear: 2025, endMonth: 9, endDay: 4, endHour: 11 }, 
  { id: '18', title: 'Toplantı 1', year: 2025, month: 9, day: 5, hour: 2,  endYear: 2025, endMonth: 9, endDay: 5, endHour: 4 }, 
  { id: '19', title: 'Toplantı 1', year: 2025, month: 9, day: 6, hour: 2,  endYear: 2025, endMonth: 9, endDay: 6, endHour: 4 },
  { id: '20', title: 'Toplantı 1', year: 2025, month: 9, day: 7, hour: 2,  endYear: 2025, endMonth: 9, endDay: 7, endHour: 4 },
  { id: '21', title: 'Toplantı 1', year: 2025, month: 10, day: 3, hour: 2,  endYear: 2025, endMonth: 10, endDay: 3, endHour: 4 },
  { id: '22', title: 'Toplantı 1', year: 2025, month: 10, day: 12, hour: 2,  endYear: 2025, endMonth: 10, endDay: 12, endHour: 4 },
];

export function EventsProvider({ children }: { children: ReactNode }) {
  const STORAGE_KEY = 'events';

  const [events, setEvents] = useState<CalendarRawEvent[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CalendarRawEvent[];
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [...initialRawEvents];
  });

  const addEvent = useCallback((e: CalendarRawEvent) => {
    setEvents(prev => [...prev, e]);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    } catch {}
  }, [events]);

  const value = useMemo(() => ({ events, addEvent }), [events]);
  return <EventsContext.Provider value={value}>{children}</EventsContext.Provider>;
}

export function useEvents() {
  const ctx = useContext(EventsContext);
  if (!ctx) throw new Error('useEvents sadece EventsProvider içinde kullanılabilir');
  return ctx;
}


