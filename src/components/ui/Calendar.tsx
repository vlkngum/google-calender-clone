import { ChevronRight, ChevronLeft } from 'lucide-react';
import '../../css/calender.css';
import { usePreferences } from '../../context/PreferencesContext';
 
const langTralator: Record<string, {
  displayName: string;
  months: string[];
  dayShort: string[];  
}> = {
  tr: {
    displayName: 'Türkçe',
    months: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
    dayShort: ['P', 'S', 'Ç', 'P', 'C', 'C', 'P']
  },
  en: {
    displayName: 'English',
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    dayShort: ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  },
  es: {
    displayName: 'Español',
    months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    dayShort: ['L', 'M', 'X', 'J', 'V', 'S', 'D']
  }
};

const locales = Object.keys(langTralator);

interface CalendarProps {
  currentMonth: number;
  currentYear: number;
  selectedDay: number;
  setCurrentMonth: (m: number) => void;
  setCurrentYear: (y: number) => void;
  setSelectedDay: (d: number) => void;
}

export default function Calender({ currentMonth, currentYear, selectedDay, setCurrentMonth, setCurrentYear, setSelectedDay }: CalendarProps) {
  const { language } = usePreferences();
  const currentLocale = locales[language] ?? locales[0];
  const t = langTralator[currentLocale];
  const monthNames = t.months;
  const dayNames = t.dayShort;
  
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
    <div className="ui-calendar-main">
      <div className="calendar-header">
        <h1 className='title'>{monthNames[currentMonth]} {currentYear}</h1>
        <div className='arrow-container'>
            <ChevronLeft className="icon" onClick={prevMonth} />
            <ChevronRight className="icon" onClick={nextMonth} />
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