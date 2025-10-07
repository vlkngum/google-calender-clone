import { useEffect, useState } from 'react';
import { useEvents } from '../../context/EventsContext';
import type { Event } from '../../context/EventsContext';
import '../../css/EventsModal.css';
import { ArrowLeft, Pencil, Trash2,  Calendar as CalendarIcon, Clock as ClockIcon } from 'lucide-react';
import DatePicker from '../ui/DatePicker';

interface EventModalProps {
  visible: boolean;
  date: Date | null;
  onClose: () => void;
  eventId?: string | null;
}

export default function EventModal({ visible, date, onClose, eventId }: EventModalProps) {
  const { events, updateEvent, removeEvent } = useEvents();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editHour, setEditHour] = useState(9);
  const [editEndHour, setEditEndHour] = useState(10);
  const [editDate, setEditDate] = useState<string>('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (!eventId) {
      setEvent(null);
      return;
    }
    const found = events.find(e => e.id === eventId);
    if (found) {
      setEvent(found);
      setEditTitle(found.title);
      setEditHour(found.hour);
      setEditEndHour(found.endHour);
      setIsEditing(false);
      const pad2 = (n: number) => String(n).padStart(2, '0');
      setEditDate(`${found.year}-${pad2(found.month + 1)}-${pad2(found.day)}`);
      setShowDatePicker(false);
    }
  }, [eventId, events]);

  if (!visible) return null;

  const handleSave = () => {
    if (!event) return;
    if (editHour >= editEndHour) return;
    let nextYear = event.year;
    let nextMonth = event.month;
    let nextDay = event.day;
    if (editDate) {
      const [y, m, d] = editDate.split('-').map(Number);
      if (!Number.isNaN(y) && !Number.isNaN(m) && !Number.isNaN(d)) {
        nextYear = y;
        nextMonth = m - 1;
        nextDay = d;
      }
    }
    updateEvent(event.id, {
      title: editTitle,
      hour: editHour,
      endHour: editEndHour,
      year: nextYear,
      month: nextMonth,
      day: nextDay,
      endYear: nextYear,
      endMonth: nextMonth,
      endDay: nextDay,
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (!event) return;
    removeEvent(event.id);
    onClose();
  };

  const eventDate = event ? new Date(event.year, event.month, event.day) : (date ?? new Date());
  const displayDate = eventDate.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="event-detail-overlay" onClick={onClose}>
      <div className="event-detail-modal" onClick={e => e.stopPropagation()}>
        <div className="event-detail-header">
          <button className="icon-btn" onClick={onClose}>
            <ArrowLeft size={20} />
          </button>
          <div className="header-actions">
            {event && (
              <button className="icon-btn" onClick={() => setIsEditing(!isEditing)}>
                <Pencil size={18} />
              </button>
            )}
            {event && (
              <button className="icon-btn" onClick={handleDelete}>
                <Trash2 size={18} />
              </button>
            )}
             
          </div>
        </div>

        <div className="event-detail-body">

          {event && isEditing ? (
            <input
              className="event-title-input"
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              autoFocus
            />
          ) : (
            <h2 className="event-detail-title">{event ? event.title : 'Etkinlik bulunamadı'}</h2>
          )}

          <div className="event-detail-info">
            <div className="info-row" style={{ cursor: isEditing ? 'pointer' : 'default' }} onClick={() => { if (isEditing) setShowDatePicker(s => !s); }}>
              <CalendarIcon size={20} />
              <div className="info-text">
                <div className="info-label">{displayDate}</div>
              </div>
            </div>

            {event && isEditing && showDatePicker && (
              <div style={{ marginLeft: 28 }}>
                <DatePicker value={editDate} onChange={setEditDate} placeholder="Tarih" language={'tr'} />
              </div>
            )}

            <div className="info-row">
              <ClockIcon size={20} />
              {event && isEditing ? (
                <div className="time-edit-row">
                  <input
                    className="time-input-small"
                    type="time"
                    value={`${String(editHour).padStart(2,'0')}:00`}
                    onChange={e => setEditHour(Number(e.target.value.split(':')[0]))}
                  />
                  <span>–</span>
                  <input
                    className="time-input-small"
                    type="time"
                    value={`${String(editEndHour).padStart(2,'0')}:00`}
                    onChange={e => setEditEndHour(Number(e.target.value.split(':')[0]))}
                  />
                </div>
              ) : (
                <div className="info-text">
                  <div className="info-label">
                    {event ? `${String(event.hour).padStart(2,'0')}:00 – ${String(event.endHour).padStart(2,'0')}:00` : '—'}
                  </div>
                </div>
              )}
            </div>
          </div>

          {event && isEditing && (
            <div className="edit-actions">
              <button className="btn-cancel" onClick={() => setIsEditing(false)}>
                İptal
              </button>
              <button className="btn-save" onClick={handleSave}>
                Kaydet
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
