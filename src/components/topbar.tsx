import { useState, useRef, useEffect } from 'react';
import '../css/Topbar.css';
import { Menu, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import calendarLogo from '../assets/calendar_30_2x.png';
import { usePreferences } from '../context/PreferencesContext';
 
const monthNames = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
const viewOptions = ['Gün', 'Hafta', 'Ay', 'Yıl', 'Planlama'];

interface TopbarProps {
  currentMonth: number;
  currentYear: number;
  selectedDay: number;
  setCurrentMonth: (m: number) => void;
  setCurrentYear: (y: number) => void;
  setSelectedDay: (d: number) => void;
  calendarType: number;
  setCalendarType: (v: number) => void;
}

export default function Topbar({ currentMonth, currentYear, selectedDay, setCurrentMonth, setCurrentYear, setSelectedDay, calendarType, setCalendarType }: TopbarProps) {
  const { isSidebarOpen, setIsSidebarOpen } = usePreferences();
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null); 

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const prevDay = () => {
    if (selectedDay === 1) { 
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate();
      
      setCurrentMonth(prevMonth);
      setCurrentYear(prevYear);
      setSelectedDay(daysInPrevMonth);  
    } else {
      setSelectedDay(selectedDay - 1);
    }
  }
  
  const nextDay = () => {
    const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    if (selectedDay === daysInCurrentMonth) { 
      const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
      const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
      
      setCurrentMonth(nextMonth);
      setCurrentYear(nextYear);
      setSelectedDay(1);  
    } else {
      setSelectedDay(selectedDay + 1);
    }
  }

  const currentMonthName = monthNames[currentMonth];

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
    setSelectedDay(today.getDate());
  }

  const handleViewChange = (index: number) => {
    setCalendarType(index);
    setIsDropdownOpen(false);
  }

  return (
    <div className="topbar">
      <div className="left">
        <Menu className="icon" size={20} onClick={toggleSidebar} style={{ cursor: 'pointer' }} />
        <img src={calendarLogo} className="logo" alt="Vite logo" />
        <span className="left-title">Takvim</span>
        

        <div className="tb-center">
          <div className="tb-center-left">
            <button className="topbar-btn" onClick={goToToday}>Bugün</button>
            <ChevronLeft className="icon" size={20} onClick={prevDay}/>
            <ChevronRight className="icon" size={20} onClick={nextDay}/>
            <span className="tb-date">{selectedDay} {currentMonthName} {currentYear}</span> 
          </div>
        </div>
      </div>

      

      <div className="right">
        <div className="dropdown-container" ref={dropdownRef}>
          <button 
            className="topbar-btn" 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {viewOptions[calendarType]} <ChevronDown className="chevrondown"/>
          </button>
          
          {isDropdownOpen && (
            <div className="dropdown-menu">
              {viewOptions.map((option, index) => (
                <div
                  key={index}
                  className={`dropdown-item ${calendarType === index ? 'active' : ''}`}
                  onClick={() => handleViewChange(index)}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}