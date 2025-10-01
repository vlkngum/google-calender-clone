import Calendar from "./ui/Calendar";
import { Plus } from "lucide-react";
import '../css/sidebar.css';


export default function Sidebar (){
    return (
        <div className="sidebar-container">
          <div  className="button-container">
            <Plus className="icon"/> 
            <a className="text">Oluştur</a>
          </div >
          <Calendar/>
        </div>
    );
}