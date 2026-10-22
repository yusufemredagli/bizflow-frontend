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
  getCustomer
} from "../services/api.js"

import {
  statusLabel,
  priorityLabel,
  formatDate,
  formatDateTime,
  getSlaState,
  serviceCode
} from "../utils/format.js"

import {
  useToast
} from "../context/ToastContext.jsx"


function CustomerDetail() {
  const { id } =
    useParams()

  const navigate =
    useNavigate()

  const { showToast } =
    useToast()


  const [customer, setCustomer] =
    useState(null)

  const [summary, setSummary] =
    useState(null)

  const [
    serviceRequests,
    setServiceRequests
  ] = useState([])

  const [loading, setLoading] =
    useState(true)


  const loadVersion = useRef(0)
  useEffect(() => () => { loadVersion.current += 1 }, [])

  const load = useCallback(async () => {
    const version = ++loadVersion.current
    try {
      setLoading(true)

      const response =
        await getCustomer(id)

      if (version !== loadVersion.current) return

      setCustomer(
        response.data.customer
      )

      setSummary(
        response.data.summary
      )

      setServiceRequests(
        response.data
          .serviceRequests || []
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
    setCustomer(null)
    load()
    return () => { loadVersion.current += 1 }
  }, [load])


  if (loading) {
    return (
      <div className="app-loading">
        Müşteri detayı yükleniyor...
      </div>
    )
  }


  if (
    !customer ||
    !summary
  ) {
    return (
      <div className="app-loading">
        Müşteri bulunamadı.
      </div>
    )
  }


  return (
    <AppLayout
      active="customers"
      eyebrow={
        customerCode(
          customer.id
        )
      }
      title={
        customer.name ||
        "Müşteri"
      }
      description="Müşteri ilişkilerini, servis geçmişini ve operasyon performansını tek ekrandan yönetin."
      action={
        <button
          className="secondary-button"
          onClick={() =>
            navigate(
              "/customers"
            )
          }
        >
          ← Müşterilere dön
        </button>
      }
    >

      <section className="customer-detail-header panel">

        <div className="customer-profile-main">

          <div className="customer-profile-avatar">
            {getInitials(
              customer.name
            )}
          </div>


          <div className="customer-profile-info">

            <span className="panel-kicker">
              Müşteri Profili
            </span>

            <h2>
              {customer.name || "-"}
            </h2>

            <div className="customer-profile-meta">

              <span>
                {customer.phone || "-"}
              </span>

              <span>
                {customer.email || "-"}
              </span>

            </div>

          </div>

        </div>


        <div className="customer-address-block">

          <span>
            Adres
          </span>

          <strong>
            {customer.address || "-"}
          </strong>

        </div>

      </section>


      <section className="customer-metrics-grid">

        <CustomerMetric
          label="Toplam Servis"
          value={
            summary.totalRequests
          }
          note="Tüm zamanlar"
        />


        <CustomerMetric
          label="Aktif İşler"
          value={
            summary.activeRequests
          }
          note="Devam eden operasyonlar"
        />


        <CustomerMetric
          label="Tamamlanan"
          value={
            summary.completedRequests
          }
          note="Başarıyla kapatılan"
        />


        <CustomerMetric
          label="Toplam Ciro"
          value={
            formatCurrency(
              summary.totalRevenue
            )
          }
          note="Tamamlanan servislerden"
        />

      </section>


      <div className="customer-detail-grid">

        <section className="panel customer-service-panel">

          <div className="panel-header">

            <div>
              <span className="panel-kicker">
                Servis Geçmişi
              </span>

              <h2>
                Operasyonlar
              </h2>
            </div>


            <span className="customer-service-count">
              {serviceRequests.length} servis
            </span>

          </div>


          <div className="table-wrap">

            <table className="service-table">

              <thead>
                <tr>
                  <th>Talep</th>
                  <th>Durum</th>
                  <th>Öncelik</th>
                  <th>Teknisyen</th>
                  <th>Randevu</th>
                  <th>SLA</th>
                  <th>Ücret</th>
                </tr>
              </thead>


              <tbody>

                {serviceRequests.length ===
                0 ? (

                  <tr>
                    <td colSpan="7">
                      Bu müşteriye ait servis kaydı bulunmuyor.
                    </td>
                  </tr>

                ) : (

                  serviceRequests.map(
                    request => {
                      const technician =
                        request
                          .assignments?.[0]
                          ?.member
                          ?.user

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
                            {technician?.name ||
                              "Atanmadı"}
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


        <aside className="customer-detail-side">

          <section className="panel">

            <div className="panel-header compact">

              <div>
                <span className="panel-kicker">
                  Performans
                </span>

                <h2>
                  Servis özeti
                </h2>
              </div>

            </div>


            <div className="operation-info-list">

              <CustomerInfoRow
                label="SLA Riski"
                value={
                  summary
                    .slaRiskRequests
                }
              />

              <CustomerInfoRow
                label="Geciken"
                value={
                  summary
                    .overdueRequests
                }
              />

              <CustomerInfoRow
                label="İptal"
                value={
                  summary
                    .cancelledRequests
                }
              />

              <CustomerInfoRow
                label="Son Servis"
                value={
                  formatDate(
                    summary
                      .lastServiceAt
                  )
                }
              />

              <CustomerInfoRow
                label="Son Tamamlama"
                value={
                  formatDate(
                    summary
                      .lastCompletedAt
                  )
                }
              />

            </div>

          </section>


          <section className="panel">

            <div className="panel-header compact">

              <div>
                <span className="panel-kicker">
                  İletişim
                </span>

                <h2>
                  Müşteri bilgileri
                </h2>
              </div>

            </div>


            <div className="customer-contact-list">

              <CustomerContact
                label="Telefon"
                value={
                  customer.phone
                }
              />

              <CustomerContact
                label="E-posta"
                value={
                  customer.email
                }
              />

              <CustomerContact
                label="Adres"
                value={
                  customer.address
                }
              />

              <CustomerContact
                label="Kayıt Tarihi"
                value={
                  formatDate(
                    customer.createdAt
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


function CustomerMetric({
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


function CustomerInfoRow({
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


function CustomerContact({
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


function customerCode(
  id
) {
  return `CUS-${String(
    id
  ).padStart(
    4,
    "0"
  )}`
}


function getInitials(
  name
) {
  if (!name) {
    return "M"
  }

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map(
      part =>
        part[0]
          ?.toUpperCase()
    )
    .join("")
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


export default CustomerDetail