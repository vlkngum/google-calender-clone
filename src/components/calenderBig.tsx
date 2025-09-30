import "./calendarBig.css";

export default function CalendarBig() {
  const hours = Array.from({ length: 25 }, (_, i) => `${i.toString().padStart(2, "0")}:00`);

  return (
    <div className="calendar">
      <div className="calendar-left">
        {hours.map((hour) => (
          <p key={hour}>{hour}</p>
        ))}
      </div>

      <div className="calendar-right">
        <div className="grid-container">
          <div className="current-time-line"></div>

          <div className="event" style={{ gridRow: "10 / span 2" }}>
            <div className="text">
              <p>Toplantı</p>
              <p>9 - 10:30am</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
