import MarketingVisual from "../../components/public/MarketingVisual.jsx"
import SystemExperience from "../../components/public/SystemExperience.jsx"
import OperationsAnalytics from "../../components/public/OperationsAnalytics.jsx"
import SectorExplorer from "../../components/public/SectorExplorer.jsx"
import { PublicCTA } from "../../components/public/PublicSections.jsx"

export default function Home() {
  return <>
    <SystemExperience />
    <section className="bf-memory bf-container"><div className="bf-memory-heading"><span className="bf-label">04 → 05 / SERVICE MEMORY</span><h2 data-bf-reveal="text">Bir sonraki iş,<br /><em>sıfırdan başlamaz.</em></h2><p>İşlem raporu, kullanılan malzeme ve saha dosyası; müşterinin servis geçmişine bağlanır.</p></div><div className="bf-memory-record" data-bf-reveal="card"><div><span>ATLAS ÜRETİM / MÜŞTERİ GEÇMİŞİ</span><span>SR–0214</span></div><h3>Cihaz arıza kontrolü</h3><p>Arıza giderildi. Çalışma testi yapıldı.<br />İşlem ve kullanılan parçalar kayıt altına alındı.</p><ul><li><span>01</span>İşlem raporu <span>↗</span></li><li><span>02</span>Saha fotoğrafı <span>↗</span></li><li><span>03</span>Malzeme kaydı <span>↗</span></li></ul><span className="bf-label">TEMSİLİ KAYIT / COMPLETED ✓</span></div></section>
    <section className="bf-container bf-dispatch-story" aria-label="Talepten saha operasyonuna"><div className="bf-dispatch-visual-heading"><span className="bf-label">02 → 03 / CONNECTED FIELD</span><h2>Talep merkezde.<br /><em>Hareket sahada.</em></h2></div><MarketingVisual kind="dispatch" /></section>
    <OperationsAnalytics />
    <section className="bf-role-system bf-container" data-bf-reveal="line"><div><span className="bf-label">TEK SİSTEM / ÜÇ SORUMLULUK</span><h2>Herkes aynı işi<br /><em>aynı yerden görmez.</em></h2></div><div>{[["OWNER", "Bütünü görür.", "Şirket sahibi operasyon özetini ve sonuçları izler."],["MANAGER", "Akışı kurar.", "Yönetici talepleri, müşterileri ve ekip atamalarını yönetir."],["TECHNICIAN", "Sahada ilerletir.", "Teknisyen kendisine atanmış işleri görür ve servisi yürütür."]].map(([role,title,text]) => <article key={role}><span>{role}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
    <SectorExplorer /><PublicCTA />
  </>
}
