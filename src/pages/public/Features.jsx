import ProductAnatomy from "../../components/public/ProductAnatomy.jsx"
import { PageIntro, PublicCTA } from "../../components/public/PublicSections.jsx"

export default function Features() {
  return <><PageIntro number="02" eyebrow="PRODUCT ANATOMY / BAĞLANTILI BİR SİSTEM" title={<>Bir özellik listesi değil.<br /><em>Bir operasyon anatomisi.</em></>}>Servis merkezde. Müşteri, teknisyen, SLA, dosyalar ve analitik onun etrafında. Bir parçayı seçin; işin bütünüyle ilişkisini görün.</PageIntro><ProductAnatomy /><section className="bf-feature-register bf-container"><span className="bf-label">SİSTEMİN KAYIT DEFTERİ</span>{[["01", "Planlama", "Randevu tarihleri ve SLA ile servislerin zaman boyutunu takip edin."],["02", "Tamamlanma", "Yapılan işlem, malzemeler, müşteri notu ve servis ücretini kayda dönüştürün."],["03", "Dosyalar", "Fotoğraf ve PDF belgelerini ilgili servis kaydında tutun."],["04", "Aktivite", "Servis geçmişi ve dashboard üzerinden operasyonun izini sürün."]].map(([number,title,text]) => <article key={number}><span>{number}</span><h2>{title}</h2><p>{text}</p></article>)}</section><PublicCTA /></>
}
