import { usePreferences } from '../context/PreferencesContext';
import CalendarDaily from './list/CalenderDaily';
import CalenderWeekly from './list/CalenderWeekly';
import '../css/calenderView.css';
export default function CalenderView() {
    const { calendarType } = usePreferences();

    switch (calendarType) {
        case 0:
            return (
                <div className="calendar-view-container">
                    <CalendarDaily />
                </div>
            );
         case 1:
             return (
                 <div className="calendar-view-container">
                     <CalenderWeekly />
                 </div>
             );
        // case 2:
        //     return (
        //         <div className="calendar-view-container">
        //             <WeekPage />
        //         </div>
        //     );
        // case 3:
        //     return (
        //         <div className="calendar-view-container">
        //             <DayPage />
        //         </div>
        //     );
        // case 4:
        //     return (
        //         <div className="calendar-view-container">
        //             <AgendaPage />
        //         </div>
        //     );
        default:
            return null;
    }
}