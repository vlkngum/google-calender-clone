import './style.css'
// import Calender from './components/Calender'
import Topbar from './components/topbar'
import Calenderb from './components/calenderBig'

export default function App() {
  return (
    <div>
      <Topbar />
      {/* <div style={{width: '500px'}}><Calender /></div> */}
      <Calenderb />
    </div>
  )
}