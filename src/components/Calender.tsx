import { useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import '../calender.css';

const monthNames = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

export default function Calender() {

  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDay,setSelectedDay]= useState(today.getDay());
  
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const weeks: number[][] = [];
  let day = 1;

  for (let i = 0; i < 7; i++) {  
    const week: number[] = [];
    for (let j = 0; j < 7; j++) {  
      if (day <= daysInMonth) {
        week.push(day++);
      } else {
        week.push(0);  
      }
    }
    weeks.push(week);
  }

  const prevMonth = () => {
    if (currentMonth === 0){
        setCurrentMonth(11);
        setCurrentYear(currentYear-1);
    } else {
        setCurrentMonth(currentMonth -1);
    }
    // setSelectedDay(null)
  }

  const nextMonth = () => {
    if (currentMonth == 11){
        setCurrentMonth(0);
        setCurrentYear(currentYear+1);
    }else {
        setCurrentMonth(currentMonth+1)
    }
    // setSelectedDay(null)
  }

  return (
    <div className="calendar">
      <div className="calendar-header">
        
        <h1>{monthNames[currentMonth]} {currentYear}</h1>
        <div className='arrow-container'>
            <ChevronLeft className="calendar-arrow" onClick={prevMonth} />
            <ChevronRight className="calendar-arrow" onClick={nextMonth} />
        </div>
      </div>

      <div className="calendar-grid">
        {weeks.flat().map((dayNumber, index) => (
          <div
            key={index}
            className={`calendar-day ${dayNumber ? '' : 'empty'} ${selectedDay === dayNumber ? 'selected' : ''}`}
            onClick={() => dayNumber && setSelectedDay(dayNumber)}
          >
            {dayNumber || ''}
          </div>
        ))}

        {selectedDay && (
            <p>seçilen gün: {selectedDay} {monthNames[currentMonth]} {currentYear}</p>
        )}
      </div>
    </div>
  );
}
