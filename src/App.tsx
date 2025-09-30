import './style.css'
import Sidebar from './components/Sidebar'
import Topbar from './components/topbar'
import Calender from './components/Calendar'
import { DateProvider } from './context/DateContext'

export default function App() { 
  return (
    <DateProvider>
      <div className='container'>
        <Topbar />
        <div className='sidebar'>
          <Sidebar />
        </div>
        <div className='calendar'>
          <Calender />
        </div>
      </div>
    </DateProvider>
  )
}