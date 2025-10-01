import { usePreferences } from '../context/PreferencesContext';
import CalendarDaily from './list/CalenderDaily';

export default function CalenderView() {
    const { calendarType } = usePreferences();
    let Page;
    switch (calendarType) {
        case 0:
            Page = CalendarDaily;
            break;
        // case 1:
        //     Page = ThreeDaysPage;
        //     break;
        // case 2:
        //     Page = WeekPage;
        //     break;
        // case 3:
        //     Page = DayPage;
        //     break;
        // case 4:
        //     Page = AgendaPage;
        //     break;
        default:
            Page = null;
    }
    return Page ? (
        <div style={{ 
            width: '100%', 
            height: '100%',
            overflow: 'hidden'
        }}>
            <Page />
        </div>
    ) : null;
}