import { useEffect, useRef, useState } from "react"
import { Link, NavLink, useLocation } from "react-router-dom"

const links = [["/", "Ürün"], ["/features", "Özellikler"], ["/solutions", "Çözümler"], ["/about", "Hakkında"], ["/contact", "İletişim"]]

export function PublicWordmark() {
  return <Link className="bf-wordmark" to="/" aria-label="BizFlow ana sayfa"><span className="bf-brand-icon" aria-hidden="true">B<span /></span><span>BizFlow<span className="bf-wordmark-dot">.</span></span></Link>
}

export default function PublicHeader() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const sentinel = useRef(null)
  const navLinks = useRef(null)
  const { pathname } = useLocation()
  const toggle = useRef(null)
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return
    const observer = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting))
    observer.observe(sentinel.current)
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    const track = navLinks.current
    let frame
    const measure = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => {
        const active = track.querySelector("a.active")
        if (!active) return
        const box = active.getBoundingClientRect()
        const parent = track.getBoundingClientRect()
        track.style.setProperty("--bf-nav-x", `${box.left - parent.left + (box.width - 12) / 2}px`)
        track.setAttribute("data-bf-nav-ready", "true")
      })
    }
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null
    observer?.observe(track)
    window.addEventListener("resize", measure)
    measure()
    return () => { observer?.disconnect(); window.removeEventListener("resize", measure); window.cancelAnimationFrame(frame) }
  }, [pathname, open])
  useEffect(() => {
    const close = () => setOpen(false)
    window.addEventListener("popstate", close)
    return () => window.removeEventListener("popstate", close)
  }, [])
  const closeWithEscape = event => {
    if (event.key !== "Escape" || !open) return
    setOpen(false)
    toggle.current.focus()
  }
  return <>
    <div className="bf-header-sentinel" ref={sentinel} aria-hidden="true" />
    <header className={`bf-header ${scrolled ? "is-scrolled" : ""}`} onKeyDown={closeWithEscape}>
      <div className="bf-container bf-header-inner">
        <PublicWordmark />
        <button ref={toggle} className="bf-menu-toggle" type="button" aria-expanded={open} aria-controls="bf-navigation" onClick={() => setOpen(value => !value)}><span>{open ? "Kapat" : "Menü"}</span><span aria-hidden="true">{open ? "×" : "☰"}</span></button>
        <nav id="bf-navigation" className={`bf-navigation ${open ? "is-open" : ""}`} aria-label="Ana menü">
          <div className="bf-nav-links" ref={navLinks}>{links.map(([to, label]) => <NavLink key={to} to={to} end={to === "/"} onClick={() => setOpen(false)}>{label}</NavLink>)}</div>
          <div className="bf-nav-actions"><Link to="/login" onClick={() => setOpen(false)}>Giriş Yap <span aria-hidden="true">↗</span></Link><Link className="bf-button bf-button-small" data-bf-magnet="" to="/contact" onClick={() => setOpen(false)}>Demo Talep Et <span aria-hidden="true">↗</span></Link></div>
        </nav>
      </div>
    </header>
  </>
}
