import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface DateContextType {
  currentMonth: number;
  currentYear: number;
  selectedDay: number;
  setCurrentMonth: (month: number) => void;
  setCurrentYear: (year: number) => void;
  setSelectedDay: (day: number) => void;
}

const DateContext = createContext<DateContextType | undefined>(undefined);

export function DateProvider({ children }: { children: ReactNode }) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState(today.getDate());

  return (
    <DateContext.Provider value={{
      currentMonth,
      currentYear,
      selectedDay,
      setCurrentMonth,
      setCurrentYear,
      setSelectedDay
    }}>
      {children}
    </DateContext.Provider>
  );
}

export const useDateContext = () => {
  const context = useContext(DateContext);
  if (!context) {
    throw new Error();
  }
  return context;
};