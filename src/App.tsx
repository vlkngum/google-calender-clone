import './style.css'
import Sidebar from './components/Sidebar'
import Topbar from './components/topbar'
import CalenderView from './components/CalenderView'

import { PreferencesProvider } from './context/PreferencesContext'
import { usePreferences } from './context/PreferencesContext'
import { useState } from 'react'

function AppContent() {
  const { isSidebarOpen, calendarType, setCalendarType } = usePreferences();
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth());
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState<number>(today.getDate());

  
  
  return (
    <div className="app-container">
      <Topbar
        currentMonth={currentMonth}
        currentYear={currentYear}
        selectedDay={selectedDay}
        setCurrentMonth={setCurrentMonth}
        setCurrentYear={setCurrentYear}
        setSelectedDay={setSelectedDay}
        calendarType={calendarType}
        setCalendarType={setCalendarType}
      />
      <div className="content">
      <aside className={`sidebar ${!isSidebarOpen ? 'hidden' : ''}`}>
          <Sidebar
            currentMonth={currentMonth}
            currentYear={currentYear}
            selectedDay={selectedDay}
            setCurrentMonth={setCurrentMonth}
            setCurrentYear={setCurrentYear}
            setSelectedDay={setSelectedDay}
          />
        </aside>
        <main className="main">
          <CalenderView  
            currentMonth={currentMonth}
            currentYear={currentYear}
            selectedDay={selectedDay}
            setCurrentMonth={setCurrentMonth}
            setCurrentYear={setCurrentYear}
            setSelectedDay={setSelectedDay}
          />
        </main>
      </div>
    </div>
  );
}

export default function App() { 
  return (
    <PreferencesProvider>
      <AppContent />
    </PreferencesProvider>
  )
}