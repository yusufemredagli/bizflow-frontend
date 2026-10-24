import SectorExplorer from "../../components/public/SectorExplorer.jsx"
import { PageIntro, PublicCTA } from "../../components/public/PublicSections.jsx"

export default function Solutions() {
  return <><PageIntro number="03" eyebrow="SCENARIO LAB / SAHADAKİ KARŞILIĞI" title={<>Aynı sistem.<br /><em>Başka bir saha.</em></>}>Bir sektör seçin. Talep, öncelik, teknisyen, SLA ve tamamlanma kaydı aynı operasyon yüzeyinde değişsin.</PageIntro><SectorExplorer /><PublicCTA /></>
}
