import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function Stat({ to, dec = 0, u, text }) {
  const num = useRef(), box = useRef()
  useEffect(() => {
    const o = { v: 0 }
    const st = ScrollTrigger.create({
      trigger: box.current, start: 'top 85%', once: true,
      onEnter: () => gsap.to(o, {
        v: to, duration: 1.8, ease: 'power3.out',
        onUpdate: () => {
          num.current.textContent = o.v.toLocaleString('en', { minimumFractionDigits: dec, maximumFractionDigits: dec })
        },
      }),
    })
    return () => st.kill()
  }, [to, dec])
  return (
    <div className="stat" ref={box}>
      <div className="n"><span ref={num}>0</span><span className="u">{u}</span></div>
      <p>{text}</p>
    </div>
  )
}

export function Row({ title, children }) {
  return <div className="row"><h3>{title}</h3><p>{children}</p></div>
}

export function Content() {
  return (
    <>
      <section className="sec statement"><div className="wrap">
        <p>Every part earns its place. <span>Nothing else is invited.</span></p>
        <small>The AXIOM GT begins as 1,400 individual components and ends as a single idea: a hybrid-electric grand tourer that treats weight, balance and airflow as one problem. Each piece is machined, tested and fitted by hand in a single atelier.</small>
      </div></section>

      <section id="specs" className="sec"><div className="wrap"><div className="stats">
        <Stat to={3.1} dec={1} u="s" text="0 to 100 km/h. Launch control with torque vectoring on all four wheels." />
        <Stat to={1020} u="hp" text="Combined output from a twin-turbo V8 and a rear axle electric motor." />
        <Stat to={68} u="km" text="Electric-only range for silent city driving. 640 km combined." />
        <Stat to={1450} u="kg" text="Dry weight, with a carbon monocoque and a 47:53 weight distribution." />
      </div></div></section>

      <section id="engineering" className="sec eng"><div className="wrap">
        <h2>Engineering that you can feel at 300 km/h.</h2>
        <Row title="Carbon monocoque">The passenger cell is a single carbon fibre tub weighing 92 kg. It is stiffer than steel at one fifth of the mass, and it carries the suspension, powertrain and crash structure without a single compromise in rigidity.</Row>
        <Row title="Hybrid powertrain">A compact V8 sits low and behind the front axle. A 14 kWh battery runs along the floor, keeping the centre of gravity under 450 mm. Power arrives instantly from the motor and builds without pause from the engine.</Row>
        <Row title="Active aerodynamics">Front blades, an underbody diffuser and the rear wing adjust every 20 milliseconds. Downforce rises 38% under braking, and drag drops to a minimum on the straight.</Row>
        <Row title="Carbon ceramic brakes">Six-piston calipers grip 410 mm discs and stop the car from 100 km/h in 31 metres, lap after lap, with no fade.</Row>
      </div></section>

      <section id="reserve" className="sec reserve"><div className="wrap">
        <h2>Limited to 499 cars.</h2>
        <p>Each AXIOM GT is built to order. Reserve your build slot and a specialist will contact you within 48 hours.</p>
        <a className="cta" href="#reserve">RESERVE YOURS</a>
      </div></section>

      <footer className="foot"><span>AXIOM GT</span><span>Concept presentation. Figures are illustrative.</span></footer>
    </>
  )
}
