import './style.css'
import Calender from './components/Calender'
import Topbar from './components/topbar'
export default function App() {
  return (
    <div>
      <Topbar />
      <div style={{width: '500px'}}><Calender /></div>
    </div>
  )
}
