import './style.css'
import Sidebar from './components/Sidebar'
import Topbar from './components/topbar'
import { DateProvider } from './context/DateContext'

export default function App() { 
  return (
    <DateProvider>
      <div className='container'>
        <Topbar />
        <div className='sidebar'>
          <Sidebar />
        </div>
      </div>
    </DateProvider>
  )
}