import './style.css'
import Sidebar from './components/Sidebar'
import Topbar from './components/topbar'
import CalenderView from './components/CalenderView'
import { DateProvider } from './context/DateContext'
import { PreferencesProvider } from './context/PreferencesContext'
import { useDateContext } from './context/DateContext'

function AppContent() {
  const { isSidebarOpen } = useDateContext();
  
  return (
    <div className="app-container">
      <Topbar />
      <div className="content">
        <aside className={`sidebar ${!isSidebarOpen ? 'hidden' : ''}`}>
          <Sidebar />
        </aside>
        <main className="main">
          <CalenderView />
        </main>
      </div>
    </div>
  );
}

export default function App() { 
  return (
    <DateProvider>
      <PreferencesProvider>
        <AppContent />
      </PreferencesProvider>
    </DateProvider>
  )
}