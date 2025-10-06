import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import '../../css/DatePicker.css';

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  language?: string;
}

export default function DatePicker({ value, onChange, placeholder, className = '', language = 'tr' }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const pickerRef = useRef<HTMLDivElement>(null);

  const selectedDate = value ? new Date(value + 'T00:00:00') : null;

  const translations = {
    tr: {
      monthNames: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
      dayNames: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']
    },
    en: {
      monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      dayNames: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    es: {
      monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      dayNames: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
    }
  };

  const t = translations[language as keyof typeof translations] || translations.tr;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const pad2 = (n: number) => String(n).padStart(2, '0');
  const formatDate = (d: Date) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
  
  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay();
    
    return { daysInMonth, startDay, year, month };
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    onChange(formatDate(newDate));
    setIsOpen(false);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const { daysInMonth, startDay, year, month } = getDaysInMonth(currentMonth);
  const monthNames = t.monthNames;
  const dayNames = t.dayNames;

  const adjustedStartDay = startDay === 0 ? 6 : startDay - 1;
  const totalCells = Math.ceil((daysInMonth + adjustedStartDay) / 7) * 7;

  return (
    <div ref={pickerRef} className={`datepicker-container ${className}`}>
      <div 
        className="input datepicker-input"
        onClick={() => {
          console.log('DatePicker clicked, isOpen:', isOpen);
          setIsOpen(!isOpen);
        }}
      >
        <span className={`datepicker-input-text ${value ? '' : 'placeholder'}`}>
          {value ? formatDisplayDate(value) : placeholder}
        </span>
        <Calendar size={18} className="datepicker-input-icon" />
      </div>

      {isOpen && (
        <div className="datepicker-dropdown" onClick={(e) => e.stopPropagation()}>
          <div className="datepicker-header">
            <button onClick={handlePrevMonth} className="datepicker-nav-button">
              <ChevronLeft size={20} />
            </button>
            <span className="datepicker-month-year">
              {monthNames[month]} {year}
            </span>
            <button onClick={handleNextMonth} className="datepicker-nav-button">
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="datepicker-weekdays">
            {dayNames.map(day => (
              <div key={day} className="datepicker-weekday">
                {day}
              </div>
            ))}
          </div>

          <div className="datepicker-days">
            {Array.from({ length: totalCells }, (_, i) => {
              const dayNum = i - adjustedStartDay + 1;
              const isValidDay = dayNum > 0 && dayNum <= daysInMonth;
              const isSelected = selectedDate && 
                selectedDate.getDate() === dayNum && 
                selectedDate.getMonth() === month && 
                selectedDate.getFullYear() === year;
              const isToday = new Date().getDate() === dayNum && 
                new Date().getMonth() === month && 
                new Date().getFullYear() === year;

              return (
                <button
                  key={i}
                  onClick={() => isValidDay && handleDateClick(dayNum)}
                  disabled={!isValidDay}
                  className={`datepicker-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                >
                  {isValidDay ? dayNum : ''}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}