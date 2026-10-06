import Hero from './components/Hero.jsx'
import { Content } from './components/Sections.jsx'
import SoundToggle from './components/SoundToggle.jsx'

export default function App() {
  return (
    <>
      <header className="nav">
        <span className="brand">AXIOM GT</span>
        <nav>
          <a href="#specs">Performance</a>
          <a href="#engineering">Engineering</a>
          <a href="#reserve">Reserve</a>
          <SoundToggle />
        </nav>
      </header>
      <Hero />
      <Content />
    </>
  )
}
