import { useState, useRef, useEffect } from 'react';
import '../css/Topbar.css';
import { Menu, ChevronLeft, ChevronRight, ChevronDown, Moon, Sun } from 'lucide-react';
import calendarLogo from '../assets/calendar_30_2x.png';
import { usePreferences } from '../context/PreferencesContext';
 
const langTranslator: Record<string, {
  displayName: string;
  months: string[];
  viewOptions: string[];
  labels: { today: string; calendar: string };
}> = {
  tr: {
    displayName: 'Türkçe',
    months: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
    viewOptions: ['Gün', 'Hafta', 'Ay', 'Yıl', 'Planlama'],
    labels: { today: 'Bugün', calendar: 'Takvim' }
  },
  en: {
    displayName: 'English',
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    viewOptions: ['Day', 'Week', 'Month', 'Year', 'Schedule'],
    labels: { today: 'Today', calendar: 'Calendar' }
  },
  es: {
    displayName: 'Español',
    months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    viewOptions: ['Día', 'Semana', 'Mes', 'Año', 'Agenda'],
    labels: { today: 'Hoy', calendar: 'Calendario' }
  }
};

const locales = Object.keys(langTranslator); 

interface TopbarProps {
  currentMonth: number;
  currentYear: number;
  selectedDay: number;
  setCurrentMonth: (m: number) => void;
  setCurrentYear: (y: number) => void;
  setSelectedDay: (d: number) => void; 
}

export default function Topbar({ currentMonth, currentYear, selectedDay, setCurrentMonth, setCurrentYear, setSelectedDay  }: TopbarProps) {
  const { isSidebarOpen, setIsSidebarOpen } = usePreferences();

  const { calendarType, setCalendarType,language,isDarkMode,setLanguage,setIsDarkMode } = usePreferences();
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const [isDropdownLangOpen, setIsDropdownLangOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null); 
 
const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
}

  useEffect(() => {
    document.body.classList.toggle('dark-theme', isDarkMode === true);
  }, [isDarkMode]);

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

  const currentLocale = locales[language] ?? locales[0];
  const t = langTranslator[currentLocale];
  const monthNames = t.months;
  const viewOptions = t.viewOptions;
  const todayLabel = t.labels.today;
  const calendarLabel = t.labels.calendar;

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

  const handleViewLangChange = (index: number) => {
    setLanguage(index);
    setIsDropdownLangOpen(false);
  }

  return (
    <div className="topbar">
      <div className="left">
        <Menu className="icon" size={20} onClick={toggleSidebar} style={{ cursor: 'pointer' }} />
        <img src={calendarLogo} className="logo" alt="Vite logo" />
        <span className="left-title">{calendarLabel}</span>
        

        <div className="tb-center">
          <div className="tb-center-left">
            <button className="topbar-btn" onClick={goToToday}>{todayLabel}</button>
            <ChevronLeft className="icon" size={20} onClick={prevDay}/>
            <ChevronRight className="icon" size={20} onClick={nextDay}/>
            <span className="tb-date">{selectedDay} {currentMonthName} {currentYear}</span> 
          </div>
        </div>
      </div>

       

      <div className="right">
        {isDarkMode === false ? (
          <Sun className="icon" onClick={toggleTheme} style={{ cursor: 'pointer' }} />
        ) : (
          <Moon className="icon" onClick={toggleTheme} style={{ cursor: 'pointer' }} />
        )}
        <div className="dropdown-container" ref={dropdownRef}>
          <button 
            className="topbar-btn" 
            onClick={() => setIsDropdownLangOpen(!isDropdownLangOpen)}
          >
            {langTranslator[currentLocale].displayName} <ChevronDown className="chevrondown"/>
          </button>
          
          {isDropdownLangOpen && (
            <div className="dropdown-menu">
              {locales.map((loc, index) => (
                <div
                  key={index}
                  className={`dropdown-item ${language === index ? 'active' : ''}`}
                  onClick={() => handleViewLangChange(index)}
                >
                  {langTranslator[loc].displayName}
                </div>
              ))}
            </div>
          )}
        </div>

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