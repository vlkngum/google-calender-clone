import '../../css/CalendarWeekly.css';
import { useEvents } from '../../context/EventsContext';

interface CalendarWeeklyProps {
  currentMonth: number;
  currentYear: number;
  selectedDay: number;
  setCurrentMonth: (m: number) => void;
  setCurrentYear: (y: number) => void;
  setSelectedDay: (d: number) => void;
}

function getStartOfWeek(date: Date) {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff));
}

function getWeekDays(currentDate: Date) {
  const startOfWeek = getStartOfWeek(new Date(currentDate));
  const days = [];
  const dayNames = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);

    days.push({
      name: dayNames[i],
      date: d,
      isToday:
        d.getDate() === currentDate.getDate() &&
        d.getMonth() === currentDate.getMonth() &&
        d.getFullYear() === currentDate.getFullYear(),
    });
  }
  return days;
}

export default function CalendarWeekly({ 
  currentMonth, 
  currentYear, 
  selectedDay 
}: CalendarWeeklyProps) {
  const { events: rawEvents } = useEvents();
  const selectedDate = new Date(currentYear, currentMonth, selectedDay);
  const days = getWeekDays(selectedDate);

  const today = new Date();
  const todayIndex = days.findIndex(day => 
    day.date.getDate() === today.getDate() &&
    day.date.getMonth() === today.getMonth() &&
    day.date.getFullYear() === today.getFullYear()
  );
  
  const columnWidthPercent = 100 / days.length;

  return (
    <div className="calendar-weekly-main">
      <div className="weekly-time-column">
        <div className="weekly-time-header"></div>
        <div className="weekly-time-labels">
          {Array.from({ length: 24 }).map((_, i) => (
            <p key={i}>{i.toString().padStart(2, '0')}:00</p>
          ))}
        </div>
      </div>

      <div className="weekly-calendar-right">
        <div className="weekly-days-header">
          {days.map((day, index) => (
            <div
              key={index}
              className={`weekly-day-header ${
                day.date.getDate() === selectedDay &&
                day.date.getMonth() === currentMonth &&
                day.date.getFullYear() === currentYear
                  ? 'today'
                  : ''
              }`}
            >
              <div className="day-name">{day.name}</div>
              <div
                className={`day-date ${
                  day.date.getDate() === selectedDay &&
                  day.date.getMonth() === currentMonth &&
                  day.date.getFullYear() === currentYear
                    ? 'today-circle'
                    : ''
                }`}
              >
                {day.date.getDate()}
              </div>
            </div>
          ))}
        </div>

        <div className="weekly-grid-container">
          {days.map((day, dayIndex) => {
            const dayEvents = rawEvents.filter(
              (ev) =>
                ev.year === day.date.getFullYear() &&
                ev.month === day.date.getMonth() + 1 &&
                ev.day === day.date.getDate()
            );

            return (
              <div
                key={dayIndex}
                className={`weekly-day-column ${
                  day.date.getDate() === selectedDay &&
                  day.date.getMonth() === currentMonth &&
                  day.date.getFullYear() === currentYear
                    ? 'today-column'
                    : ''
                }`}
              >
                <div className="weekly-day-grid">
                  {dayEvents.map((ev) => {
                    const startRow = ev.hour + 1;
                    const duration = ev.endHour - ev.hour;

                    return (
                      <div
                        key={ev.id}
                        className="weekly-event"
                        style={{ gridRow: `${startRow} / span ${duration}` }}
                      >
                        <div className="event-content">
                          <p className="event-title">{ev.title}</p>
                          <p className="event-time">
                            {ev.hour}:00 - {ev.endHour}:00
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {todayIndex !== -1 && (
            <div
              className="weekly-current-time-line"
              style={{
                top: `${today.getHours() * 60 + today.getMinutes()}px`,
                left: `${todayIndex * columnWidthPercent}%`,
                width: `${columnWidthPercent}%`,
              }}
            ></div>
          )}
        </div>
      </div>
    </div>
  );
}