import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { usePreferences } from '../../context/PreferencesContext';
import '../../css/modal.css';
 
const langTralator: Record<string, {
  displayName: string;
  labels: { title: string; description: string; save: string; cancel: string; language: string; date: string; time: string };
}> = {
  tr: {
    displayName: 'Türkçe',
    labels: { title: 'Başlık ekle', description: 'Açıklama ekleyin', save: 'Kaydet', cancel: 'İptal', language: 'Dil', date: 'Tarih', time: 'Saat' }
  },
  en: {
    displayName: 'English',
    labels: { title: 'Add title', description: 'Add description', save: 'Save', cancel: 'Cancel', language: 'Language', date: 'Date', time: 'Time' }
  },
  es: {
    displayName: 'Español',
    labels: { title: 'Añadir título', description: 'Añadir descripción', save: 'Guardar', cancel: 'Cancelar', language: 'Idioma', date: 'Fecha', time: 'Hora' }
  }
};

const locales = Object.keys(langTralator);

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateModal({ isOpen, onClose }: CreateModalProps) {
  const { language } = usePreferences();
  const currentLocale = locales[language] ?? locales[0];
  const t = langTralator[currentLocale];

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [time, setTime] = useState('19:30');

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
            <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="form-row">
            <label className="label">{t.labels.time}</label>
            <input className="input" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>

          <div className="form-row">
            <textarea className="textarea" placeholder={t.labels.description} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
           
        </div>
        <div className="modal-footer">
          <button className="btn secondary" onClick={onClose}>{t.labels.cancel}</button>
          <button className="btn primary" onClick={onClose}>{t.labels.save}</button>
        </div>
      </div>
    </div>
  );
}


