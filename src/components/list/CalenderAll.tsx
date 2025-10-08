import '../../css/calenderAll.css';
import { useEvents } from '../../context/EventsContext';
import { usePreferences } from '../../context/PreferencesContext';
import { useState } from 'react';
import EventModal from '../modals/EventModal';

const langTralator: Record<string, { Month: string[]; Days: string[]; locale: string }> = {
  tr: {
    Month: ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'],
    Days: ['Paz','Pzt','Sal','Çar','Per','Cum','Cmt'],
    locale: 'tr-TR'
  },
  en: {
    Month: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    Days: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
    locale: 'en-US'
  },
  es: {
    Month: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
    Days: ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'],
    locale: 'es-ES'
  }
};

interface CalendarAllProps {
  currentMonth: number;
  currentYear: number;
  selectedDay: number;
  setCurrentMonth: (m: number) => void;
  setCurrentYear: (y: number) => void;
  setSelectedDay: (d: number) => void;
}

export default function CalenderAll({ currentMonth, currentYear, selectedDay }: CalendarAllProps) {
  const { language } = usePreferences();
  const { events: rawEvents } = useEvents();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDate, setModalDate] = useState<Date | null>(null);
  const [modalEventId, setModalEventId] = useState<string | null>(null);
  const locales = Object.keys(langTralator);
  const currentLocaleKey = locales[language] ?? locales[0];
  const { Month, Days, locale } = langTralator[currentLocaleKey];
  const events = rawEvents.map(event => ({
    id: event.id,
    title: event.title,
    start: new Date(event.year, event.month, event.day, event.hour || 0, 0),
    end: new Date(event.endYear, event.endMonth, event.endDay, event.endHour || event.hour || 0, 0)
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

  const selectedDate = new Date(currentYear, currentMonth, selectedDay);
  const dayKeys = Object.keys(groupedByDay);

  const sortedDayKeys = dayKeys
    .map(key => {
      const [year, month, day] = key.split('-').map(Number);
      const date = new Date(year, month, day);
      return { key, date };
    })
    .filter(item => item.date.getTime() >= selectedDate.getTime())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .map(item => item.key);

  const timeFormatter = new Intl.DateTimeFormat(locale, { hour: 'numeric', minute: '2-digit' });
  function formatTime(date: Date) {
    return timeFormatter.format(date);
  }

  return (
    <div className='cal-all-container'>
      <EventModal visible={modalOpen} date={modalDate} eventId={modalEventId} onClose={() => { setModalOpen(false); setModalEventId(null); }} />
      {sortedDayKeys.map(dayKey => {
        const dayEvents = groupedByDay[dayKey];
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

            <div className="cal-all-events-list" onClick={() => { setModalDate(new Date(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate())); setModalEventId(null); setModalOpen(true); }}>
              {dayEvents.map(event => (
                <div key={event.id} className="cal-all-event" onClick={(e) => { e.stopPropagation(); setModalDate(new Date(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate())); setModalEventId(event.id); setModalOpen(true); }}>
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
