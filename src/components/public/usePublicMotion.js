import { useEffect, useState, useSyncExternalStore } from "react"

export const motionTiming = { fast: 160, medium: 360, slow: 800, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }

const query = "(prefers-reduced-motion: reduce)"
const subscribe = callback => {
  const media = window.matchMedia(query)
  media.addEventListener("change", callback)
  return () => media.removeEventListener("change", callback)
}
const getSnapshot = () => window.matchMedia(query).matches
const getServerSnapshot = () => true

export function useReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

export function useInView(ref) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (!("IntersectionObserver" in window)) {
      // Motion stays off when visibility cannot be determined.
      return
    }
    let intersecting = false
    const update = () => setVisible(intersecting && !document.hidden)
    const observer = new IntersectionObserver(([entry]) => {
      intersecting = entry.isIntersecting
      update()
    }, { threshold: 0.15 })
    observer.observe(node)
    document.addEventListener("visibilitychange", update)
    return () => {
      observer.disconnect()
      document.removeEventListener("visibilitychange", update)
    }
  }, [ref])
  return visible
}
