import { useRef, useState } from "react"
import { PageIntro } from "../../components/public/PublicSections.jsx"

const contactEmail = "ysufemre66@gmail.com"
export default function Contact() {
  const [prepared, setPrepared] = useState(false)
  const [draft, setDraft] = useState({})
  const [focusedField, setFocusedField] = useState("")
  const emailLink = useRef(null)
  const ready = Boolean(draft.name?.trim() && draft.company?.trim() && draft.message?.trim() && /^[^\s@]+@[^\s@]+$/.test(draft.email || ""))
  const handleSubmit = event => {
    event.preventDefault()
    const messageInput = event.currentTarget.elements.namedItem("message")
    if (!messageInput.value.trim()) {
      messageInput.setCustomValidity("Lütfen operasyon ihtiyacınızı kısaca açıklayın.")
      messageInput.reportValidity()
      return
    }
    const form = new FormData(event.currentTarget)
    const body = `Ad Soyad: ${form.get("name").trim()}\nŞirket: ${form.get("company").trim()}\nE-posta: ${form.get("email").trim()}\nEkip büyüklüğü: ${form.get("team") || "Belirtilmedi"}\n\nOperasyon ihtiyacı:\n${form.get("message").trim()}`
    emailLink.current.href = `mailto:${contactEmail}?subject=${encodeURIComponent("BizFlow demo talebi — " + form.get("company").trim())}&body=${encodeURIComponent(body)}`
    emailLink.current.click()
    setPrepared(true)
  }
  const updateDraft = event => {
    const form = new FormData(event.currentTarget)
    setDraft(Object.fromEntries(form.entries()))
  }
  return <>
    <PageIntro number="05" eyebrow="NEXT OPERATION / DEMO TALEBİ" title={<>İlk sinyal<br /><em>sizden gelsin.</em></>}>Kendi servis senaryonuz üzerinden BizFlow'u inceleyin. Yazdıklarınız aşağıda bir demo talebine dönüşür.</PageIntro>
    <section className="bf-contact-live bf-container">
      <aside className="bf-demo-ticket" aria-label="Demo talebinizin canlı özeti">
        <div className="bf-ticket-top"><span>DEMO REQUEST</span><span role="status">{ready ? "REQUEST READY" : "YENİ TALEP"} <i /></span></div>
        <h2>Bir operasyon<br />başlamak üzere.</h2>
        <dl>{[["NAME", draft.name || "Adınız bekleniyor"], ["COMPANY", draft.company || "Şirketiniz"], ["TEAM", draft.team || "Ekip büyüklüğü"], ["MESSAGE", draft.message || "Saha operasyonunuzu anlatın."]].map(([label,value]) => <div key={label} className={focusedField === ({ NAME: "name", COMPANY: "company", TEAM: "team", MESSAGE: "message" })[label] ? "is-focused" : ""} data-empty={!({ NAME: draft.name, COMPANY: draft.company, TEAM: draft.team, MESSAGE: draft.message })[label]?.trim()}><dt>{label}</dt><dd tabIndex={label === "MESSAGE" ? 0 : undefined}><span key={value} className="bf-ticket-value">{value}</span></dd></div>)}</dl>
        <div className="bf-ticket-route"><span>TALEP</span><i /><span>DEMO GÖRÜŞMESİ</span><span>↗</span></div>
        <p>Özet yalnızca bu sayfada oluşur. Gönderim, e-posta uygulamanızda tamamlanır.</p>
      </aside>
      <div className="bf-contact-form-panel">
        <div className="bf-contact-form-heading"><span className="bf-label">OPERASYON BRİFİ</span><span>FORM / 01</span></div>
        <form onSubmit={handleSubmit} onChange={updateDraft} onFocus={event => setFocusedField(event.target.name || "")} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocusedField("") }} className="bf-contact-form">
          <div className="bf-form-row">
            <label>Ad soyad <span>*</span><input name="name" autoComplete="name" required maxLength={100} pattern=".*\S.*" placeholder="Adınız ve soyadınız" /></label>
            <label>Şirket <span>*</span><input name="company" autoComplete="organization" required maxLength={150} pattern=".*\S.*" placeholder="Şirket adı" /></label>
          </div>
          <div className="bf-form-row">
            <label>E-posta <span>*</span><input type="email" name="email" autoComplete="email" required maxLength={200} placeholder="ad@sirket.com" /></label>
            <label>Saha ekibiniz<select name="team" defaultValue=""><option value="" disabled>Seçiniz (isteğe bağlı)</option><option>1–5 kişi</option><option>6–20 kişi</option><option>21–50 kişi</option><option>50+ kişi</option></select></label>
          </div>
          <label>Operasyonunuz hakkında <span>*</span><textarea name="message" onInput={event => event.currentTarget.setCustomValidity("")} required rows={5} maxLength={1500} placeholder="Hangi servisleri veriyorsunuz? Bugün en çok neyi takip etmekte zorlanıyorsunuz?" /></label>
          <p className="bf-form-note">Bu form, e-posta uygulamanızda bir demo talebi taslağı açar. Göndermeden önce bilgilerinizi gözden geçirebilirsiniz. Bilgileriniz bu sayfada kaydedilmez.</p>
          <button type="submit" className="bf-button">Demo Talebini Hazırla <span aria-hidden="true">↗</span></button>
          <a ref={emailLink} href={`mailto:${contactEmail}`} hidden aria-hidden="true" tabIndex={-1}>E-posta taslağı</a>
          {prepared && <p className="bf-form-status" role="status">E-posta uygulamanızda talebinizi göndererek tamamlayabilirsiniz. Açılmadıysa <a href={`mailto:${contactEmail}`}>doğrudan e-posta yazın</a>. Bu sayfa üzerinden gönderim yapılmadı.</p>}
          <a className="bf-contact-direct" href={`mailto:${contactEmail}`}>{contactEmail} ↗</a>
        </form>
      </div>
    </section>
  </>
}
