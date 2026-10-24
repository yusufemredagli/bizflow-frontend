import { Link } from "react-router-dom"

export function PublicCTA() {
  return <section className="bf-final-operation" data-bf-reveal="final"><svg className="bf-final-routes" viewBox="0 0 1400 700" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M0 550C250 550 160 100 550 100S950 600 1400 300" /><path pathLength="1" d="M0 600C300 600 400 200 800 200S1100 500 1400 400" /></svg><div className="bf-container"><div className="bf-final-signal"><span /><span /><span /><i /></div><span className="bf-label">NEXT SIGNAL / SİZİN OPERASYONUNUZ</span><h2>Bir sonraki akışı<br /><em>birlikte açalım.</em></h2><div><p>BizFlow’u kendi servis senaryonuz üzerinden inceleyin.</p><Link className="bf-button" data-bf-magnet="" to="/contact">Demo Talep Et <span aria-hidden="true">↗</span></Link></div><span className="bf-final-index">BIZFLOW / FIELD OPERATIONS SYSTEM — READY</span></div></section>
}
export function PageIntro({ number, eyebrow, title, children }) {
  return <section className="bf-page-intro bf-container" data-bf-reveal="intro"><div className="bf-section-label"><span className="bf-label">{eyebrow}</span><span>SYSTEM / {number}</span></div><h1>{title}</h1><p>{children}</p></section>
}
