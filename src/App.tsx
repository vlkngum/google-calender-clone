import './style.css'
import Sidebar from './components/Sidebar'
import Topbar from './components/topbar'
import CalenderView from './components/CalenderView'
import { DateProvider } from './context/DateContext'
import { PreferencesProvider } from './context/PreferencesContext'
export default function App() { 
  return (
    <DateProvider>
      <PreferencesProvider>
        <div className="app-container">
          <Topbar />
          <div className="content">
            <aside className="sidebar">
              <Sidebar />
            </aside>
            <main className="main">
              <CalenderView />
            </main>
          </div>
        </div>
      </PreferencesProvider>
    </DateProvider>
  )
}
