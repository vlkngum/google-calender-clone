import '../../css/CalenderDaily.css';
import { rawEvents } from '../../data/events';
import { useEffect, useState } from 'react';

interface CalenderDailyProps {
  currentMonth: number;
  currentYear: number;
  selectedDay: number;
  setCurrentMonth: (m: number) => void;
  setCurrentYear: (y: number) => void;
  setSelectedDay: (d: number) => void;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
}

export default function CalenderDaily({ 
  currentMonth, 
  currentYear, 
  selectedDay,  
}: CalenderDailyProps) {
  
  const rowsPerHour = 2; 
  const totalRows = 24 * rowsPerHour; 
  const hourHeightPx = 60;


  const minutesSinceStartOfDay = (d: Date): number => {
    return d.getHours() * 60 + d.getMinutes();
  };

  const clampEventToDayBounds = (event: CalendarEvent): { start: Date; end: Date } => {
    return { start: event.start, end: event.end };
  };

  const events: CalendarEvent[] = rawEvents.map(e => ({
    id: e.id,
    title: e.title,
    start: new Date(e.year, e.month - 1, e.day, e.hour, 0),
    end: new Date(e.endYear, e.endMonth - 1, e.endDay, e.endHour, 0)
  }));

  const sorted = events
    .filter(event => {
      const eventDate = event.start;
      return eventDate.getFullYear() === currentYear &&
             eventDate.getMonth() === currentMonth - 1 &&
             eventDate.getDate() === selectedDay;
    })
    .sort((a, b) => a.start.getTime() - b.start.getTime());

  const formatHour = (d: Date) => d.getHours().toString().padStart(2, '0');
  const formatMinute = (d: Date) => d.getMinutes().toString().padStart(2, '0');

  const renderLabels = () => {
    const labels: React.ReactNode[] = [];
    for (let h = 0; h < 24; h++) {
      const label = h.toString().padStart(2, '0') + ':00';
      labels.push(<p key={h}>{label}</p>);
    }
    return labels;
  };

  const getOverlappingEvents = (event: CalendarEvent, allEvents: CalendarEvent[]) => {
    const overlaps = allEvents.filter(e => {
      if (e.id === event.id) return false;
      return e.start < event.end && e.end > event.start;
    });
    return overlaps;
  };

  const calculatePosition = (event: CalendarEvent, allEvents: CalendarEvent[]) => {
    const overlapping = getOverlappingEvents(event, allEvents);
    const totalOverlapping = overlapping.length + 1;
    const eventIndex = overlapping.filter(e => e.start <= event.start).length;
    return { totalOverlapping, eventIndex };
  };

  const eventBlocks = sorted.map(event => {
    const { start, end } = clampEventToDayBounds(event);
    const startMin = minutesSinceStartOfDay(start);
    const endMin = minutesSinceStartOfDay(end);
    const startRow = Math.floor((startMin / 60) * rowsPerHour) + 1;
    const durationRows = Math.max(1, Math.ceil(((endMin - startMin) / 60) * rowsPerHour));

    const { totalOverlapping, eventIndex } = calculatePosition(event, sorted);
    const widthPercent = 100 / totalOverlapping;
    const leftPercent = widthPercent * eventIndex;

    return (
      <div 
        key={event.id} 
        className="event" 
        style={{ 
          gridRow: `${startRow} / span ${durationRows}`,
          width: `calc(${widthPercent}% - 10px)`,
          marginLeft: `calc(${leftPercent}% + 2px)`,
          marginRight: '0'
        }}
      >
        <div className="text">
          <p>{event.title}</p>
          <p>{formatHour(start)}:{formatMinute(start)} - {formatHour(end)}:{formatMinute(end)}</p>
        </div>
      </div>
    );
  });

  const [currentTop, setCurrentTop] = useState<number>(() => {
    const now = new Date();
    return now.getHours() * hourHeightPx;
  });

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTop(now.getHours() * hourHeightPx);
    };
    update();
    const id = setInterval(update, 60 * 1000);
    return () => clearInterval(id);
  }, [hourHeightPx]);

  return (
    <div className="calendar-main">
      <div className="calendar-left">
        {renderLabels()}
      </div>

      <div className="calendar-right">
        <div 
          className="grid-container"
          style={{ 
            gridTemplateRows: `repeat(${totalRows}, ${hourHeightPx / rowsPerHour}px)`
          }}
        >
          <div className="current-time-line" style={{ top: `${currentTop}px` }}></div>
          {eventBlocks}
        </div>
      </div>
    </div>
  );
}