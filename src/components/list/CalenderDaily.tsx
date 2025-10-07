import '../../css/CalenderDaily.css';
import { useEvents } from '../../context/EventsContext';
import { useEffect, useState } from 'react';
import EventModal from '../modal/EventModal';

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
  
  const { events: rawEvents } = useEvents();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDate, setModalDate] = useState<Date | null>(null);
  const [modalEventId, setModalEventId] = useState<string | null>(null);
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
    start: new Date(e.year, e.month , e.day, e.hour, 0),
    end: new Date(e.endYear, e.endMonth , e.endDay, e.endHour, 0)
  }));

  const sorted = events
    .filter(event => {
      const eventDate = event.start;
      return eventDate.getFullYear() === currentYear &&
             eventDate.getMonth() === currentMonth &&
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

  type LayoutInfo = { column: number; totalColumns: number };

  const computeColumns = (dayEvents: CalendarEvent[]): Record<string, LayoutInfo> => {
    const result: Record<string, LayoutInfo> = {};
    const active: { id: string; end: Date; column: number }[] = [];
    let clusterEventIds: string[] = [];
    let clusterMaxCols = 0;

    const finalizeCluster = () => {
      if (clusterEventIds.length === 0) return;
      for (const id of clusterEventIds) {
        result[id] = { column: result[id].column, totalColumns: clusterMaxCols };
      }
      clusterEventIds = [];
      clusterMaxCols = 0;
    };

    const sortedByTime = [...dayEvents].sort((a, b) => {
      const t = a.start.getTime() - b.start.getTime();
      if (t !== 0) return t;
      return a.end.getTime() - b.end.getTime();
    });

    for (const e of sortedByTime) {
      for (let i = active.length - 1; i >= 0; i--) {
        if (active[i].end <= e.start) {
          active.splice(i, 1);
        }
      }

      if (active.length === 0) {
        finalizeCluster();
      }

      const used = new Set(active.map(a => a.column));
      let col = 0;
      while (used.has(col)) col++;

      active.push({ id: e.id, end: e.end, column: col });
      result[e.id] = { column: col, totalColumns: active.length };
      clusterEventIds.push(e.id);
      clusterMaxCols = Math.max(clusterMaxCols, used.size + 1);
    }

    finalizeCluster();

    return result;
  };

  const layoutMap = computeColumns(sorted);

  const eventBlocks = sorted.map(event => {
    const { start, end } = clampEventToDayBounds(event);
    const startMin = minutesSinceStartOfDay(start);
    const endMin = minutesSinceStartOfDay(end);
    const topPx = startMin * (hourHeightPx / 60);
    const heightPx = Math.max(1, (endMin - startMin) * (hourHeightPx / 60) - 1);

    const layout = layoutMap[event.id];
    const widthPercent = 100 / Math.max(1, layout.totalColumns);
    const leftPercent = widthPercent * layout.column;

    return (
      <div 
        key={event.id} 
        className="event" 
        style={{ 
          top: `${topPx}px`,
          height: `${heightPx}px`,
          left: `calc(${leftPercent}% + 4px)`,
          width: `calc(${widthPercent}% - 8px)`
        }}
        onClick={(e) => { e.stopPropagation(); setModalDate(new Date(currentYear, currentMonth, selectedDay)); setModalEventId(event.id); setModalOpen(true); }}
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
  return (now.getHours() * 60 + now.getMinutes()) * (hourHeightPx / 60);
});

useEffect(() => {
  const update = () => {
    const now = new Date();
    setCurrentTop((now.getHours() * 60 + now.getMinutes()) * (hourHeightPx / 60));
  };
  update();
  const id = setInterval(update, 60 * 1000);
  return () => clearInterval(id);
}, [hourHeightPx]);

  return (
    <div className="calendar-main">
      <EventModal visible={modalOpen} date={modalDate} eventId={modalEventId} onClose={() => { setModalOpen(false); setModalEventId(null); }} />
      <div className="calendar-left">
        {renderLabels()}
      </div>

      <div className="calendar-right">
        <div 
          className="grid-container"
          style={{ 
            gridTemplateRows: `repeat(${totalRows}, ${hourHeightPx / rowsPerHour}px)`
          }}
          onClick={() => { setModalDate(new Date(currentYear, currentMonth, selectedDay)); setModalEventId(null); setModalOpen(true); }}
        >
          <div className="current-time-line" style={{ top: `${currentTop}px` }}></div>
          {eventBlocks}
        </div>
      </div>
    </div>
  );
}