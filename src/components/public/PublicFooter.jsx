import { Link } from "react-router-dom"
import { PublicWordmark } from "./PublicHeader.jsx"

const copyrightYear = new Date().getFullYear()

export default function PublicFooter() {
  return <footer className="bf-footer" data-bf-reveal="stagger"><div className="bf-container">
    <div className="bf-footer-grid"><div className="bf-footer-brand"><PublicWordmark /><p>Saha ile merkez arasında,<br />işin akışını görünür kılın.</p><span className="bf-label">OPERATIONS CLOUD</span></div>
      <div><h2>Ürün</h2><Link to="/">Genel bakış</Link><Link to="/features">Özellikler</Link><Link to="/solutions">Çözümler</Link></div>
      <div><h2>BizFlow</h2><Link to="/about">Hakkımızda</Link><Link to="/contact">İletişim & demo</Link><Link to="/login">Giriş yap</Link></div>
      <div className="bf-footer-contact"><h2>Birlikte değerlendirelim.</h2><p>Operasyonunuzun bir sonraki<br />adımını konuşalım.</p><a href="mailto:ysufemre66@gmail.com">ysufemre66@gmail.com ↗</a></div>
    </div><div className="bf-footer-bottom"><span>© {copyrightYear} BizFlow. Tüm hakları saklıdır.</span><span>Saha için tasarlandı. Operasyon için geliştirildi.</span></div>
  </div></footer>
}
