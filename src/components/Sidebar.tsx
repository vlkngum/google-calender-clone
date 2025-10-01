import Calendar from "./ui/Calendar";
import { Plus } from "lucide-react";
import '../css/sidebar.css';
import { useDateContext } from '../context/DateContext';

export default function Sidebar (){
    const { isSidebarOpen } = useDateContext();
    
    return (
        <div className={`sidebar-container ${!isSidebarOpen ? 'hidden' : ''}`}>
          <div className="sidebar-button-container">
            <Plus className="icon"/> 
            <a className="text">Oluştur</a>
          </div>
          <Calendar/>
        </div>
    );
}