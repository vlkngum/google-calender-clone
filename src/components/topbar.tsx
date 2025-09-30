import "./Topbar.css";
import { Menu } from 'lucide-react';
import calendarLogo from '../assets/calendar_30_2x.png';
import { ChevronLeft } from 'lucide-react';
import { ChevronRight } from 'lucide-react';
import { ChevronDown } from 'lucide-react';

export default function Topbar() {
  return (
    <div className="topbar">
      <div className="left">
      <Menu className="menu" />
      <img src={calendarLogo} className="logo" alt="Vite logo" />
        <span className="left-title">Calendar</span>
        <button className="today-btn">Today</button>
      </div>

      <div className="center">
        <div className="center-left">
        <ChevronLeft className="chevron-left" />
      <ChevronRight className="chevron-right" />
    <span className="date">Sep - Oct 2025</span>
    <ChevronDown />
        </div>
      
      </div>

      <div className="right">
      <button className="today-btn">Day</button>
      </div>
    </div>
  );
}
