import Calendar from "./ui/Calendar";
import { Plus } from "lucide-react";
import '../css/sidebar.css';
import { usePreferences } from '../context/PreferencesContext';
import { useState } from 'react';
import CreateModal from './modals/CreateModal';
 
const langTralator: Record<string, {
  displayName: string;
  labels: { create: string };
}> = {
  tr: {
    displayName: 'Türkçe',
    labels: { create: 'Oluştur' }
  },
  en: {
    displayName: 'English',
    labels: { create: 'Create' }
  },
  es: {
    displayName: 'Español',
    labels: { create: 'Crear' }
  }
};

const locales: string[] = Object.keys(langTralator);

interface SidebarProps {
    currentMonth: number;
    currentYear: number;
    selectedDay: number;
    setCurrentMonth: (m: number) => void;
    setCurrentYear: (y: number) => void;
    setSelectedDay: (d: number) => void;
}

export default function Sidebar ({ currentMonth, currentYear, selectedDay, setCurrentMonth, setCurrentYear, setSelectedDay }: SidebarProps){
    const { isSidebarOpen, language } = usePreferences();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const currentLocale = locales[language] ?? locales[0];
    const t = langTralator[currentLocale];
    
    return (
        <div className={`sidebar-container ${!isSidebarOpen ? 'hidden' : ''}`}>
          <div className="sidebar-button-container" onClick={() => setIsModalOpen(true)} style={{ cursor: 'pointer' }}>
            <Plus className="icon"/> 
            <a className="text">{t.labels.create}</a>
          </div>
          <Calendar
            currentMonth={currentMonth}
            currentYear={currentYear}
            selectedDay={selectedDay}
            setCurrentMonth={setCurrentMonth}
            setCurrentYear={setCurrentYear}
            setSelectedDay={setSelectedDay}
          />
          <CreateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}