import "./Topbar.css";
import { Menu } from 'lucide-react';
import calendarLogo from '../assets/calendar_30_2x.png';
import { ChevronLeft } from 'lucide-react';
import { ChevronRight } from 'lucide-react';
import { ChevronDown } from 'lucide-react';

import { useDateContext } from '../context/DateContext';

const monthNames = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];

export default function Topbar() {

  const { currentMonth, currentYear, selectedDay, setCurrentMonth, setCurrentYear, setSelectedDay } = useDateContext();

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
  const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
  const nextMonthYear = currentMonth === 11 ? currentYear + 1 : currentYear;
  const nextMonthName = monthNames[nextMonth];

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
    setSelectedDay(today.getDate());
  }

  return (
    <div className="topbar">
      <div className="left">
        <Menu className="menu" />
        <img src={calendarLogo} className="logo" alt="Vite logo" />
        <span className="left-title">Calendar</span>
        <button className="today-btn" onClick={goToToday}>Bugün</button>
      </div>

      <div className="center">
        <div className="center-left">
          <ChevronLeft className="chevron-left" onClick={prevDay}/>
          <ChevronRight className="chevron-right" onClick={nextDay}/>
          <span className="date">{currentMonthName} - {nextMonthName} {nextMonthYear}</span> 
        </div>
      </div>

      <div className="right">
        <button className="today-btn">Gün <ChevronDown className="chevrondown"/></button>
      </div>
    </div>
  );
}