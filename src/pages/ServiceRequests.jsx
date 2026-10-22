import {
  useEffect,
  useRef,
  useState
} from "react"

import {
  useNavigate,
  useSearchParams
} from "react-router-dom"

import AppLayout from "../components/layout/AppLayout.jsx"
import TableSkeleton from "../components/ui/TableSkeleton.jsx"

import {
  getServiceRequests,
  getCustomers,
  getMembers,
  createServiceRequest,
  assignTechnician
} from "../services/api.js"

import {
  statusLabel,
  priorityLabel,
  serviceCode,
  formatDate,
  formatDateTime,
  getSlaState
} from "../utils/format.js"

import {
  useToast
} from "../context/ToastContext.jsx"


function ServiceRequests() {
  const navigate =
    useNavigate()

  const [
    searchParams,
    setSearchParams
  ] = useSearchParams()

  const { showToast } =
    useToast()


  const [
    requests,
    setRequests
  ] = useState([])

  const [
    customers,
    setCustomers
  ] = useState([])

  const [
    members,
    setMembers
  ] = useState([])

  const [
    loading,
    setLoading
  ] = useState(true)

  const [
    submitting,
    setSubmitting
  ] = useState(false)

  const [
    query,
    setQuery
  ] = useState("")

  const [
    status,
    setStatus
  ] = useState(
    searchParams.get(
      "status"
    ) || ""
  )

  const [
    priority,
    setPriority
  ] = useState(
    searchParams.get(
      "priority"
    ) || ""
  )

  const [
    operationFilter,
    setOperationFilter
  ] = useState(
    searchParams.get(
      "filter"
    ) || ""
  )

  const [
    page,
    setPage
  ] = useState(1)

  const [
    meta,
    setMeta
  ] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  })

  const [
    showModal,
    setShowModal
  ] = useState(false)

  const [
    form,
    setForm
  ] = useState({
    customerId: "",
    title: "",
    description: "",
    priority: "NORMAL",
    scheduledAt: "",
    slaHours: "4"
  })


  const loadStaticData =
    async () => {
      try {
        const [
          customersResponse,
          membersResponse
        ] = await Promise.all([
          getCustomers({
            page: 1,
            limit: 100
          }),

          getMembers()
        ])

        setCustomers(
          customersResponse.data ||
          []
        )

        setMembers(
          membersResponse.data ||
          []
        )

      } catch (error) {
        showToast(
          error.message,
          "error"
        )
      }
    }


  const loadVersion = useRef(0)
  useEffect(() => () => { loadVersion.current += 1 }, [])

  const loadRequests = async ({
    targetPage = page,
    searchValue = query,
    statusValue = status,
    priorityValue = priority,
    filterValue =
      operationFilter
  } = {}) => {
    const version = ++loadVersion.current
    try {
      setLoading(true)

      const response =
        await getServiceRequests({
          page:
            targetPage,

          limit:
            10,

          search:
            searchValue,

          status:
            statusValue,

          priority:
            priorityValue,

          filter:
            filterValue
        })

      if (version !== loadVersion.current) return

      setRequests(
        response.data ||
        []
      )

      setMeta(
        response.meta || {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 1
        }
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
  }


  useEffect(() => {
    loadStaticData()
  }, [])


  useEffect(() => {
    loadVersion.current += 1
    const timer =
      setTimeout(() => {
        setPage(1)

        loadRequests({
          targetPage:
            1,

          searchValue:
            query,

          statusValue:
            status,

          priorityValue:
            priority,

          filterValue:
            operationFilter
        })

      }, 400)

    return () =>
      clearTimeout(
        timer
      )

  }, [
    query,
    status,
    priority,
    operationFilter
  ])


  useEffect(() => {
    loadRequests({
      targetPage:
        page,

      searchValue:
        query,

      statusValue:
        status,

      priorityValue:
        priority,

      filterValue:
        operationFilter
    })

  }, [page])


  useEffect(() => {
    setStatus(searchParams.get("status") || "")
    setPriority(searchParams.get("priority") || "")
    setOperationFilter(searchParams.get("filter") || "")
  }, [searchParams])

  const technicians =
    members.filter(
      member =>
        member.role ===
        "TECHNICIAN"
    )


  const resetForm =
    () => {
      setForm({
        customerId: "",
        title: "",
        description: "",
        priority: "NORMAL",
        scheduledAt: "",
        slaHours: "4"
      })
    }


  const openModal =
    () => {
      resetForm()

      setShowModal(
        true
      )
    }


  const closeModal =
    () => {
      if (
        submitting
      ) {
        return
      }

      setShowModal(
        false
      )

      resetForm()
    }


  const updateUrlFilters = ({
    nextStatus =
      status,

    nextPriority =
      priority,

    nextFilter =
      operationFilter
  } = {}) => {
    const params =
      new URLSearchParams()

    if (
      nextStatus
    ) {
      params.set(
        "status",
        nextStatus
      )
    }

    if (
      nextPriority
    ) {
      params.set(
        "priority",
        nextPriority
      )
    }

    if (
      nextFilter
    ) {
      params.set(
        "filter",
        nextFilter
      )
    }

    setSearchParams(
      params
    )
  }


  const handleStatusChange = (
    value
  ) => {
    const nextStatus =
      value === "ALL"
        ? ""
        : value

    setStatus(
      nextStatus
    )

    setPage(1)

    updateUrlFilters({
      nextStatus
    })
  }


  const handlePriorityChange = (
    value
  ) => {
    setPriority(
      value
    )

    setPage(1)

    updateUrlFilters({
      nextPriority:
        value
    })
  }


  const clearOperationFilter =
    () => {
      setOperationFilter(
        ""
      )

      setPage(1)

      updateUrlFilters({
        nextFilter:
          ""
      })
    }


  const handleCreate =
    async (
      event
    ) => {
      event.preventDefault()

      if (submitting) return

      try {
        setSubmitting(
          true
        )

        await createServiceRequest({
          customerId:
            Number(
              form.customerId
            ),

          title:
            form.title,

          description:
            form.description,

          priority:
            form.priority,

          scheduledAt:
            form.scheduledAt
              ? new Date(
                  form.scheduledAt
                ).toISOString()
              : undefined,

          slaHours:
            form.slaHours
              ? Number(
                  form.slaHours
                )
              : undefined
        })

        showToast(
          "Servis talebi başarıyla oluşturuldu",
          "success"
        )

        setShowModal(
          false
        )

        resetForm()

        setPage(1)

        await loadRequests({
          targetPage:
            1,

          searchValue:
            query,

          statusValue:
            status,

          priorityValue:
            priority,

          filterValue:
            operationFilter
        })

      } catch (error) {
        showToast(
          error.message,
          "error"
        )
      } finally {
        setSubmitting(
          false
        )
      }
    }


  const handleAssign =
    async (
      requestId,
      memberId
    ) => {
      if (
        !memberId
      ) {
        return
      }

      try {
        await assignTechnician(
          requestId,
          Number(
            memberId
          )
        )

        showToast(
          "Teknisyen başarıyla atandı",
          "success"
        )

        await loadRequests({
          targetPage:
            page,

          searchValue:
            query,

          statusValue:
            status,

          priorityValue:
            priority,

          filterValue:
            operationFilter
        })

      } catch (error) {
        showToast(
          error.message,
          "error"
        )
      }
    }


  const handlePrevious =
    () => {
      if (
        page <= 1 ||
        loading
      ) {
        return
      }

      setPage(
        current =>
          current - 1
      )
    }


  const handleNext =
    () => {
      if (
        page >=
          meta.totalPages ||
        loading
      ) {
        return
      }

      setPage(
        current =>
          current + 1
      )
    }


  return (
    <AppLayout
      active="requests"
      eyebrow="Operasyon Yönetimi"
      title="Servis talepleri"
      description="Açık işleri yönetin, saha ekibine atayın ve operasyon durumlarını takip edin."
      action={
        <button
          className="primary-button"
          onClick={
            openModal
          }
        >
          ＋ Yeni servis talebi
        </button>
      }
    >

      <div className="request-tabs">

        {[
          [
            "ALL",
            "Tümü"
          ],

          [
            "OPEN",
            "Açık"
          ],

          [
            "ASSIGNED",
            "Atanan"
          ],

          [
            "ON_THE_WAY",
            "Yolda"
          ],

          [
            "IN_PROGRESS",
            "İşlemde"
          ],

          [
            "COMPLETED",
            "Tamamlanan"
          ],

          [
            "CANCELLED",
            "İptal"
          ]
        ].map(
          ([
            value,
            label
          ]) => {
            const activeValue =
              status ||
              "ALL"

            return (
              <button
                key={
                  value
                }
                className={
                  activeValue ===
                  value
                    ? "active"
                    : ""
                }
                onClick={() =>
                  handleStatusChange(
                    value
                  )
                }
              >
                {label}
              </button>
            )
          }
        )}

      </div>


      {operationFilter && (

        <div className="active-filter-row">

          <div className="active-operation-filter">

            <span className="active-operation-filter-label">

              Filtre:
              {" "}

              <strong>
                {operationFilterLabel(
                  operationFilter
                )}
              </strong>

            </span>


            <button
              type="button"
              onClick={
                clearOperationFilter
              }
              aria-label="Filtreyi temizle"
              title="Filtreyi temizle"
            >
              ×
            </button>

          </div>

        </div>

      )}


      <div className="content-toolbar">

        <div className="search-box">

          <span>
            ⌕
          </span>

          <input
            value={
              query
            }
            onChange={
              event =>
                setQuery(
                  event.target.value
                )
            }
            placeholder="Talep, müşteri, telefon veya adres ara..."
          />

        </div>


        <select
          className="table-select"
          value={
            priority
          }
          onChange={
            event =>
              handlePriorityChange(
                event.target.value
              )
          }
        >

          <option value="">
            Tüm öncelikler
          </option>

          <option value="LOW">
            Düşük
          </option>

          <option value="NORMAL">
            Normal
          </option>

          <option value="HIGH">
            Yüksek
          </option>

          <option value="URGENT">
            Acil
          </option>

        </select>


        <div className="toolbar-meta">

          <strong>
            {meta.total}
          </strong>

          <span>
            sonuç
          </span>

        </div>

      </div>


      <section className="panel">

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
                <th>Teknisyen</th>
                <th>Güncelleme</th>
                <th />
              </tr>
            </thead>


            <tbody>

              {loading ? (

                <TableSkeleton
                  rows={6}
                  columns={9}
                />

              ) : requests.length ===
                0 ? (

                <tr>
                  <td colSpan="9">
                    Servis talebi bulunamadı.
                  </td>
                </tr>

              ) : (

                requests.map(
                  request => {
                    const assignedTechnician =
                      request.assignments
                        ?.map(
                          assignment =>
                            assignment
                              .member
                              ?.user
                              ?.name
                        )
                        .filter(
                          Boolean
                        )
                        .join(
                          ", "
                        )


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
                          {request.customer
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
                                Planlanan ziyaret
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


                        <td>

                          {request.status ===
                          "OPEN" ? (

                            <select
                              className="table-select"
                              defaultValue=""
                              onClick={
                                event =>
                                  event.stopPropagation()
                              }
                              onChange={
                                event =>
                                  handleAssign(
                                    request.id,
                                    event.target.value
                                  )
                              }
                            >

                              <option value="">
                                Teknisyen ata
                              </option>

                              {technicians.map(
                                member => (

                                  <option
                                    key={
                                      member.id
                                    }
                                    value={
                                      member.id
                                    }
                                  >
                                    {
                                      member.user.name
                                    }
                                  </option>

                                )
                              )}

                            </select>

                          ) : (

                            <span className="muted-text">
                              {assignedTechnician ||
                                "Atama yok"}
                            </span>

                          )}

                        </td>


                        <td className="muted-text">
                          {formatDate(
                            request.updatedAt
                          )}
                        </td>


                        <td>

                          <button
                            type="button"
                            className="row-action-button"
                            onClick={
                              event => {
                                event.stopPropagation()

                                navigate(
                                  `/service-requests/${request.id}`
                                )
                              }
                            }
                          >
                            →
                          </button>

                        </td>

                      </tr>
                    )
                  }
                )

              )}

            </tbody>

          </table>

        </div>


        <div className="pagination-bar">

          <div className="pagination-info">

            Sayfa{" "}

            <strong>
              {meta.page}
            </strong>

            {" / "}

            <strong>
              {Math.max(
                meta.totalPages ||
                  1,
                1
              )}
            </strong>

          </div>


          <div className="pagination-actions">

            <button
              className="secondary-button"
              onClick={
                handlePrevious
              }
              disabled={
                page <= 1 ||
                loading
              }
            >
              ← Önceki
            </button>


            <button
              className="secondary-button"
              onClick={
                handleNext
              }
              disabled={
                page >=
                  meta.totalPages ||
                loading
              }
            >
              Sonraki →
            </button>

          </div>

        </div>

      </section>


      {showModal && (

        <div
          className="modal-backdrop"
          onMouseDown={
            event => {
              if (
                event.target ===
                  event.currentTarget &&
                !submitting
              ) {
                closeModal()
              }
            }
          }
        >

          <div className="modal-card">

            <div className="modal-header">

              <div>

                <span className="panel-kicker">
                  Yeni Operasyon
                </span>

                <h2>
                  Servis talebi oluştur
                </h2>

              </div>


              <button
                type="button"
                className="modal-close"
                disabled={
                  submitting
                }
                onClick={
                  closeModal
                }
              >
                ×
              </button>

            </div>


            <form
              className="modal-form"
              onSubmit={
                handleCreate
              }
            >

              <label>
                Müşteri

                <select
                  required
                  value={
                    form.customerId
                  }
                  onChange={
                    event =>
                      setForm({
                        ...form,

                        customerId:
                          event.target.value
                      })
                  }
                >

                  <option value="">
                    Müşteri seçin
                  </option>

                  {customers.map(
                    customer => (

                      <option
                        key={
                          customer.id
                        }
                        value={
                          customer.id
                        }
                      >
                        {customer.name}
                      </option>

                    )
                  )}

                </select>

              </label>


              <label>
                Başlık

                <input
                  required
                  value={
                    form.title
                  }
                  onChange={
                    event =>
                      setForm({
                        ...form,

                        title:
                          event.target.value
                      })
                  }
                />

              </label>


              <label>
                Açıklama

                <textarea
                  required
                  rows="5"
                  value={
                    form.description
                  }
                  onChange={
                    event =>
                      setForm({
                        ...form,

                        description:
                          event.target.value
                      })
                  }
                />

              </label>


              <label>
                Öncelik

                <select
                  value={
                    form.priority
                  }
                  onChange={
                    event =>
                      setForm({
                        ...form,

                        priority:
                          event.target.value
                      })
                  }
                >

                  <option value="LOW">
                    Düşük
                  </option>

                  <option value="NORMAL">
                    Normal
                  </option>

                  <option value="HIGH">
                    Yüksek
                  </option>

                  <option value="URGENT">
                    Acil
                  </option>

                </select>

              </label>


              <label>
                Randevu tarihi

                <input
                  type="datetime-local"
                  value={
                    form.scheduledAt
                  }
                  onChange={
                    event =>
                      setForm({
                        ...form,

                        scheduledAt:
                          event.target.value
                      })
                  }
                />

              </label>


              <label>
                SLA süresi

                <select
                  value={
                    form.slaHours
                  }
                  onChange={
                    event =>
                      setForm({
                        ...form,

                        slaHours:
                          event.target.value
                      })
                  }
                >

                  <option value="1">
                    1 saat
                  </option>

                  <option value="2">
                    2 saat
                  </option>

                  <option value="4">
                    4 saat
                  </option>

                  <option value="8">
                    8 saat
                  </option>

                  <option value="12">
                    12 saat
                  </option>

                  <option value="24">
                    24 saat
                  </option>

                  <option value="48">
                    48 saat
                  </option>

                  <option value="72">
                    72 saat
                  </option>

                </select>

              </label>


              <div className="modal-actions">

                <button
                  type="button"
                  className="secondary-button"
                  disabled={
                    submitting
                  }
                  onClick={
                    closeModal
                  }
                >
                  Vazgeç
                </button>


                <button
                  type="submit"
                  className="primary-button"
                  disabled={
                    submitting
                  }
                >
                  {submitting
                    ? "Oluşturuluyor..."
                    : "Talep oluştur"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </AppLayout>
  )
}


function operationFilterLabel(
  filter
) {
  const labels = {
    today:
      "Bugünkü Randevular",

    "sla-risk":
      "SLA Riski",

    overdue:
      "Geciken İşler",

    "sla-completed":
      "SLA'lı Tamamlananlar"
  }

  return (
    labels[filter] ||
    filter
  )
}


export default ServiceRequests