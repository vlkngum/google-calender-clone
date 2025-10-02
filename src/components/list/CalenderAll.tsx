import '../../css/calenderAll.css';
import { rawEvents } from '../../data/events';

const Month = [
  'Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'
];

const Days = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

export default function CalenderAll() { 
  const events = rawEvents.map(event => ({
    id: event.id,
    title: event.title,
    start: new Date(event.year, event.month - 1, event.day, event.hour || 0, 0),
    end: new Date(event.endYear, event.endMonth - 1, event.endDay, event.endHour || event.hour || 0, 0)
  }));
 
  const sortedEvents = events.sort((a, b) => a.start.getTime() - b.start.getTime());
 
  const groupedByDay: Record<string, typeof events> = {};
  sortedEvents.forEach(event => {
    const dayKey = `${event.start.getFullYear()}-${event.start.getMonth()}-${event.start.getDate()}`;
    if (!groupedByDay[dayKey]) {
      groupedByDay[dayKey] = [];
    }
    groupedByDay[dayKey].push(event);
  });

  function formatTime(date: Date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  return (
    <div className='cal-all-container'>
      {Object.entries(groupedByDay).map(([dayKey, dayEvents]) => {
        const firstEvent = dayEvents[0];
        const dayDate = firstEvent.start;
        
        return (
          <div key={dayKey} className="cal-all-day-row">
            <div className='cal-all-date-label'>
              <div className='cal-all-day-number'>{dayDate.getDate()}</div>
              <div className='cal-all-month-weekday'>
                {Month[dayDate.getMonth()]}, {Days[dayDate.getDay()]}
              </div>
            </div>
            
            <div className="cal-all-events-list">
              {dayEvents.map(event => (
                <div key={event.id} className="cal-all-event">
                  <div className='cal-all-dot'></div>
                  <div className='cal-all-time'>
                    {formatTime(event.start)} - {formatTime(event.end)}
                  </div>
                  <div className='cal-all-event-title'>{event.title}</div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}