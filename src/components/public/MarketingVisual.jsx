import hero from "../../assets/bizflow/bizflow-hero-operations.jpg"
import heroSmall from "../../assets/bizflow/bizflow-hero-operations-720.jpg"
import dispatch from "../../assets/bizflow/bizflow-dispatch-field.jpg"
import dispatchSmall from "../../assets/bizflow/bizflow-dispatch-field-720.jpg"
import analytics from "../../assets/bizflow/bizflow-analytics.jpg"
import analyticsSmall from "../../assets/bizflow/bizflow-analytics-720.jpg"
import chaos from "../../assets/bizflow/bizflow-chaos-to-flow.jpg"
import chaosSmall from "../../assets/bizflow/bizflow-chaos-to-flow-720.jpg"

const visuals = {
  hero: { src: hero, small: heroSmall, width: 1448, height: 815, alt: "Servis talepleri, saha ekipleri ve SLA takibini aynı operasyon merkezinde buluşturan BizFlow ürün illüstrasyonu.", label: "BIZFLOW / CONNECTED OPERATIONS" },
  dispatch: { src: dispatch, small: dispatchSmall, width: 1448, height: 815, alt: "Merkezdeki servis atamasının mobil saha ekibine ve tamamlanan işe bağlanmasını anlatan illüstrasyon.", label: "TALEP → ATAMA → SAHA" },
  analytics: { src: analytics, small: analyticsSmall, width: 1448, height: 815, alt: "Tamamlanan işler, SLA ve servis gelirinin operasyon analizine dönüşmesini anlatan BizFlow illüstrasyonu.", label: "SERVİS KAYDI → OPERASYON ÖZETİ" },
  chaos: { src: chaos, small: chaosSmall, width: 1448, height: 815, alt: "Telefon, mesaj, tablo ve notlardan gelen dağınık bilginin tek BizFlow servis kaydında birleşmesi.", label: "DAĞINIK BİLGİ → TEK SERVİS KAYDI" }
}

export default function MarketingVisual({ kind }) {
  const visual = visuals[kind]
  const eager = kind === "hero"
  return <figure className={`bf-marketing-visual bf-visual-${kind}`} data-bf-reveal={`visual-${kind}`}>
    <div className="bf-visual-window"><img src={visual.src} srcSet={`${visual.small} 720w, ${visual.src} 1448w`} sizes={kind === "analytics" ? "(max-width: 780px) 92vw, 60vw" : "(max-width: 780px) 92vw, (max-width: 1536px) 90vw, 1440px"} width={visual.width} height={visual.height} alt={visual.alt} loading={eager ? "eager" : "lazy"} fetchPriority={eager ? "high" : undefined} decoding="async" /></div>
    {eager && <div className="bf-hero-labels" aria-hidden="true"><span className="bf-hero-label-live"><i /> LIVE OPS / DEMO</span><span className="bf-hero-label-sla">SLA / 96% · TEMSİLİ</span><span className="bf-hero-label-connected">CONNECTED OPERATIONS ↗</span></div>}
    <figcaption><span>{visual.label}</span><span>ÜRÜN İLLÜSTRASYONU · TEMSİLİ GÖRÜNÜM</span></figcaption>
    {kind === "dispatch" && <div className="bf-visual-dispatch-tags" aria-hidden="true"><span><i /> ASSIGNED</span><span>MERKEZ ↔ SAHA <b>↗</b></span></div>}
  </figure>
}
