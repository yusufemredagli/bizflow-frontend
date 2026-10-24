import CountUp from "./CountUp.jsx"
import { lifecycle, lifecycleLabels, scenarios } from "./operationsData.js"

export function StatusRail({ stage = 0, onSelect }) {
  return <div className="bf-op-rail" style={{ "--bf-rail-progress": Math.min(stage, 4) / 4 }} role={onSelect ? "group" : undefined} aria-label="Servis yaşam döngüsü"><div className="bf-rail-connector" aria-hidden="true"><span /><i /></div>{lifecycle.map((status, index) => onSelect ? <button type="button" key={status} aria-pressed={Math.min(stage, 4) === index} onClick={() => onSelect(index)}><span>0{index + 1}</span>{status.replaceAll("_", " ")}<i /></button> : <span key={status} className={Math.min(stage, 4) === index ? "is-current" : ""}><small>0{index + 1}</small>{status.replaceAll("_", " ")}<i /></span>)}</div>
}

export default function OperationsCanvas({ stage = 0, scenario = scenarios[0], frame, running = false, focus = "", onSelect }) {
  const state = Math.min(stage, 4)
  const assigned = stage >= 1 && (!frame || frame.at >= 3800)
  const matched = frame ? frame.at >= 2500 : stage >= 1
  const connected = frame ? frame.at >= 3200 : stage >= 1
  const selecting = frame ? frame.at >= 2500 && frame.at < 4800 : stage === 1
  const slaStarted = !frame || frame.at >= 1800
  const phase = frame?.phase ?? "story"
  const completed = stage >= 4
  const measured = stage === 5
  const risk = !completed && (frame ? frame.progress <= .4 : stage === 3)
  const remaining = frame?.progress ?? [1, .85, .62, .32, .2, .2][stage]
  const [hours, minutes] = scenario.sla.split(":").map(Number)
  const remainingMinutes = Math.round((hours * 60 + minutes) * remaining)
  const scenarioClock = `${String(Math.floor(remainingMinutes / 60)).padStart(2, "0")}:${String(remainingMinutes % 60).padStart(2, "0")}`
  const clock = frame?.clock ?? scenarioClock
  const landmark = ratio => {
    const value = Math.round((hours * 60 + minutes) * ratio)
    return `${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`
  }
  return <div className={`bf-op-canvas bf-op-stage-${stage} ${connected ? "is-connected" : ""} ${selecting ? "is-selecting" : ""} ${slaStarted ? "is-sla-started" : ""} ${assigned ? "is-assigned" : ""} ${matched ? "is-matched" : ""} ${running ? "is-running" : ""} ${risk ? "is-risk" : ""} ${focus ? `bf-op-focus-${focus}` : ""}`} data-phase={phase}>
    <div className="bf-op-coordinates"><span>ZONE / 34.01</span><span>SR–0214 · DEMO GÖRÜNÜM</span><span>FIELD OPERATIONS SYSTEM</span></div>
    <div className="bf-op-space">
      <svg className="bf-op-routes" viewBox="0 0 1000 550" preserveAspectRatio="none" aria-hidden="true"><path className="bf-op-route-base" d="M130 290 C250 290 260 240 440 270 S600 140 750 130 M440 270 Q600 460 740 440" /><path className="bf-op-route-customer" pathLength="1" d="M130 290 C250 290 260 240 440 270" /><path className="bf-op-route-assignment" pathLength="1" d="M440 270 C590 310 600 140 750 130" /><path className="bf-op-route-result" pathLength="1" d="M440 270 Q600 460 740 440" /><path className="bf-op-route-ghost" d="M440 270 Q250 120 100 90 M440 270 Q600 350 850 300" /><circle className="bf-op-junction" cx="440" cy="270" r="5" /><path className="bf-op-data-pulse" pathLength="1" d={assigned ? "M130 290 C250 290 260 240 440 270 S600 140 750 130" : "M130 290 C250 290 260 240 440 270"} /></svg>
      <div className="bf-op-customer bf-op-node"><span className="bf-op-node-point">C</span><div><span className="bf-op-node-index">CUSTOMER / 01</span><strong>{scenario.customer}</strong><small>{frame ? completed ? "SERVİS KAPATILDI ✓" : assigned ? "EKİP BAĞLANDI" : matched ? "TEKNİSYEN EŞLEŞTİ" : slaStarted ? "TALEP TAKİPTE" : "TALEP ALINDI" : "Yeni servis talebi"} <i /></small></div></div>
      <div className="bf-op-service bf-op-node" data-bf-cursor="AKIŞI GÖR →">
        <div className="bf-op-card-float"><div className="bf-op-service-content" data-bf-depth="">
          <div className="bf-op-service-meta"><span>SR–0214</span><span className={scenario.priority === "Acil" || (frame && frame.priority !== "NORMAL") ? "is-priority" : ""}>{frame ? frame.priority || "HIGH" : scenario.priority}</span></div>
          <span className="bf-op-card-purpose">{measured ? "TAMAMLANAN SERVİS" : completed ? "COMPLETION SUMMARY" : assigned ? "FIELD OPERATION" : matched ? "TECHNICIAN MATCHED" : selecting ? "DISPATCH / SELECTING" : "NEW SERVICE SIGNAL"}</span>
          <h3>{measured ? <><CountUp value={13} initialValue={12} /><small> +1</small></> : completed ? "İş tamamlandı." : scenario.request}</h3>
          <span className="bf-op-service-status"><i />{lifecycle[state]}</span>
          <p key={frame?.event ?? state} className={frame ? "bf-op-event-change" : undefined}>{frame?.event ?? lifecycleLabels[state]}</p>
          {completed && <div className="bf-op-completion-note"><span>{scenario.request}</span><p>{scenario.note}</p><small>{scenario.attachment}</small></div>}
          {completed && <div className="bf-op-insight-values"><div><span>SERVİS ÜCRETİ</span><strong>₺<CountUp value={1400} /></strong></div><div><span>TAMAMLANMA</span><strong>1s 24dk</strong></div><div><span>SLA SONUCU</span><strong>Zamanında ✓</strong></div></div>}
        </div></div>
      </div>
      <div className="bf-op-technician bf-op-node"><span className="bf-op-tech-avatar">{scenario.initials}</span><div><span className="bf-op-node-index">TECHNICIAN / 03</span><strong>{scenario.technician}</strong><small>{completed ? "İŞ TAMAMLANDI" : stage === 3 ? "IN PROGRESS / SAHADA" : stage === 2 ? "ON THE WAY / YOLDA" : assigned ? "ASSIGNED / SORUMLU" : matched ? "SELECTED / EŞLEŞTİ" : selecting ? "MATCHING / İNCELENİYOR" : "AVAILABLE / DEMO"}</small></div></div>
      <div className="bf-op-candidates" aria-label="Temsili teknisyen seçenekleri"><span>ÖRNEK EKİP DURUMLARI / DEMO</span><div><span className="bf-candidate-avatar">MB</span><strong>Mehmet B.<small>BUSY</small></strong><i /></div><div><span className="bf-candidate-avatar">SD</span><strong>Selin D.<small>EN ROUTE</small></strong><i /></div><div className={matched ? "is-selected" : ""}><span className="bf-candidate-avatar">{scenario.initials}</span><strong>{scenario.technician}<small>{assigned ? "ASSIGNED ↗" : matched ? "SELECTED ✓" : "AVAILABLE"}</small></strong><i /></div></div>
      <div className="bf-op-sla" data-bf-cursor="SÜREYİ İNCELE →"><span className="bf-sla-landmark bf-sla-start">{scenario.sla}</span><span className="bf-sla-landmark bf-sla-mid">{landmark(.75)}</span><span className="bf-sla-landmark bf-sla-end">{landmark(.25)}</span><svg viewBox="0 0 180 180" aria-hidden="true"><circle className="bf-op-sla-base" cx="90" cy="90" r="70" /><circle className="bf-op-sla-ticks" cx="90" cy="90" r="81" /><circle className="bf-op-sla-remaining" pathLength="1" cx="90" cy="90" r="70" style={{ strokeDashoffset: `var(--bf-sla-offset, ${1 - remaining})` }} /></svg><div><span>{completed ? "SLA / KORUNDU" : !slaStarted ? "SLA / HAZIR" : risk ? "SLA / RİSK" : "SLA / KALAN"}</span><strong>{completed ? "✓" : clock}</strong><small>{completed ? "ZAMANINDA" : "TEMSİLİ SAAT"}</small></div></div>
      <div className="bf-op-axis" aria-hidden="true"><span>REQUEST</span><span>DISPATCH</span><span>FIELD</span><span>INSIGHT</span></div>
    </div>
    <StatusRail stage={stage} onSelect={onSelect} />
    <div className="bf-op-caption"><span>{measured ? "OPERATIONS BECOME INSIGHT" : "MERKEZ ↔ SAHA / ORTAK SERVİS KAYDI"}</span><span>Temsili veriler · Gerçek zamanlı veri değildir</span></div>
  </div>
}
