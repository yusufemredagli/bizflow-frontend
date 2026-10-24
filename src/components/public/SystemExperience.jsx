import MarketingVisual from "./MarketingVisual.jsx"
import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import OperationsCanvas from "./OperationsCanvas.jsx"
import { simulationFrames, storyChapters } from "./operationsData.js"
import { motionTiming, useInView, useReducedMotion } from "./usePublicMotion.js"

export default function SystemExperience() {
  const journey = useRef(null)
  const canvas = useRef(null)
  const elapsed = useRef(0)
  const runToken = useRef(0)
  const introPlayed = useRef(false)
  const animatedRun = useRef(0)
  const visible = useInView(canvas)
  const reduced = useReducedMotion()
  const [view, setView] = useState(() => ({ stage: 0, chapter: 0, frame: reduced ? simulationFrames.length - 1 : 0, mode: "simulation", running: !reduced, runId: 1 }))
  const frame = view.mode === "simulation" ? simulationFrames[view.frame] : null
  const stage = frame?.stage ?? view.stage
  const playing = view.running && visible && !reduced
  const focused = stage > 0 || (view.mode === "simulation" && frame.at >= 500)

  useEffect(() => {
    const scene = canvas.current
    if (reduced || !visible || !scene.animate) return
    const isIntro = !introPlayed.current && view.mode !== "simulation"
    const isReplay = view.mode === "simulation" && animatedRun.current !== view.runId
    if (!isIntro && !isReplay) return
    introPlayed.current = true
    if (isReplay) animatedRun.current = view.runId
    const animations = []
    const animate = (selector, keyframes, delay = 0, duration = motionTiming.slow) => {
      scene.querySelectorAll(selector).forEach(node => animations.push(node.animate(keyframes, { duration, delay, easing: motionTiming.easing })))
    }
    animate(".bf-op-service-content", [
      { opacity: 0.2, transform: "translateY(12px) scale(.97)" },
      { opacity: 1, transform: "translateY(-2px) scale(1.005)", offset: .8 },
      { opacity: 1, transform: "none" }
    ], isIntro ? 100 : 500, isIntro ? 850 : 600)
    if (isIntro) {
      animate(".bf-op-technician", [{ opacity: .2, translate: "0 9px" }, { opacity: 1, translate: "0 0" }], 280, 850)
      const circle = scene.querySelector(".bf-op-sla-remaining")
      const offset = window.getComputedStyle(circle).strokeDashoffset
      animate(".bf-op-sla-remaining", [{ strokeDashoffset: 1 }, { strokeDashoffset: offset }], 400)
      animate(".bf-op-route-customer", [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], 220, 900)
      animate(".bf-op-rail", [{ opacity: .2, translate: "0 4px" }, { opacity: 1, translate: "0 0" }], 650, 500)
    }
    return () => animations.forEach(animation => animation.cancel())
  }, [visible, reduced, view.mode, view.runId])

  useEffect(() => {
    if (!playing) return
    const token = runToken.current
    const startingElapsed = elapsed.current
    const started = performance.now()
    let timer
    let cancelled = false
    const advance = () => {
      if (cancelled) return
      const time = startingElapsed + performance.now() - started
      let index = 0
      while (index + 1 < simulationFrames.length && simulationFrames[index + 1].at <= time) index += 1
      const complete = index === simulationFrames.length - 1
      setView(previous => ({ ...previous, frame: index, chapter: simulationFrames[index].stage < 2 ? simulationFrames[index].stage : simulationFrames[index].stage < 4 ? 2 : simulationFrames[index].stage === 4 ? 3 : 4, running: !complete }))
      if (!complete) timer = window.setTimeout(advance, Math.max(1, simulationFrames[index + 1].at - time))
    }
    advance()
    return () => {
      cancelled = true
      if (runToken.current === token) elapsed.current = Math.min(simulationFrames.at(-1).at, startingElapsed + performance.now() - started)
      window.clearTimeout(timer)
    }
  }, [playing, view.runId])

  useEffect(() => {
    if (!visible || reduced) return
    let raf
    const measure = userScroll => {
      const rect = journey.current.getBoundingClientRect()
      const progress = Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height - window.innerHeight)))
      canvas.current.style.setProperty("--bf-story-drift", `${Math.max(-10, Math.min(10, -rect.top * .008))}px`)
      canvas.current.style.setProperty("--bf-scroll", progress.toFixed(4))
      if (!userScroll) return
      const next = Math.min(5, Math.floor(progress * 6))
      const chapter = next < 2 ? next : next < 4 ? 2 : next === 4 ? 3 : 4
      setView(previous => previous.mode === "simulation" || (previous.mode === "story" && previous.stage === next) ? previous : {
        ...previous, stage: next, chapter, mode: "story", running: false
      })
    }
    const update = () => {
      if (raf !== undefined) return
      raf = window.requestAnimationFrame(() => { raf = undefined; measure(true) })
    }
    measure(false)
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => { window.cancelAnimationFrame(raf); window.removeEventListener("scroll", update); window.removeEventListener("resize", update) }
  }, [visible, reduced])

  // Static chapter navigation also works without motion or scroll observers.
  const selectStage = index => setView(previous => ({ ...previous, stage: index, chapter: index < 2 ? index : index < 4 ? 2 : index === 4 ? 3 : 4, mode: "manual", running: false }))
  const run = () => {
    runToken.current += 1
    elapsed.current = 0
    const staticRun = reduced || !("IntersectionObserver" in window)
    setView(previous => ({ ...previous, frame: staticRun ? simulationFrames.length - 1 : 0, mode: "simulation", running: !staticRun, runId: previous.runId + 1 }))
  }

  return <section className="bf-system-experience">
    <div className="bf-container bf-system-boot"><span className="bf-boot-brand">BIZFLOW <i /></span><span>OPERATIONS IN MOTION</span><span className="bf-boot-ready">SYSTEM READY <i /></span></div>
    <div className="bf-container bf-hero-visual-bridge"><MarketingVisual kind="hero" /></div>
    <div className="bf-container bf-living-journey" ref={journey}>
      <div className={`bf-living-canvas bf-fluid-phase-${stage} ${focused ? "is-focused" : ""} ${visible && !reduced && !view.running && stage === 0 && view.mode !== "simulation" ? "bf-motion-idle" : ""}`} ref={canvas} data-mode={view.mode}>
        <div key={view.runId} className="bf-fluid-backdrop" aria-hidden="true" />
        <div className="bf-scene-headline"><span className="bf-label">FIELD OPS / 01 — LIVE WORKFLOW</span><h1><span>Her talep</span><em>bir sinyal.</em></h1><p>Talep gelir. Ekip bağlanır.<br />Operasyon hareket halindeyken görünür olur.</p></div>
        <OperationsCanvas key={view.runId} stage={stage} frame={frame} running={playing} onSelect={selectStage} />
        <div className="bf-scene-controls"><div><button type="button" className="bf-run-button" data-bf-magnet="" onClick={run}><span aria-hidden="true">▷</span>{view.mode === "simulation" ? "Yeniden başlat" : "Akışı başlat"}<small>{reduced ? "STATİK DEMO" : "08s"}</small></button>{view.running && !reduced && <button type="button" className="bf-run-pause" onClick={() => setView(previous => ({ ...previous, running: false }))}>Duraklat Ⅱ</button>}</div><Link className="bf-text-link" to="/contact" data-bf-magnet="">Demo Talep Et <span aria-hidden="true">↗</span></Link></div>
        <div className="bf-scene-event" role="status">{frame ? frame.event : "Bir servis. Bütün operasyon."}<Link to="/features">Ürünü incele ↗</Link></div>
      </div>
      <div className="bf-living-narrative">{storyChapters.map((chapter, index) => <article key={chapter.code} className={view.chapter === index ? "is-active" : ""}><button type="button" className="bf-chapter-select" aria-pressed={stage === chapter.stage} onClick={() => selectStage(chapter.stage)}>{chapter.code} <span aria-hidden="true">↗</span></button><h2>{chapter.title.split("\n").map((line, i) => <span key={line}>{i > 0 && <br />}{line}</span>)}</h2><p>{chapter.text}</p><span className="bf-chapter-path">{chapter.note}</span></article>)}</div>
    </div>
  </section>
}
