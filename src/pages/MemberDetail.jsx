import {
  useCallback,
  useEffect,
  useRef,
  useState
} from "react"

import {
  useNavigate,
  useParams
} from "react-router-dom"

import AppLayout from "../components/layout/AppLayout.jsx"

import {
  getMember
} from "../services/api.js"

import {
  initials,
  roleLabel,
  statusLabel,
  priorityLabel,
  formatDate,
  formatDateTime,
  serviceCode,
  getSlaState
} from "../utils/format.js"

import {
  useToast
} from "../context/ToastContext.jsx"


function MemberDetail() {
  const { id } =
    useParams()

  const navigate =
    useNavigate()

  const { showToast } =
    useToast()


  const [
    member,
    setMember
  ] = useState(null)

  const [
    summary,
    setSummary
  ] = useState(null)

  const [
    requests,
    setRequests
  ] = useState([])

  const [
    loading,
    setLoading
  ] = useState(true)


  const loadVersion = useRef(0)
  useEffect(() => () => { loadVersion.current += 1 }, [])

  const load = useCallback(async () => {
    const version = ++loadVersion.current
    try {
      setLoading(true)

      const response =
        await getMember(id)

      if (version !== loadVersion.current) return

      setMember(
        response.data.member
      )

      setSummary(
        response.data.summary
      )

      setRequests(
        response.data
          .assignedRequests ||
          []
      )

    } catch (error) {
      if (version !== loadVersion.current) return
      showToast(
        error.message,
        "error"
      )
    } finally {
      if (version === loadVersion.current) setLoading(false)
    }
  }, [id, showToast])


  useEffect(() => {
    setMember(null)
    load()
    return () => { loadVersion.current += 1 }
  }, [load])


  if (loading) {
    return (
      <div className="app-loading">
        Çalışan detayı yükleniyor...
      </div>
    )
  }


  if (
    !member ||
    !summary
  ) {
    return (
      <div className="app-loading">
        Çalışan bulunamadı.
      </div>
    )
  }


  return (
    <AppLayout
      active="members"
      eyebrow={
        memberCode(
          member.id
        )
      }
      title={
        member.user.name
      }
      description="Çalışanın saha performansını, iş yükünü ve servis geçmişini yönetin."
      action={
        <button
          className="secondary-button"
          onClick={() =>
            navigate(
              "/members"
            )
          }
        >
          ← Çalışanlara dön
        </button>
      }
    >

      <section className="member-detail-header panel">

        <div className="member-profile-main">

          <div className="member-profile-avatar">
            {initials(
              member.user.name
            )}
          </div>


          <div>

            <span className="panel-kicker">
              Çalışan Profili
            </span>

            <h2>
              {member.user.name}
            </h2>

            <div className="member-profile-meta">

              <span>
                {member.user.email}
              </span>

              <span className="role-badge">
                {roleLabel(
                  member.role
                )}
              </span>

            </div>

          </div>

        </div>


        <div className="member-status-block">

          <span>
            Durum
          </span>

          <strong>
            Aktif
          </strong>

        </div>

      </section>


      <section className="customer-metrics-grid">

        <MemberMetric
          label="Toplam Atama"
          value={
            summary.totalAssigned
          }
          note="Tüm zamanlar"
        />


        <MemberMetric
          label="Aktif İş"
          value={
            summary.activeRequests
          }
          note="Devam eden operasyon"
        />


        <MemberMetric
          label="Tamamlanan"
          value={
            summary.completedRequests
          }
          note={`${summary.completionRate}% tamamlanma oranı`}
        />


        <MemberMetric
          label="Üretilen Ciro"
          value={
            formatCurrency(
              summary.totalRevenue
            )
          }
          note="Tamamlanan servislerden"
        />

      </section>


      <div className="member-detail-grid">

        <section className="panel member-request-panel">

          <div className="panel-header">

            <div>

              <span className="panel-kicker">
                İş Geçmişi
              </span>

              <h2>
                Atanan servisler
              </h2>

            </div>


            <span className="customer-service-count">
              {requests.length} iş
            </span>

          </div>


          <div className="table-wrap">

            <table className="service-table">

              <thead>
                <tr>
                  <th>Talep</th>
                  <th>Müşteri</th>
                  <th>Durum</th>
                  <th>Öncelik</th>
                  <th>Randevu</th>
                  <th>SLA</th>
                  <th>Ücret</th>
                </tr>
              </thead>


              <tbody>

                {requests.length ===
                0 ? (

                  <tr>
                    <td colSpan="7">
                      Bu çalışana atanmış servis bulunmuyor.
                    </td>
                  </tr>

                ) : (

                  requests.map(
                    request => {
                      const slaState =
                        getSlaState(
                          request.slaDeadline,
                          request.status
                        )

                      return (
                        <tr
                          key={
                            request.id
                          }
                          className="clickable-row"
                          onClick={() =>
                            navigate(
                              `/service-requests/${request.id}`
                            )
                          }
                        >

                          <td>

                            <div className="table-primary">

                              <strong>
                                {request.title}
                              </strong>

                              <span>
                                {serviceCode(
                                  request.id
                                )}
                              </span>

                            </div>

                          </td>


                          <td>

                            <div className="table-primary">

                              <strong>
                                {request.customer
                                  ?.name ||
                                  "-"}
                              </strong>

                              <span>
                                {request.customer
                                  ?.phone ||
                                  ""}
                              </span>

                            </div>

                          </td>


                          <td>

                            <span
                              className={`status-badge ${request.status?.toLowerCase()}`}
                            >
                              {statusLabel(
                                request.status
                              )}
                            </span>

                          </td>


                          <td>

                            <span
                              className={`priority-badge ${request.priority?.toLowerCase()}`}
                            >
                              {priorityLabel(
                                request.priority
                              )}
                            </span>

                          </td>


                          <td>
                            {formatDateTime(
                              request.scheduledAt
                            )}
                          </td>


                          <td>

                            <span
                              className={`sla-badge ${slaState.key}`}
                            >
                              {slaState.label}
                            </span>

                          </td>


                          <td>
                            {formatCurrency(
                              request.serviceFee
                            )}
                          </td>

                        </tr>
                      )
                    }
                  )

                )}

              </tbody>

            </table>

          </div>

        </section>


        <aside className="member-detail-side">

          <section className="panel">

            <div className="panel-header compact">

              <div>

                <span className="panel-kicker">
                  Operasyon
                </span>

                <h2>
                  İş yükü
                </h2>

              </div>

            </div>


            <div className="operation-info-list">

              <MemberInfo
                label="Bugünkü Randevular"
                value={
                  summary.todayAppointments
                }
              />

              <MemberInfo
                label="SLA Riski"
                value={
                  summary.slaRiskRequests
                }
              />

              <MemberInfo
                label="Geciken"
                value={
                  summary.overdueRequests
                }
              />

              <MemberInfo
                label="İptal"
                value={
                  summary.cancelledRequests
                }
              />

              <MemberInfo
                label="Tamamlanma Oranı"
                value={`${summary.completionRate}%`}
              />

            </div>

          </section>


          <section className="panel">

            <div className="panel-header compact">

              <div>

                <span className="panel-kicker">
                  Profil
                </span>

                <h2>
                  Çalışan bilgileri
                </h2>

              </div>

            </div>


            <div className="customer-contact-list">

              <MemberContact
                label="Ad Soyad"
                value={
                  member.user.name
                }
              />

              <MemberContact
                label="E-posta"
                value={
                  member.user.email
                }
              />

              <MemberContact
                label="Rol"
                value={
                  roleLabel(
                    member.role
                  )
                }
              />

              <MemberContact
                label="Katılım"
                value={
                  formatDate(
                    member.createdAt
                  )
                }
              />

              <MemberContact
                label="Son Tamamlama"
                value={
                  formatDateTime(
                    summary.lastCompletedAt
                  )
                }
              />

            </div>

          </section>

        </aside>

      </div>

    </AppLayout>
  )
}


function MemberMetric({
  label,
  value,
  note
}) {
  return (
    <article className="metric-card">

      <div className="metric-card-head">

        <span className="metric-label">
          {label}
        </span>

      </div>


      <div className="metric-value-row">

        <strong>
          {value}
        </strong>

      </div>


      <p>
        {note}
      </p>

    </article>
  )
}


function MemberInfo({
  label,
  value
}) {
  return (
    <div className="operation-info">

      <span>
        {label}
      </span>

      <strong>
        {value ?? "-"}
      </strong>

    </div>
  )
}


function MemberContact({
  label,
  value
}) {
  return (
    <div className="customer-contact-item">

      <span>
        {label}
      </span>

      <strong>
        {value || "-"}
      </strong>

    </div>
  )
}


function memberCode(
  id
) {
  return `EMP-${String(
    id
  ).padStart(
    4,
    "0"
  )}`
}


function formatCurrency(
  value
) {
  if (
    value === null ||
    value === undefined
  ) {
    return "-"
  }

  return new Intl.NumberFormat(
    "tr-TR",
    {
      style: "currency",
      currency: "TRY"
    }
  ).format(
    Number(value) || 0
  )
}


export default MemberDetail