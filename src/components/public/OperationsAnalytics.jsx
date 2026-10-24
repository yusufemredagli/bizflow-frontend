import MarketingVisual from "./MarketingVisual.jsx"
import CountUp from "./CountUp.jsx"
import { useState } from "react"

const periods = {
  today: { label: "Bugün", completed: "13", revenue: "₺18.400", sla: "%96", time: "1s 24dk", technicians: [5, 5, 3], wave: "M0 95 L60 95 L100 70 L150 70 L210 42 L270 42 L310 62 L370 22 L430 22 L500 5" },
  week: { label: "Son 7 gün", completed: "87", revenue: "₺124.600", sla: "%94", time: "1s 38dk", technicians: [35, 29, 23], wave: "M0 90 L70 65 L130 80 L200 35 L260 50 L330 20 L400 30 L450 10 L500 0" }
}
export default function OperationsAnalytics() {
  const [selected, setSelected] = useState("today")
  const data = periods[selected]
  return <section className="bf-signal-field" data-bf-reveal="metric"><div className="bf-container"><div className="bf-signal-heading"><span className="bf-label">05 / ÖLÇÜM — AYNI VERİNİN YENİ GÖRÜNÜMÜ</span><h2>Hareket sahadaydı.<br /><em>Sonuç burada.</em></h2><div role="group" aria-label="Demo veri dönemi">{Object.entries(periods).map(([key, period]) => <button type="button" aria-pressed={selected === key} onClick={() => setSelected(key)} key={key}>{period.label}</button>)}</div></div>
    <MarketingVisual kind="analytics" />
    <div className="bf-signal-data"><div className="bf-signal-primary"><span>TAMAMLANAN SERVİS</span><strong><CountUp value={Number(data.completed)} /><small>iş</small></strong><svg viewBox="0 0 500 110" role="img" aria-label={`${data.label} için temsili servis tamamlama sinyali`}><path className="bf-signal-baseline" d="M0 105H500" /><path key={selected} className="bf-signal-wave" pathLength="1" d={data.wave} /></svg><span>DEMO GÖRÜNÜM / TEMSİLİ VERİLER</span></div><dl className="bf-signal-ledger"><div><dt>SLA RİSKİ</dt><dd className="is-risk">03 <small>takipte</small></dd></div><div><dt>SLA BAŞARISI</dt><dd>{data.sla}</dd></div><div><dt>SERVİS GELİRİ</dt><dd>{data.revenue}</dd></div><div><dt>ÖRNEK ORT. TAMAMLANMA</dt><dd>{data.time}</dd></div></dl></div>
    <div className="bf-signal-team"><span>TEKNİSYEN / TAMAMLANAN İŞ</span>{data.technicians.map((value, index) => <div key={index}><span>{["Ahmet K.", "Selin A.", "Mert T."][index]}</span><i><span style={{ transform: `scaleX(${value / Math.max(...data.technicians)})` }} /></i><strong>{value}</strong></div>)}</div><p className="bf-demo-note">Bir servis kaydının ölçüme dönüşmesini anlatan demo. Sayılar müşteri sonucu veya performans taahhüdü değildir.</p>
  </div></section>
}
