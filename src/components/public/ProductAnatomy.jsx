import { useState } from "react"
import OperationsCanvas from "./OperationsCanvas.jsx"

const parts = [
  { id: "service", name: "Servis", stage: 0, title: "Sistemin ortak referansı.", text: "Talep, öncelik, durum ve sorumlu aynı servis kaydında tutulur. Arama ve filtrelerle doğru işe ulaşılır." },
  { id: "customer", name: "Müşteri", stage: 0, title: "Her yeni iş, bir geçmişe bağlanır.", text: "Müşteri iletişim bilgisi ve önceki servisleri, yeni talebin bağlamını oluşturur." },
  { id: "technician", name: "Teknisyen", stage: 1, title: "Atama, sorumluluğa dönüşür.", text: "Yönetici servisi teknisyene atar. Teknisyen kendi iş listesine ve ilgili servis bilgilerine ulaşır." },
  { id: "sla", name: "SLA & randevu", stage: 3, title: "Zaman da operasyonun bir parçası.", text: "Randevu ile servis planlanır. SLA süresi, risk ve gecikme görünürlüğüyle birlikte takip edilir." },
  { id: "records", name: "Rapor & dosya", stage: 4, title: "Sonuç, yalnızca bir durum değildir.", text: "İşlem notları, kullanılan malzemeler, servis ücreti ve fotoğraf/PDF dosyaları aynı servis kaydına bağlanır." },
  { id: "audit", name: "Aktivite", stage: 4, title: "İşin izini kaybetmeyin.", text: "Servis aktivite geçmişi, operasyonun hangi adımlardan geçtiğini görünür tutar." },
  { id: "analytics", name: "Analitik", stage: 5, title: "Aynı işe, bu kez bütünden bakın.", text: "Dashboard, tarih aralığı, servis geliri ve SLA özeti üzerinden operasyonu değerlendirin." }
]
export default function ProductAnatomy() {
  const [selected, setSelected] = useState(0)
  const part = parts[selected]
  return <section className="bf-anatomy bf-container" aria-labelledby="bf-anatomy-title">
    <div className="bf-anatomy-heading"><span className="bf-label">SYSTEM MAP / CONNECTED MODULES</span><h2 id="bf-anatomy-title">Bir çekirdek.<br /><em>Birbirine bağlı parçalar.</em></h2></div>
    <div className="bf-anatomy-orbit" data-bf-reveal="map" role="group" aria-label="Ürün modülleri">
      <svg viewBox="0 0 400 500" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M200 230V50 M200 230L340 100 M200 230L350 300 M200 230L260 440 M200 230L100 440 M200 230L45 300 M200 230L50 100" /></svg>
      <div className="bf-anatomy-core"><span>B.</span><strong>BIZFLOW CORE</strong><small>SERVİS KAYDI</small></div>
      {parts.map((item, index) => <button type="button" className={`bf-anatomy-module bf-module-${index}`} key={item.id} aria-pressed={selected === index} onPointerEnter={event => { if (event.pointerType === "mouse") setSelected(index) }} onFocus={() => setSelected(index)} onClick={() => setSelected(index)}><span>0{index + 1}</span>{["SERVICE", "CUSTOMER", "TEAM", "SLA", "FILES", "AUDIT", "ANALYTICS"][index]}<i /></button>)}
    </div>
    <div className="bf-anatomy-system"><OperationsCanvas stage={part.stage} focus={part.id} /><div key={part.id} className="bf-anatomy-caption" aria-live="polite"><span className="bf-label">SYSTEM / 0{selected + 1}</span><h3>{part.title}</h3><p>{part.text}</p></div></div>
  </section>
}
