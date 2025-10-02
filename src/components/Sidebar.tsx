import Calendar from "./ui/Calendar";
import { Plus } from "lucide-react";
import '../css/sidebar.css';
import { usePreferences } from '../context/PreferencesContext';

interface SidebarProps {
    currentMonth: number;
    currentYear: number;
    selectedDay: number;
    setCurrentMonth: (m: number) => void;
    setCurrentYear: (y: number) => void;
    setSelectedDay: (d: number) => void;
}

export default function Sidebar ({ currentMonth, currentYear, selectedDay, setCurrentMonth, setCurrentYear, setSelectedDay }: SidebarProps){
    const { isSidebarOpen } = usePreferences();
    
    return (
        <div className={`sidebar-container ${!isSidebarOpen ? 'hidden' : ''}`}>
          <div className="sidebar-button-container">
            <Plus className="icon"/> 
            <a className="text">Oluştur</a>
          </div>
          <Calendar
            currentMonth={currentMonth}
            currentYear={currentYear}
            selectedDay={selectedDay}
            setCurrentMonth={setCurrentMonth}
            setCurrentYear={setCurrentYear}
            setSelectedDay={setSelectedDay}
          />
        </div>
    );
}