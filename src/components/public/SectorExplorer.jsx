import { useId, useRef, useState } from "react"
import { Link } from "react-router-dom"
import OperationsCanvas from "./OperationsCanvas.jsx"
import { scenarios } from "./operationsData.js"

export default function SectorExplorer() {
  const [selected, setSelected] = useState(0)
  const [stage, setStage] = useState(1)
  const id = useId()
  const buttons = useRef([])
  const sector = scenarios[selected]
  const navigateTabs = event => {
    const keys = { ArrowDown: (selected + 1) % scenarios.length, ArrowUp: (selected + scenarios.length - 1) % scenarios.length, ArrowRight: (selected + 1) % scenarios.length, ArrowLeft: (selected + scenarios.length - 1) % scenarios.length, Home: 0, End: scenarios.length - 1 }
    if (keys[event.key] === undefined) return
    event.preventDefault()
    setSelected(keys[event.key])
    buttons.current[keys[event.key]].focus()
  }
  return <section className="bf-scenario bf-container" aria-labelledby={`${id}-heading`}>
    <div className="bf-scenario-heading"><span className="bf-label">SCENARIO SWITCHER / AYNI SİSTEM, FARKLI SAHA</span><h2 id={`${id}-heading`}>Sahayı değiştirin.<br /><em>Akışın karşılığını görün.</em></h2></div>
    <div role="tablist" aria-label="Sektör" className="bf-scenario-tabs" data-bf-reveal="stagger" onKeyDown={navigateTabs}>{scenarios.map((item, index) => <button ref={node => { buttons.current[index] = node }} type="button" role="tab" id={`${id}-tab-${index}`} aria-controls={`${id}-panel-${index}`} aria-selected={selected === index} tabIndex={selected === index ? 0 : -1} onClick={() => setSelected(index)} key={item.code}><span>0{index + 1}</span>{item.label}<span aria-hidden="true">↗</span></button>)}</div>
    {scenarios.map((item, index) => <div key={item.code} role="tabpanel" id={`${id}-panel-${index}`} aria-labelledby={`${id}-tab-${index}`} hidden={selected !== index} tabIndex={0} className="bf-scenario-panel">{selected === index && <><OperationsCanvas scenario={sector} stage={stage} onSelect={setStage} /><div className="bf-scenario-brief"><div><span className="bf-label">{sector.code} / ÖRNEK İŞ AKIŞI</span><p>{sector.text}</p><Link className="bf-text-link" to="/contact">Senaryoyu birlikte inceleyelim <span aria-hidden="true">↗</span></Link></div><dl><div><dt>SLA</dt><dd>{sector.sla} saat</dd></div><div><dt>Tamamlanma notu</dt><dd>{sector.note}</dd></div><div><dt>Servis dosyası</dt><dd>{sector.attachment}</dd></div></dl></div></>}</div>)}
  </section>
}
