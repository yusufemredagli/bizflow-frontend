import { useEffect, useRef } from "react"
import { motionTiming, useInView, useReducedMotion } from "./usePublicMotion.js"

const integerFormat = new Intl.NumberFormat("tr-TR")
const formatInteger = value => integerFormat.format(value)

// One bounded text animation; the final value remains accessible and reserves width.
export default function CountUp({ value, initialValue = 0, format = formatInteger }) {
  const root = useRef(null)
  const number = useRef(null)
  const lastValue = useRef(null)
  const visible = useInView(root)
  const reduced = useReducedMotion()
  const text = format(value)
  useEffect(() => {
    const target = number.current
    if (!visible || reduced || lastValue.current === value) {
      target.textContent = text
      return
    }
    const from = lastValue.current ?? initialValue
    lastValue.current = value
    const started = performance.now()
    let frame
    let lastText
    const draw = now => {
      const progress = Math.min(1, (now - started) / motionTiming.slow)
      const eased = 1 - (1 - progress) ** 3
      const nextText = format(Math.round(from + (value - from) * eased))
      if (nextText !== lastText) { target.textContent = nextText; lastText = nextText }
      if (progress < 1) frame = window.requestAnimationFrame(draw)
    }
    frame = window.requestAnimationFrame(draw)
    return () => { window.cancelAnimationFrame(frame); target.textContent = text }
  }, [visible, reduced, value, initialValue, format, text])
  return <span className="bf-count" ref={root} role="img" aria-label={text}><span className="bf-count-sizer" aria-hidden="true">{text}</span><span className="bf-count-number" ref={number} aria-hidden="true">{text}</span></span>
}
