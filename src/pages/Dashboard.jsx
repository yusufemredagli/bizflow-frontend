import {
  useEffect,
  useMemo,
  useState
} from "react"

import {
  useNavigate
} from "react-router-dom"

import AppLayout from "../components/layout/AppLayout.jsx"

import {
  getDashboardSummary,
  getDashboardActivity,
  getServiceRequests
} from "../services/api.js"

import {
  statusLabel,
  priorityLabel,
  formatDate,
  formatDateTime,
  getSlaState,
  serviceCode
} from "../utils/format.js"


function Dashboard() {
  const navigate =
    useNavigate()

  const [
    summary,
    setSummary
  ] = useState(null)

  const [
    requests,
    setRequests
  ] = useState([])

  const [
    activities,
    setActivities
  ] = useState([])

  const [
    loading,
    setLoading
  ] = useState(true)

  const [
    error,
    setError
  ] = useState("")

  const [
  range,
  setRange
] = useState("7d")


  useEffect(() => {
    let active = true
    const load = async () => {
      try {
        setLoading(true)
        setError("")
        const [
          summaryResponse,
          requestsResponse,
          activityResponse
        ] = await Promise.all([
          getDashboardSummary(
            range
            ),

          getServiceRequests({
            page: 1,
            limit: 6
          }),

          getDashboardActivity()
        ])


        if (!active) return

        setSummary(
          summaryResponse.data
        )

        setRequests(
          requestsResponse.data ||
          []
        )

        setActivities(
          activityResponse.data ||
          []
        )

      } catch (error) {
        if (!active) return
        setError(
          error.message
        )
      } finally {
        if (active) setLoading(false)
      }
    }


    load()
    return () => { active = false }
  }, [range])


  const metrics =
  useMemo(
    () => {
      if (!summary) {
        return []
      }

      const operations =
        summary.operations || {
          todayAppointments: 0,
          slaRisk: 0,
          overdue: 0
        }

     const performance =
  summary.performance || {
    totalRevenue: 0,
    slaSuccessRate: null,
    slaSampleSize: 0
  }

      return [
        {
          label:
            "Bugünkü Randevular",

          value:
            operations.todayAppointments,

          note:
            "Bugün planlanan servis ziyaretleri",

          icon:
            "◷",

          path:
            "/service-requests?filter=today"
        },

        {
          label:
            "SLA Riski",

          value:
            operations.slaRisk,

          note:
            "1 saatten az süresi kalan işler",

          icon:
            "!",

          path:
            "/service-requests?filter=sla-risk"
        },

        {
          label:
            "Toplam Ciro",

          value:
            formatCurrency(
              performance.totalRevenue
            ),

          note:
            "Tamamlanan servislerden",

          icon:
            "₺",

          path:
            "/service-requests?status=COMPLETED"
        },

        {
  label:
    "SLA Başarısı",

  value:
    performance.slaSuccessRate ===
    null
      ? "—"
      : `%${performance.slaSuccessRate}`,

  note:
    performance.slaSampleSize > 0
      ? `${performance.slaSampleSize} SLA'lı tamamlanan iş üzerinden`
      : "Henüz SLA'lı tamamlanan iş yok",

  icon:
    "✓",

  path:
    performance.slaSampleSize > 0
      ? "/service-requests?filter=sla-completed"
      : null
}
      ]
    },
    [summary]
  )


  if (loading) {
    return (
      <div className="app-loading">
        BizFlow hazırlanıyor...
      </div>
    )
  }


  const performance =
    summary?.performance || {}

  const trend =
    performance.trend ||
    []

  const maxTrend =
    Math.max(
      1,
      ...trend.map(
        day =>
          Math.max(
            day.created,
            day.completed
          )
      )
    )


  return (
    <AppLayout
      active="dashboard"
      eyebrow="Operasyon Merkezi"
      title="Günlük genel bakış"
      description="Servis operasyonlarının, SLA performansının ve ekip verimliliğinin güncel durumunu tek merkezden yönetin."
      action={
        <button
          className="primary-button"
          onClick={() =>
            navigate(
              "/service-requests"
            )
          }
        >
          ＋ Yeni servis talebi
        </button>
      }
    >

      {error && (
        <div className="inline-error">
          {error}
        </div>
      )}


      <div className="dashboard-range-bar">

        <div>
          <span className="panel-kicker">
            Raporlama Dönemi
          </span>

          <strong>
            {rangeLabel(
              range
            )}
          </strong>
        </div>


        <div className="dashboard-range-tabs">

          {[
            ["7d", "7 Gün"],
            ["30d", "30 Gün"],
            ["90d", "90 Gün"],
            ["all", "Tümü"]
          ].map(
            ([
              value,
              label
            ]) => (
              <button
                type="button"
                key={value}
                className={
                  range === value
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setRange(
                    value
                  )
                }
              >
                {label}
              </button>
            )
          )}

        </div>

      </div>


      <section className="metrics-grid">

        {metrics.map(
          metric => (

                      <article
  className={
    metric.path
      ? "metric-card metric-card-clickable"
      : "metric-card"
  }
  key={
    metric.label
  }
  role={
    metric.path
      ? "button"
      : undefined
  }
  tabIndex={
    metric.path
      ? 0
      : undefined
  }
  onClick={() => {
    if (metric.path) {
      navigate(
        metric.path
      )
    }
  }}
  onKeyDown={
    event => {
      if (
        metric.path &&
        (
          event.key === "Enter" ||
          event.key === " "
        )
      ) {
        navigate(
          metric.path
        )
      }
    }
  }
>

              <div className="metric-card-head">

                <span className="metric-label">
                  {metric.label}
                </span>

                <span className="metric-icon">
                  {metric.icon}
                </span>

              </div>


              <div className="metric-value-row">

                <strong>
                  {metric.value}
                </strong>

                <span
  className={
    metric.path
      ? "metric-indicator"
      : "metric-indicator metric-indicator-muted"
  }
>
  {metric.path
    ? "Canlı"
    : "Veri yok"}
</span>

              </div>


              <p>
                {metric.note}
              </p>

            </article>

          )
        )}

      </section>


      <section className="performance-strip">

        <article className="performance-card">

          <span className="panel-kicker">
            Operasyon Hızı
          </span>

          <strong>
            {formatDuration(
              performance
                .averageCompletionHours
            )}
          </strong>

          <p>
            Ortalama servis tamamlanma süresi
          </p>

        </article>


        <article
            className="performance-card performance-card-clickable"
            onClick={() =>
                navigate(
                "/service-requests?filter=overdue"
                )
            }
        >

          <span className="panel-kicker">
            Gecikme
          </span>

          <strong>
            {summary
              ?.operations
              ?.overdue ||
              0}
          </strong>

          <p>
            SLA süresi aşılmış aktif iş
          </p>

        </article>


        <article
            className="performance-card performance-card-clickable"
            onClick={() =>
                navigate(
                "/customers"
                )
            }
            >

          <span className="panel-kicker">
            Müşteri Portföyü
          </span>

          <strong>
            {summary
              ?.customers ||
              0}
          </strong>

          <p>
            Sistemde kayıtlı müşteri
          </p>

        </article>


        <article
          className="performance-card performance-card-clickable"
          onClick={() => {
            if (
              performance
                .topTechnician
                ?.id
            ) {
              navigate(
                `/members/${performance.topTechnician.id}`
              )
            }
          }}
        >

          <span className="panel-kicker">
            En Yüksek Performans
          </span>

          <strong className="performance-technician-name">
            {performance
              .topTechnician
              ?.name ||
              "Henüz veri yok"}
          </strong>

          <p>
            {performance
              .topTechnician
              ?.completedCount ||
              0}{" "}
            tamamlanan servis
          </p>

        </article>

      </section>


      <section className="dashboard-analytics-grid">

        <section className="panel dashboard-trend-panel">

          <div className="panel-header">

            <div>

              <span className="panel-kicker">
                {rangeLabel(
                  range
                )}
              </span>

              <h2>
                Operasyon trendi
              </h2>

            </div>


            <div className="trend-legend">

              <span>
                <i className="trend-dot created" />
                Açılan
              </span>

              <span>
                <i className="trend-dot completed" />
                Tamamlanan
              </span>

            </div>

          </div>


          <div className="trend-chart">

            {trend.map(
              day => (

                <div
                  className="trend-day"
                  key={
                    day.date
                  }
                >

                  <div className="trend-bars">

                    <div
                      className="trend-bar created"
                      style={{
                        height:
                          `${Math.max(
                            (
                              day.created /
                              maxTrend
                            ) *
                              100,
                            day.created >
                              0
                              ? 8
                              : 2
                          )}%`
                      }}
                      title={`${day.created} açılan servis`}
                    />


                    <div
                      className="trend-bar completed"
                      style={{
                        height:
                          `${Math.max(
                            (
                              day.completed /
                              maxTrend
                            ) *
                              100,
                            day.completed >
                              0
                              ? 8
                              : 2
                          )}%`
                      }}
                      title={`${day.completed} tamamlanan servis`}
                    />

                  </div>


                  <strong>
                    {formatTrendLabel(
                      day.date,
                      range
                    )}
                  </strong>


                  <span>
                    {day.created}
                    {" / "}
                    {day.completed}
                  </span>

                </div>

              )
            )}

          </div>

        </section>


        <section className="panel technician-performance-panel">

          <div className="panel-header compact">

            <div>

              <span className="panel-kicker">
                Ekip Performansı
              </span>

              <h2>
                Teknisyenler
              </h2>

            </div>

          </div>


          <div className="technician-performance-list">

            {(
              performance
                .technicianPerformance ||
              []
            ).length === 0 ? (

              <div className="activity-empty">
                Henüz teknisyen performans verisi yok.
              </div>

            ) : (

              performance
                .technicianPerformance
                .slice(
                  0,
                  5
                )
                .map(
                  technician => (

                    <button
                      type="button"
                      className="technician-performance-row"
                      key={
                        technician.id
                      }
                      onClick={() =>
                        navigate(
                          `/members/${technician.id}`
                        )
                      }
                    >

                      <div>

                        <strong>
                          {technician.name}
                        </strong>

                        <span>
                          {technician.activeCount} aktif iş
                        </span>

                      </div>


                      <div className="technician-performance-numbers">

                        <strong>
                          {technician.completedCount}
                        </strong>

                        <span>
                          tamamlanan
                        </span>

                      </div>

                    </button>

                  )
                )

            )}

          </div>

        </section>

      </section>


      <section className="dashboard-grid">

        <div className="panel panel-large">

          <div className="panel-header">

            <div>

              <span className="panel-kicker">
                Servis Operasyonları
              </span>

              <h2>
                Son servis talepleri
              </h2>

            </div>


            <button
              className="text-button"
              onClick={() =>
                navigate(
                  "/service-requests"
                )
              }
            >
              Tümünü görüntüle
            </button>

          </div>


          <div className="table-wrap">

            <table className="service-table">

              <thead>
                <tr>
                  <th>Talep</th>
                  <th>Müşteri</th>
                  <th>Öncelik</th>
                  <th>Durum</th>
                  <th>Randevu</th>
                  <th>SLA</th>
                  <th>Güncelleme</th>
                </tr>
              </thead>


              <tbody>

                {requests.length ===
                0 ? (

                  <tr>
                    <td colSpan="7">
                      Henüz servis talebi yok.
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
                            {request
                              .customer
                              ?.name ||
                              "-"}
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

                            <span
                              className={`status-badge ${request.status?.toLowerCase()}`}
                            >
                              {statusLabel(
                                request.status
                              )}
                            </span>

                          </td>


                          <td>

                            <div className="schedule-cell">

                              <strong>
                                {formatDateTime(
                                  request.scheduledAt
                                )}
                              </strong>

                              {request.scheduledAt && (
                                <span>
                                  Planlanan
                                </span>
                              )}

                            </div>

                          </td>


                          <td>

                            <div className="sla-cell">

                              <span
                                className={`sla-badge ${slaState.key}`}
                              >
                                {slaState.label}
                              </span>

                              {request.slaDeadline && (
                                <span className="sla-deadline">
                                  {formatDateTime(
                                    request.slaDeadline
                                  )}
                                </span>
                              )}

                            </div>

                          </td>


                          <td className="muted-text">
                            {formatDate(
                              request.updatedAt
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

        </div>


        <aside className="dashboard-side">

          <section className="panel">

            <div className="panel-header compact">

              <div>

                <span className="panel-kicker">
                  İş Yükü
                </span>

                <h2>
                  Durum özeti
                </h2>

              </div>

            </div>


            <div className="status-list">

              <StatusRow
                label="Açık"
                value={
                  summary
                    .serviceRequests
                    .open
                }
              />

              <StatusRow
                label="Atanan"
                value={
                  summary
                    .serviceRequests
                    .assigned
                }
              />

              <StatusRow
                label="Yolda"
                value={
                  summary
                    .serviceRequests
                    .onTheWay
                }
              />

              <StatusRow
                label="İşlemde"
                value={
                  summary
                    .serviceRequests
                    .inProgress
                }
              />

              <StatusRow
                label="Tamamlanan"
                value={
                  summary
                    .serviceRequests
                    .completed
                }
              />

              <StatusRow
                label="İptal"
                value={
                  summary
                    .serviceRequests
                    .cancelled ||
                  0
                }
              />

            </div>

          </section>


          <section className="panel activity-panel">

            <div className="panel-header compact">

              <div>

                <span className="panel-kicker">
                  Sistem Aktivitesi
                </span>

                <h2>
                  Son aktiviteler
                </h2>

              </div>

            </div>


            <div className="activity-list">

              {activities.length ===
              0 ? (

                <div className="activity-empty">
                  Henüz aktivite kaydı yok.
                </div>

              ) : (

                activities.map(
                  activity => (

                    <ActivityItem
                      key={
                        activity.id
                      }
                      activity={
                        activity
                      }
                    />

                  )
                )

              )}

            </div>

          </section>

        </aside>

      </section>

    </AppLayout>
  )
}


function StatusRow({
  label,
  value
}) {
  return (
    <div className="status-row">

      <div>

        <span className="status-dot" />

        <span>
          {label}
        </span>

      </div>

      <strong>
        {value}
      </strong>

    </div>
  )
}


function ActivityItem({
  activity
}) {
  const actorName =
    activity.actor
      ?.user
      ?.name ||
    "Sistem"


  return (
    <article className="activity-item">

      <div
        className={`activity-marker ${activity.action?.toLowerCase()}`}
      />


      <div className="activity-body">

        <div className="activity-head">

          <strong>
            {actorName}
          </strong>

          <span className="activity-action">
            {auditActionLabel(
              activity.action
            )}
          </span>

        </div>


        <p>
          {activity.message}
        </p>


        <span className="activity-time">
          {formatActivityTime(
            activity.createdAt
          )}
        </span>

      </div>

    </article>
  )
}


function auditActionLabel(
  action
) {
  const labels = {
    CREATE:
      "Oluşturma",

    UPDATE:
      "Güncelleme",

    DELETE:
      "Silme",

    ASSIGN:
      "Atama",

    STATUS_CHANGE:
      "Durum",

    LOGIN:
      "Giriş"
  }


  return (
    labels[action] ||
    "Aktivite"
  )
}


function formatActivityTime(
  dateValue
) {
  const date =
    new Date(
      dateValue
    )

  const now =
    new Date()

  const diffMs =
    now.getTime() -
    date.getTime()

  const diffMinutes =
    Math.floor(
      diffMs /
      60000
    )


  if (
    diffMinutes < 1
  ) {
    return "Az önce"
  }


  if (
    diffMinutes < 60
  ) {
    return `${diffMinutes} dk önce`
  }


  const diffHours =
    Math.floor(
      diffMinutes /
      60
    )


  if (
    diffHours < 24
  ) {
    return `${diffHours} sa önce`
  }


  const diffDays =
    Math.floor(
      diffHours /
      24
    )


  if (
    diffDays < 7
  ) {
    return `${diffDays} gün önce`
  }


  return formatDate(
    dateValue
  )
}


function formatCurrency(
  value
) {
  return new Intl.NumberFormat(
    "tr-TR",
    {
      style: "currency",
      currency: "TRY",
      maximumFractionDigits: 0
    }
  ).format(
    Number(value) || 0
  )
}


function formatDuration(
  hours
) {
  const value =
    Number(hours) || 0


  if (
    value < 1
  ) {
    return `${Math.round(
      value * 60
    )} dk`
  }


  if (
    value < 24
  ) {
    return `${value.toFixed(
      1
    )} sa`
  }


  return `${(
    value /
    24
  ).toFixed(
    1
  )} gün`
}


function formatTrendLabel(
  dateValue,
  range
) {
  const date =
    new Date(
      `${dateValue}T12:00:00`
    )

  if (range === "7d") {
    return new Intl.DateTimeFormat(
      "tr-TR",
      {
        weekday:
          "short"
      }
    ).format(date)
  }

  if (range === "all") {
    return new Intl.DateTimeFormat(
      "tr-TR",
      {
        month:
          "short",
        year:
          "2-digit"
      }
    ).format(date)
  }

  return new Intl.DateTimeFormat(
    "tr-TR",
    {
      day:
        "2-digit",
      month:
        "short"
    }
  ).format(date)
}


function rangeLabel(
  range
) {
  const labels = {
    "7d":
      "Son 7 Gün",
    "30d":
      "Son 30 Gün",
    "90d":
      "Son 90 Gün",
    all:
      "Tüm Zamanlar"
  }

  return (
    labels[range] ||
    "Son 7 Gün"
  )
}


export default Dashboard