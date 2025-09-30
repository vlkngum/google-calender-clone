import './style.css'
import typescriptLogo from './assets/typescript.svg'
import viteLogo from './assets/vite.svg'
import Counter from './components/Counter'

export default function App() {
  return (
    <div>
      <header>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://www.typescriptlang.org/" target="_blank">
          <img src={typescriptLogo} className="logo vanilla" alt="TypeScript logo" />
        </a>
      </header>
      <h1>Google Calendar Clone</h1>
      <Counter />
    </div>
  )
}
