import '../../css/CalendarMonthly.css';
import { useEvents } from '../../context/EventsContext';
import { usePreferences } from '../../context/PreferencesContext';

interface CalendarMonthlyProps {
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

function getCalendarGrid(month: number, year: number) {
  const daysInMonth = getDaysInMonth(month, year);
  const firstDay = getFirstDayOfMonth(month, year);
  const daysInPrevMonth = getDaysInMonth(month - 1, year);
  
  const weeks: Array<Array<{
    date: number;
    month: number;
    year: number;
    isCurrentMonth: boolean;
  }>> = [];
  
  let currentWeek: typeof weeks[0] = [];
  
  for (let i = firstDay - 1; i >= 0; i--) {
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    currentWeek.push({
      date: daysInPrevMonth - i,
      month: prevMonth,
      year: prevYear,
      isCurrentMonth: false,
    });
  }
  
  for (let date = 1; date <= daysInMonth; date++) {
    currentWeek.push({
      date,
      month,
      year,
      isCurrentMonth: true,
    });
    
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  
  if (currentWeek.length > 0) {
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    let nextDate = 1;
    
    while (currentWeek.length < 7) {
      currentWeek.push({
        date: nextDate++,
        month: nextMonth,
        year: nextYear,
        isCurrentMonth: false,
      });
    }
    weeks.push(currentWeek);
  }
  
  return weeks;
}

export default function CalendarMonthly({
  currentMonth,
  currentYear,
  selectedDay,
  setCurrentMonth,
  setCurrentYear,
  setSelectedDay,
}: CalendarMonthlyProps) {
  const { language } = usePreferences();
  const { events: rawEvents } = useEvents();
  const langTralator: Record<string, { months: string[]; more: (n: number) => string }> = {
    tr: { months: ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'], more: (n) => `+${n} tane daha` },
    en: { months: ['January','February','March','April','May','June','July','August','September','October','November','December'], more: (n) => `+${n} more` },
    es: { months: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'], more: (n) => `+${n} más` },
  };
  const locales = Object.keys(langTralator);
  const currentLocaleKey = locales[language] ?? locales[0];
  const moreLabel = langTralator[currentLocaleKey].more;
  const weeks = getCalendarGrid(currentMonth, currentYear);
  const today = new Date();

  const handleDayClick = (day: { date: number; month: number; year: number }) => {
    setSelectedDay(day.date);
    setCurrentMonth(day.month);
    setCurrentYear(day.year);
  };

  const getEventsForDay = (date: number, month: number, year: number) => {
    return rawEvents.filter(
      (ev) =>
        ev.year === year &&
        ev.month === month + 1 &&
        ev.day === date
    );
  };

  return (
    <div className="calendar-monthly-main">

      <div className="monthly-grid">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="monthly-week">
            {week.map((day, dayIndex) => {
              const isToday =
                day.date === today.getDate() &&
                day.month === today.getMonth() &&
                day.year === today.getFullYear();

              const isSelected =
                day.date === selectedDay &&
                day.month === currentMonth &&
                day.year === currentYear;

              const events = getEventsForDay(day.date, day.month, day.year);

              return (
                <div
                  key={dayIndex}
                  className={`monthly-day-cell ${
                    !day.isCurrentMonth ? 'other-month' : ''
                  } ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleDayClick(day)}
                >
                  <div className="day-number-wrapper">
                    <span
                      className={`day-number ${
                        isToday ? 'today-circle' : ''
                      }`}
                    >
                      {day.date}
                    </span>
                  </div>

                  <div className="monthly-events-container">
                    {events.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        className="monthly-event"
                      >
                        <span className="event-time">
                          {event.hour.toString().padStart(2, '0')}:00
                        </span>
                        <span className="event-title">{event.title}</span>
                      </div>
                    ))}
                    {events.length > 3 && (
                      <div className="more-events">
                        {moreLabel(events.length - 3)}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}