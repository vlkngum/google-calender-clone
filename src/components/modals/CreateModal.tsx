import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { usePreferences } from '../../context/PreferencesContext';
import '../../css/modal.css';
import { useEvents } from '../../context/EventsContext';

import DatePicker from '../ui/DatePicker';
 
const langTralator: Record<string, {
  displayName: string;
  labels: { 
    title: string; 
    description: string; 
    save: string; 
    cancel: string; 
    language: string; 
    date: string; 
    time: string;
    startTime: string;
    endTime: string;
  };
}> = {
  tr: {
    displayName: 'Türkçe',
    labels: { 
      title: 'Başlık ekle', 
      description: 'Açıklama ekleyin', 
      save: 'Kaydet', 
      cancel: 'İptal', 
      language: 'Dil', 
      date: 'Tarih', 
      time: 'Saat',
      startTime: 'Başlangıç saati',
      endTime: 'Bitiş saati'
    }
  },
  en: {
    displayName: 'English',
    labels: { 
      title: 'Add title', 
      description: 'Add description', 
      save: 'Save', 
      cancel: 'Cancel', 
      language: 'Language', 
      date: 'Date', 
      time: 'Time',
      startTime: 'Start time',
      endTime: 'End time'
    }
  },
  es: {
    displayName: 'Español',
    labels: { 
      title: 'Añadir título', 
      description: 'Añadir descripción', 
      save: 'Guardar', 
      cancel: 'Cancelar', 
      language: 'Idioma', 
      date: 'Fecha', 
      time: 'Hora',
      startTime: 'Hora de inicio',
      endTime: 'Hora de finalización'
    }
  }
};
 
const locales: string[] = Object.keys(langTralator);

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateModal({ isOpen, onClose }: CreateModalProps) {
  const { language } = usePreferences();
  const { addEvent } = useEvents(); 
  const currentLocale = locales[language] ?? locales[0];
  const t = langTralator[currentLocale];

  const [startTime, setStartTime] = useState('19:00');
  const [endTime, setEndTime] = useState('20:00');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const pad2 = (n: number) => String(n).padStart(2, '0');
  const toDateInput = (y: number, m0: number, d: number) => `${y}-${pad2(m0 + 1)}-${pad2(d)}`;
  const today = new Date();
  const [date, setDate] = useState<string>(toDateInput(today.getFullYear(), today.getMonth(), today.getDate()));

  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      const now = new Date();
      setDate(toDateInput(now.getFullYear(), now.getMonth(), now.getDate()));
      const hh = String(now.getHours()).padStart(2, '0');
      setStartTime(`${hh}:00`);
      const endH = Math.min(23, now.getHours() + 1);
      setEndTime(`${String(endH).padStart(2, '0')}:00`);
    }
  }, [isOpen]);

  const canSave = title.trim().length > 0 && date && startTime && endTime;

  const parseDateTime = (dateStr: string, timeStr: string) => {
    const [yStr, mStr, dStr] = dateStr.split('-');
    const [hhStr, mmStr = '0'] = timeStr.split(':');
    return {
      year: Number(yStr),
      monthOneBased: Number(mStr),
      day: Number(dStr),
      hour: Number(hhStr),
      minute: Number(mmStr),
    };
  };

  const handleSave = () => {
    if (!canSave) return;

    const { year, monthOneBased, day, hour: startHour } = parseDateTime(date, startTime);
    const { hour: parsedEndHour } = parseDateTime(date, endTime);

    const endYear = year;
    const endMonthOneBased = monthOneBased;
    const endDay = day;
    const saneEndHour = Math.max(startHour + 1, parsedEndHour);
    const endHour = Math.min(23, saneEndHour);

    addEvent({
      id: String(Date.now()),
      title: title.trim(),
      year,
      month: monthOneBased - 1,
      day,
      hour: startHour,
      endYear,
      endMonth: endMonthOneBased - 1,
      endDay,
      endHour,
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" ref={backdropRef} onClick={(e) => { if (e.target === backdropRef.current) onClose(); }}>
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">{t.labels.title}</h2>
          <X className="icon" onClick={onClose} style={{ cursor: 'pointer' }}/>
        </div>
        <div className="modal-body">
          <div className="form-row">
            <input className="input" placeholder={t.labels.title} value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
         
          <div className="form-row">
            <label className="label">{t.labels.date}</label>
            <DatePicker
              value={date}
              onChange={setDate}
              placeholder={t.labels.date}
              className="w-full"
              language={currentLocale}
            />
          </div>

          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label className="label">{t.labels.startTime}</label>
              <input className="input" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            </div>
            <div>
              <label className="label">{t.labels.endTime}</label>
              <input className="input" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            </div>
          </div>
          

          <div className="form-row">
            <textarea className="textarea" placeholder={t.labels.description} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
           
        </div>
        <div className="modal-footer">
          <button className="btn secondary" onClick={onClose}>{t.labels.cancel}</button>
          <button
            className="btn primary"
            disabled={!canSave}
            onClick={handleSave}
          >
            {t.labels.save}
          </button>
        </div>
      </div>
    </div>
  );
}


