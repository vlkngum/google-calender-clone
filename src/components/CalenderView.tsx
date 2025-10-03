import '../css/calenderView.css';

import { usePreferences } from '../context/PreferencesContext';
import CalendarDaily from './list/CalenderDaily';
import CalendarWeekly from './list/CalenderWeekly';
import CalendarAll from './list/CalenderAll';

interface CalenderViewProps {
    currentMonth: number;
    currentYear: number;
    selectedDay: number;
    setCurrentMonth: (m: number) => void;
    setCurrentYear: (y: number) => void;
    setSelectedDay: (d: number) => void;
}

export default function CalenderView({ 
    currentMonth, 
    currentYear, 
    selectedDay, 
    setCurrentMonth, 
    setCurrentYear, 
    setSelectedDay 
}: CalenderViewProps) {
    const { calendarType } = usePreferences();

    switch (calendarType) {
        case 0:
            return (
                <div className="calendar-view-container">
                    <CalendarDaily 
                        currentMonth={currentMonth}
                        currentYear={currentYear}
                        selectedDay={selectedDay}
                        setCurrentMonth={setCurrentMonth}
                        setCurrentYear={setCurrentYear}
                        setSelectedDay={setSelectedDay} 
                    />
                </div>
            );
        case 1:
            return (
                <div className="calendar-view-container">
                     <CalendarWeekly 
                        currentMonth={currentMonth}
                        currentYear={currentYear}
                        selectedDay={selectedDay}
                        setCurrentMonth={setCurrentMonth}
                        setCurrentYear={setCurrentYear}
                        setSelectedDay={setSelectedDay}
                    />
                </div>
            );
        // case 2:
        //     return (
        //         <div className="calendar-view-container">
        //             <Ay />
        //         </div>
        //     );
        // case 3:
        //     return (
        //         <div className="calendar-view-container">
        //             <Yıl />
        //         </div>
        //     );
        case 4:
            return (
                <div className="calendar-view-container">
                    <CalendarAll />
                </div>
            );
        default:
            return null;
    }
}