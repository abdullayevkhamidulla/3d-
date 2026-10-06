import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Amb from '../ambient.js'

gsap.registerPlugin(ScrollTrigger)

const SRC = import.meta.env.BASE_URL + 'scrub.mp4'

export default function Hero() {
  const root = useRef(), video = useRef(), intro = useRef(), outro = useRef()
  const read = useRef(), lab = useRef(), pct = useRef(), bar = useRef()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const v = video.current
    v.muted = true
    let target = 0, raf, ctx, started = false

    const init = () => {
      if (started) return
      started = true
      setReady(true)
      const dur = v.duration

      ctx = gsap.context(() => {
        const p = { t: 0 }
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: root.current, start: 'top top', end: '+=450%',
            pin: true, scrub: 0.6, anticipatePin: 1, invalidateOnRefresh: true,
          },
        })
        // scroll progress (0..1) -> video time
        tl.to(p, {
          t: 1, duration: 1,
          onUpdate: () => {
            const q = p.t
            target = q * dur
            const stage = q < 0.34 ? 'Platform' : q < 0.68 ? 'Powertrain' : 'Body'
            if (lab.current.textContent !== stage) lab.current.textContent = stage
            pct.current.textContent = String(Math.round(q * 100)).padStart(3, '0') + '%'
            bar.current.style.transform = `scaleX(${q})`
          },
        }, 0)
        tl.to(intro.current, { opacity: 0, y: -36, filter: 'blur(6px)', duration: 0.1 }, 0.03)
        tl.fromTo(read.current, { opacity: 0 }, { opacity: 1, duration: 0.08 }, 0.1)
        tl.to(read.current, { opacity: 0, duration: 0.06 }, 0.9)
        tl.set(outro.current, { pointerEvents: 'none' }, 0)
        tl.fromTo(outro.current, { opacity: 0, y: 36 }, { opacity: 1, y: 0, duration: 0.1 }, 0.88)
        tl.set(outro.current, { pointerEvents: 'auto' }, 0.92)
      }, root)

      // rAF loop: ease currentTime toward the scroll target, never queue seeks
      let cur = 0
      const loop = () => {
        cur += (target - cur) * 0.35
        if (Math.abs(target - cur) < 0.0005) cur = target
        if (!v.seeking && Math.abs(v.currentTime - cur) > 1 / 60) v.currentTime = cur
        Amb.update(cur / dur)
        raf = requestAnimationFrame(loop)
      }
      loop()
    }

    if (v.readyState >= 1) init()
    else v.addEventListener('loadedmetadata', init, { once: true })

    // iOS: unlock programmatic seeking with a muted play/pause on first touch
    const unlock = () => v.play().then(() => v.pause()).catch(() => {})
    window.addEventListener('touchstart', unlock, { once: true, passive: true })

    return () => {
      cancelAnimationFrame(raf)
      ctx && ctx.revert()
      window.removeEventListener('touchstart', unlock)
      v.removeEventListener('loadedmetadata', init)
    }
  }, [])

  return (
    <>
      <div className={'loader' + (ready ? ' done' : '')} aria-hidden="true">AXIOM</div>
      <section className="hero" ref={root} aria-label="AXIOM GT assembly">
        <div className="glow" />
        <div className="stage">
          <video
            ref={video} src={SRC} className={ready ? 'ready' : ''}
            muted playsInline preload="auto" aria-hidden="true"
            disablePictureInPicture tabIndex={-1}
          />
        </div>
        <div className="copy intro" ref={intro}>
          <h1>Engineered for the future</h1>
          <p className="sub">Precision. Performance. Innovation.</p>
        </div>
        <div className="copy outro" ref={outro}>
          <h2>Built without compromise</h2>
          <a className="cta" href="#engineering">EXPLORE THE CAR</a>
        </div>
        <div className="read" ref={read} aria-hidden="true">
          <b ref={lab}>Platform</b>
          <span className="bar"><i ref={bar} /></span>
          <span ref={pct}>000%</span>
        </div>
      </section>
    </>
  )
}
