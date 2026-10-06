import { useEffect, useState } from 'react'
import Amb from '../ambient.js'

export default function SoundToggle() {
  const [s, set] = useState({ on: true, run: false })
  useEffect(() => Amb.subscribe(set), [])
  const live = s.on && s.run
  const label = !s.on ? 'Sound off' : !s.run ? 'Tap for sound' : 'Sound on'
  return (
    <button
      type="button"
      className={'snd' + (live ? ' on' : '')}
      aria-pressed={s.on}
      aria-label={s.on ? 'Turn sound off' : 'Turn sound on'}
      onClick={() => Amb.toggle()}
    >
      <span className="eq" aria-hidden="true"><i /><i /><i /></span>
      {label}
    </button>
  )
}
