import { useEffect, useRef } from "react"
import { useLocation } from "react-router-dom"
import { useReducedMotion } from "./usePublicMotion.js"

export default function TactileSurface({ children }) {
  const root = useRef(null)
  const label = useRef(null)
  const reduced = useReducedMotion()
  const { pathname } = useLocation()
  useEffect(() => {
    const surface = root.current
    if (reduced || !("IntersectionObserver" in window)) return
    const assigned = []
    // Reuse existing semantic groups; keep content visible before observer setup.
    for (const node of surface.querySelectorAll(".bf-feature-register article, .bf-manifesto article, .bf-role-system article, .bf-memory-heading, .bf-anatomy-heading, .bf-scenario-heading")) {
      if (node.hasAttribute("data-bf-reveal")) continue
      node.dataset.bfReveal = node.matches("article") ? "detail" : "text"
      assigned.push(node)
    }
    const targets = [...surface.querySelectorAll("[data-bf-reveal]")]
    const staggered = []
    for (const group of surface.querySelectorAll('[data-bf-reveal="stagger"], [data-bf-reveal="map"]')) {
      const items = group.matches("footer") ? group.querySelectorAll(".bf-footer-grid > div") : group.querySelectorAll(":scope > button")
      items.forEach((node, index) => { node.style.setProperty("--bf-item-delay", `${Math.min(index, 5) * 50}ms`); staggered.push(node) })
    }
    targets.forEach(node => node.classList.add("bf-motion-ready"))
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        entry.target.classList.toggle("is-inview", entry.isIntersecting)
        if (entry.isIntersecting) entry.target.classList.add("is-revealed")
      }
    }, { threshold: 0.12 })
    targets.forEach(node => observer.observe(node))
    const visibility = () => surface.toggleAttribute("data-bf-motion-paused", document.hidden)
    visibility()
    document.addEventListener("visibilitychange", visibility)
    return () => {
      observer.disconnect()
      document.removeEventListener("visibilitychange", visibility)
      surface.removeAttribute("data-bf-motion-paused")
      targets.forEach(node => node.classList.remove("bf-motion-ready", "is-inview"))
      assigned.forEach(node => node.removeAttribute("data-bf-reveal"))
      staggered.forEach(node => node.style.removeProperty("--bf-item-delay"))
    }
  }, [pathname, reduced])

  useEffect(() => {
    const fine = window.matchMedia("(min-width: 781px) and (hover: hover) and (pointer: fine)")
    if (reduced) return
    const visuals = [...root.current.querySelectorAll(".bf-visual-hero, .bf-visual-dispatch")]
    let frame
    const update = () => {
      frame = undefined
      const positions = visuals.map(node => {
        const rect = node.getBoundingClientRect()
        return fine.matches && rect.bottom > 0 && rect.top < window.innerHeight
          ? Math.max(-8, Math.min(8, (window.innerHeight / 2 - rect.top - rect.height / 2) * .025)) : 0
      })
      visuals.forEach((node, index) => node.style.setProperty("--bf-visual-y", `${positions[index]}px`))
    }
    const schedule = () => { if (frame === undefined) frame = window.requestAnimationFrame(update) }
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    schedule()
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      visuals.forEach(node => node.style.removeProperty("--bf-visual-y"))
    }
  }, [pathname, reduced])

  useEffect(() => {
    const fine = window.matchMedia("(min-width: 781px) and (hover: hover) and (pointer: fine)")
    if (reduced || !fine.matches) return
    const surface = root.current
    let active
    let activeScene
    let frame
    let pointer
    const clear = () => {
      window.cancelAnimationFrame(frame)
      frame = undefined
      if (active) {
        for (const key of ["--bf-mx", "--bf-my", "--bf-rx", "--bf-ry"]) active.style.removeProperty(key)
        active = undefined
      }
      if (activeScene) {
        for (const key of ["--bf-grid-x", "--bf-grid-y", "--bf-tech-x", "--bf-tech-y", "--bf-service-x", "--bf-service-y"]) activeScene.style.removeProperty(key)
        activeScene.classList.remove("bf-pointer-active")
        activeScene = undefined
      }
      label.current?.classList.remove("is-visible")
      label.current?.style.removeProperty("transform")
    }
    const draw = () => {
      frame = undefined
      if (!pointer || !fine.matches) return clear()
      const target = pointer.target.closest("[data-bf-magnet], [data-bf-depth]")
      if (active !== target) { clear(); active = target }
      const scene = pointer.target.closest(".bf-living-canvas")
      if (activeScene && activeScene !== scene) {
        for (const key of ["--bf-grid-x", "--bf-grid-y", "--bf-tech-x", "--bf-tech-y", "--bf-service-x", "--bf-service-y"]) activeScene.style.removeProperty(key)
        activeScene.classList.remove("bf-pointer-active")
      }
      activeScene = scene
      const sceneRect = scene?.getBoundingClientRect()
      const rect = target?.getBoundingClientRect()
      if (target) {
        const x = Math.max(-1, Math.min(1, (pointer.x - rect.left) / rect.width * 2 - 1))
        const y = Math.max(-1, Math.min(1, (pointer.y - rect.top) / rect.height * 2 - 1))
        const magnitude = Math.max(1, Math.hypot(x, y))
        const distance = scene && target.hasAttribute("data-bf-depth") ? 0 : 4
        target.style.setProperty("--bf-mx", `${x / magnitude * distance}px`)
        target.style.setProperty("--bf-my", `${y / magnitude * distance}px`)
        target.style.setProperty("--bf-rx", `${-y * 1.5}deg`)
        target.style.setProperty("--bf-ry", `${x * 1.5}deg`)
      }
      if (sceneRect) {
        const x = Math.max(-1, Math.min(1, (pointer.x - sceneRect.left) / sceneRect.width * 2 - 1))
        const y = Math.max(-1, Math.min(1, (pointer.y - sceneRect.top) / sceneRect.height * 2 - 1))
        const magnitude = Math.max(1, Math.hypot(x, y))
        for (const [name, distance] of [["grid", 2], ["tech", 3], ["service", 5]]) {
          scene.style.setProperty(`--bf-${name}-x`, `${x / magnitude * distance}px`)
          scene.style.setProperty(`--bf-${name}-y`, `${y / magnitude * distance}px`)
        }
        scene.classList.add("bf-pointer-active")
      }
      const companion = pointer.target.closest("[data-bf-cursor]")
      if (companion) {
        label.current.textContent = companion.dataset.bfCursor
        const box = label.current.getBoundingClientRect()
        const x = Math.max(8, Math.min(pointer.x + 16, document.documentElement.clientWidth - box.width - 8))
        const y = Math.max(8, Math.min(pointer.y + 18, window.innerHeight - box.height - 8))
        label.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
        label.current.classList.add("is-visible")
      } else label.current.classList.remove("is-visible")
    }
    const move = event => {
      if (event.pointerType !== "mouse") return
      pointer = { x: event.clientX, y: event.clientY, target: event.target }
      if (frame === undefined) frame = window.requestAnimationFrame(draw)
    }
    surface.addEventListener("pointermove", move)
    surface.addEventListener("pointerleave", clear)
    window.addEventListener("scroll", clear, { passive: true })
    window.addEventListener("blur", clear)
    window.addEventListener("resize", clear)
    return () => {
      clear()
      surface.removeEventListener("pointermove", move)
      surface.removeEventListener("pointerleave", clear)
      window.removeEventListener("scroll", clear)
      window.removeEventListener("blur", clear)
      window.removeEventListener("resize", clear)
    }
  }, [reduced, pathname])
  return <div ref={root} className="bf-public">{children}<div ref={label} className="bf-cursor-companion" aria-hidden="true" /></div>
}
