import '../../css/CalendarYear.css';
import { rawEvents } from '../../data/events';

interface CalendarYearProps {
  currentMonth: number;
  currentYear: number;
  selectedDay: number;
  setCurrentMonth: (m: number) => void;
  setCurrentYear: (y: number) => void;
  setSelectedDay: (d: number) => void;
}

function getDaysInMonth(month: number, year: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(month: number, year: number) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

function getMonthGrid(month: number, year: number) {
  const daysInMonth = getDaysInMonth(month, year);
  const firstDay = getFirstDayOfMonth(month, year);
  const daysInPrevMonth = getDaysInMonth(month - 1, year);
  
  const days: Array<{
    date: number;
    month: number;
    year: number;
    isCurrentMonth: boolean;
  }> = [];
  
  for (let i = firstDay - 1; i >= 0; i--) {
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    days.push({
      date: daysInPrevMonth - i,
      month: prevMonth,
      year: prevYear,
      isCurrentMonth: false,
    });
  }
  
  for (let date = 1; date <= daysInMonth; date++) {
    days.push({
      date,
      month,
      year,
      isCurrentMonth: true,
    });
  }

  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;
  let nextDate = 1;
  
  while (days.length < 42) {
    days.push({
      date: nextDate++,
      month: nextMonth,
      year: nextYear,
      isCurrentMonth: false,
    });
  }
  
  return days;
}

export default function CalendarYear({
  currentMonth,
  currentYear,
  selectedDay,
  setCurrentMonth,
  setCurrentYear,
  setSelectedDay,
}: CalendarYearProps) {
  const monthNames = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];
  
  const dayNames = ['P', 'S', 'Ç', 'P', 'C', 'C', 'P'];
  const today = new Date();

  const handleDayClick = (day: { date: number; month: number; year: number }) => {
    setSelectedDay(day.date);
    setCurrentMonth(day.month);
    setCurrentYear(day.year);
  };

  const hasEvents = (date: number, month: number, year: number) => {
    return rawEvents.some(
      (ev) =>
        ev.year === year &&
        ev.month === month + 1 &&
        ev.day === date
    );
  };

  return (
    <div className="calendar-year-main">
      
      <div className="year-months-grid">
        {Array.from({ length: 12 }).map((_, monthIndex) => {
          const days = getMonthGrid(monthIndex, currentYear);
          
          return (
            <div key={monthIndex} className="year-month-card">
              <div className="year-month-header">
                <h3 className="year-month-name">{monthNames[monthIndex]}</h3>
              </div>
              
              <div className="year-mini-calendar">
                <div className="year-weekdays">
                  {dayNames.map((day, i) => (
                    <div key={i} className="year-weekday">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="year-days-grid">
                  {days.map((day, dayIndex) => {
                    const isToday =
                      day.date === today.getDate() &&
                      day.month === today.getMonth() &&
                      day.year === today.getFullYear();

                    const isSelected =
                      day.date === selectedDay &&
                      day.month === currentMonth &&
                      day.year === currentYear;

                    const hasEvent = hasEvents(day.date, day.month, day.year);

                    return (
                      <div
                        key={dayIndex}
                        className={`year-day ${
                          !day.isCurrentMonth ? 'other-month' : ''
                        } ${isToday ? 'today' : ''} ${
                          isSelected ? 'selected' : ''
                        } ${hasEvent ? 'has-event' : ''}`}
                        onClick={() => handleDayClick(day)}
                      >
                        {day.date}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}