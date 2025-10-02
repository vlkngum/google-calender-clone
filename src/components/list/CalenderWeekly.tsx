import '../../css/CalendarWeekly.css';

export default function CalendarWeekly() {
  const days = [
    { name: 'Pzt', date: '29 Eyl', isToday: false },
    { name: 'Sal', date: '30 Eyl', isToday: false },
    { name: 'Çar', date: '1 Eki', isToday: true },
    { name: 'Per', date: '2 Eki', isToday: false },
    { name: 'Cum', date: '3 Eki', isToday: false },
    { name: 'Cmt', date: '4 Eki', isToday: false },
    { name: 'Paz', date: '5 Eki', isToday: false },
  ];

  return (
    <div className="calendar-weekly-main">
      <div className="weekly-time-column">
        <div className="weekly-time-header"></div>
        <div className="weekly-time-labels">
          <p>00:00</p>
          <p>01:00</p>
          <p>02:00</p>
          <p>03:00</p>
          <p>04:00</p>
          <p>05:00</p>
          <p>06:00</p>
          <p>07:00</p>
          <p>08:00</p>
          <p>09:00</p>
          <p>10:00</p>
          <p>11:00</p>
          <p>12:00</p>
          <p>13:00</p>
          <p>14:00</p>
          <p>15:00</p>
          <p>16:00</p>
          <p>17:00</p>
          <p>18:00</p>
          <p>19:00</p>
          <p>20:00</p>
          <p>21:00</p>
          <p>22:00</p>
          <p>23:00</p>
        </div>
      </div>

      <div className="weekly-calendar-right">
        <div className="weekly-days-header">
          {days.map((day, index) => (
            <div key={index} className={`weekly-day-header ${day.isToday ? 'today' : ''}`}>
              <div className="day-name">{day.name}</div>
              <div className={`day-date ${day.isToday ? 'today-circle' : ''}`}>
                {day.date.split(' ')[0]}
              </div>
            </div>
          ))}
        </div>

        <div className="weekly-grid-container">
          {days.map((day, dayIndex) => (
            <div key={dayIndex} className={`weekly-day-column ${day.isToday ? 'today-column' : ''}`}>
              <div className="weekly-day-grid">
                {dayIndex === 0 && (
                  <div className="weekly-event" style={{ gridRow: '13 / span 1' }}>
                    <div className="event-content">
                      <p className="event-title">Toplantı</p>
                      <p className="event-time">12:00 - 13:00</p>
                    </div>
                  </div>
                )}
                
                {dayIndex === 2 && (
                  <div className="weekly-event" style={{ gridRow: '15 / span 2' }}>
                    <div className="event-content">
                      <p className="event-title">Proje Sunumu</p>
                      <p className="event-time">14:00 - 16:00</p>
                    </div>
                  </div>
                )}

                {dayIndex === 4 && (
                  <div className="weekly-event" style={{ gridRow: '11 / span 1' }}>
                    <div className="event-content">
                      <p className="event-title">Ekip Toplantısı</p>
                      <p className="event-time">10:00 - 11:00</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          <div className="weekly-current-time-line" style={{ top: '540px' }}></div>
        </div>
      </div>
    </div>
  );
}