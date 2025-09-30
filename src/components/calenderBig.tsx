import '../css/calendarBig.css';

export default function CalendarBig() {
  return (
    <div className="calendar">
      <div className="calendar-left">
      <p>00:00</p> <p>01:00</p> <p>02:00</p> <p>03:00</p> <p>04:00</p> <p>05:00</p> <p>06:00</p> <p>07:00</p> <p>08:00</p> <p>09:00</p> <p>10:00</p> <p>11:00</p> <p>12:00</p> <p>13:00</p> <p>14:00</p> <p>15:00</p> <p>16:00</p> <p>17:00</p> <p>18:00</p> <p>19:00</p> <p>20:00</p> <p>21:00</p> <p>22:00</p> <p>23:00</p> <p>24:00</p>
      </div>

      <div className="calendar-right">
        <div className="grid-container">
          <div className="current-time-line"></div>

          <div className="event" style={{ gridRow: "13 / span 1" }}>
            <div className="text">
              <p>Toplantı</p>
              <p>12 - 13:00</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
