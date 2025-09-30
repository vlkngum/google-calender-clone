import { ChevronRight, ChevronLeft } from 'lucide-react';
import '../css/calender.css';
import { useDateContext } from '../context/DateContext';

const monthNames = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
const dayNames = ['P', 'S', 'Ç', 'P', 'C', 'C', 'P'];

export default function Calender() {
  const { currentMonth, currentYear, selectedDay, setCurrentMonth, setCurrentYear, setSelectedDay } = useDateContext();
  
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  let firstDay = new Date(currentYear, currentMonth, 1).getDay(); 
  firstDay = (firstDay + 6) % 7; 

  const weeks: number[][] = [];
  let day = 1;

  for (let i = 0; i < 6; i++) {  
    const week: number[] = [];
    for (let j = 0; j < 7; j++) {
      if (i === 0 && j < firstDay) {
        week.push(0); 
      } else if (day > daysInMonth) {
        week.push(0); 
      } else {
        week.push(day++);
      }
    }
    weeks.push(week);
  }
  
  const prevMonth = () => {
    if (currentMonth === 0){
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
    } else {
        setCurrentMonth(currentMonth - 1);
    }
  }

  const nextMonth = () => {
    if (currentMonth === 11){
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
    } else {
        setCurrentMonth(currentMonth + 1)
    }
  }

  return (
    <div className="calendar">
      <div className="calendar-header">
        <h1 className='title'>{monthNames[currentMonth]} {currentYear}</h1>
        <div className='arrow-container'>
            <ChevronLeft className="calendar-arrow" onClick={prevMonth} />
            <ChevronRight className="calendar-arrow" onClick={nextMonth} />
        </div>
      </div>

      <div className="calendar-grid">
        {dayNames.map((name, index) => (
          <div key={index} className="calendar-day header">{name}</div>
        ))}
        {weeks.flat().map((dayNumber, index) => (
          <div
            key={index}
            className={`calendar-day ${dayNumber ? '' : 'empty'} ${selectedDay === dayNumber ? 'selected' : ''}`}
            onClick={() => dayNumber && setSelectedDay(dayNumber)}
          >
            {dayNumber || ''}
          </div>
        ))}
      </div>
    </div>
  );
}