import { useEffect } from "react"
import { Outlet, useLocation } from "react-router-dom"
import TactileSurface from "./TactileSurface.jsx"
import PublicHeader from "./PublicHeader.jsx"
import PublicFooter from "./PublicFooter.jsx"
import "./public.css"

const metadata = {
  "/": ["Saha servis operasyon yönetimi", "Servis talepleri, ekip atamaları, SLA ve müşteri geçmişi. Saha operasyonunuzu BizFlow ile tek merkezden yönetin."],
  "/features": ["Özellikler", "Servis yönetimi, teknisyen atama, SLA, müşteri geçmişi ve operasyon analitiğini keşfedin."],
  "/solutions": ["Çözümler", "Teknik servis, bakım ve saha ekipleri için BizFlow operasyon yönetimi."],
  "/about": ["Hakkında", "BizFlow'un saha ve merkez ekiplerini ortak bir operasyon akışında buluşturan ürün yaklaşımı."],
  "/contact": ["Demo & iletişim", "Saha servis süreçleriniz için BizFlow demo görüşmesi talep edin."]
}
export default function PublicLayout() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    const oldTitle = document.title
    const [title, description] = metadata[pathname] || metadata["/"]
    document.title = `${title} | BizFlow`
    const existing = document.querySelector('meta[name="description"]')
    const meta = existing || document.createElement("meta")
    const oldDescription = meta.getAttribute("content")
    meta.name = "description"
    meta.content = description
    if (!existing) document.head.appendChild(meta)
    return () => {
      document.title = oldTitle
      if (!existing) meta.remove()
      else if (oldDescription === null) meta.removeAttribute("content")
      else meta.content = oldDescription
    }
  }, [pathname])
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const target = hash && document.getElementById(hash.slice(1))
      if (target) target.scrollIntoView({ block: "start" })
      else window.scrollTo(0, 0)
    })
    return () => window.cancelAnimationFrame(frame)
  }, [pathname, hash])
  return <TactileSurface><a className="bf-skip-link" href="#bf-main">İçeriğe geç</a><PublicHeader /><main id="bf-main" tabIndex={-1}><div className="bf-route-entrance" key={pathname}><Outlet /></div></main><PublicFooter /></TactileSurface>
}
