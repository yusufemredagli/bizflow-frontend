import {
  useEffect,
  useRef,
  useState
} from "react"

import {
  useNavigate
} from "react-router-dom"

import AppLayout from "../components/layout/AppLayout.jsx"
import TableSkeleton from "../components/ui/TableSkeleton.jsx"
import ConfirmDialog from "../components/ui/ConfirmDialog.jsx"

import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer
} from "../services/api.js"

import {
  useToast
} from "../context/ToastContext.jsx"


function Customers() {
  const navigate =
    useNavigate()

  const { showToast } =
    useToast()


  const [
    customers,
    setCustomers
  ] = useState([])

  const [
    loading,
    setLoading
  ] = useState(true)

  const [
    deleting,
    setDeleting
  ] = useState(false)

  const [
    submitting,
    setSubmitting
  ] = useState(false)

  const [
    query,
    setQuery
  ] = useState("")

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
    editingCustomer,
    setEditingCustomer
  ] = useState(null)

  const [
    confirmState,
    setConfirmState
  ] = useState({
    open: false,
    customer: null
  })

  const [
    form,
    setForm
  ] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  })


  const loadVersion = useRef(0)
  useEffect(() => () => { loadVersion.current += 1 }, [])

  const loadCustomers = async (
    targetPage = page,
    searchValue = query
  ) => {
    const version = ++loadVersion.current
    try {
      setLoading(true)

      const response =
        await getCustomers({
          page: targetPage,
          limit: 10,
          search: searchValue
        })

      if (version !== loadVersion.current) return

      setCustomers(
        response.data || []
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
    loadVersion.current += 1
    const timer =
      setTimeout(() => {
        setPage(1)

        loadCustomers(
          1,
          query
        )
      }, 400)

    return () =>
      clearTimeout(timer)

  }, [query])


  useEffect(() => {
    loadCustomers(
      page,
      query
    )
  }, [page])


  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      phone: "",
      address: ""
    })
  }


  const openCreate = () => {
    setEditingCustomer(null)

    resetForm()

    setShowModal(true)
  }


  const openEdit = (
    customer
  ) => {
    setEditingCustomer(
      customer
    )

    setForm({
      name:
        customer.name || "",

      email:
        customer.email || "",

      phone:
        customer.phone || "",

      address:
        customer.address || ""
    })

    setShowModal(true)
  }


  const closeModal = () => {
    if (submitting) {
      return
    }

    setShowModal(false)

    setEditingCustomer(null)

    resetForm()
  }


  const handleFormChange = (
    field,
    value
  ) => {
    setForm(
      current => ({
        ...current,
        [field]: value
      })
    )
  }


  const handleSubmit = async (
    event
  ) => {
    event.preventDefault()

    if (submitting) return

    try {
      setSubmitting(true)

      if (editingCustomer) {
        await updateCustomer(
          editingCustomer.id,
          form
        )

        showToast(
          "Müşteri bilgileri başarıyla güncellendi",
          "success"
        )
      } else {
        await createCustomer(
          form
        )

        showToast(
          "Müşteri başarıyla oluşturuldu",
          "success"
        )
      }

      setShowModal(false)

      setEditingCustomer(null)

      resetForm()

      await loadCustomers(
        page,
        query
      )

    } catch (error) {
      showToast(
        error.message,
        "error"
      )
    } finally {
      setSubmitting(false)
    }
  }


  const askDelete = (
    customer
  ) => {
    setConfirmState({
      open: true,
      customer
    })
  }


  const closeDeleteConfirm =
    () => {
      if (deleting) {
        return
      }

      setConfirmState({
        open: false,
        customer: null
      })
    }


  const confirmDelete =
    async () => {
      if (
        !confirmState.customer
      ) {
        return
      }

      try {
        setDeleting(true)

        await deleteCustomer(
          confirmState
            .customer
            .id
        )

        showToast(
          "Müşteri başarıyla silindi",
          "success"
        )

        setConfirmState({
          open: false,
          customer: null
        })

        const nextPage =
          customers.length === 1 &&
          page > 1
            ? page - 1
            : page

        if (
          nextPage !== page
        ) {
          setPage(
            nextPage
          )
        } else {
          await loadCustomers(
            nextPage,
            query
          )
        }

      } catch (error) {
        showToast(
          error.message,
          "error"
        )
      } finally {
        setDeleting(false)
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
      active="customers"
      eyebrow="Müşteri Yönetimi"
      title="Müşteriler"
      description="Müşteri portföyünüzü, iletişim bilgilerini ve servis ilişkilerini yönetin."
      action={
        <button
          className="primary-button"
          onClick={
            openCreate
          }
        >
          ＋ Yeni müşteri
        </button>
      }
    >

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
            placeholder="Müşteri ara..."
          />

        </div>


        <div className="toolbar-meta">

          <strong>
            {meta.total}
          </strong>

          <span>
            müşteri
          </span>

        </div>

      </div>


      <section className="panel">

        <div className="panel-header">

          <div>

            <span className="panel-kicker">
              CRM
            </span>

            <h2>
              Müşteri portföyü
            </h2>

          </div>

        </div>


        <div className="table-wrap">

          <table className="service-table">

            <thead>
              <tr>
                <th>Müşteri</th>
                <th>Telefon</th>
                <th>Email</th>
                <th>Adres</th>
                <th>Servis</th>
                <th>İşlem</th>
              </tr>
            </thead>


            <tbody>

              {loading ? (

                <TableSkeleton
                  rows={6}
                  columns={6}
                />

              ) : customers.length ===
                0 ? (

                <tr>
                  <td colSpan="6">
                    Müşteri bulunamadı.
                  </td>
                </tr>

              ) : (

                customers.map(
                  customer => (

                    <tr
                      key={
                        customer.id
                      }
                      className="clickable-row"
                      onClick={() =>
                        navigate(
                          `/customers/${customer.id}`
                        )
                      }
                    >

                      <td>

                        <div className="table-primary">

                          <strong>
                            {customer.name ||
                              "İsimsiz müşteri"}
                          </strong>

                          <span>
                            C-
                            {String(
                              customer.id
                            ).padStart(
                              4,
                              "0"
                            )}
                          </span>

                        </div>

                      </td>


                      <td>
                        {customer.phone ||
                          "-"}
                      </td>


                      <td>
                        {customer.email ||
                          "-"}
                      </td>


                      <td className="address-cell">
                        {customer.address ||
                          "-"}
                      </td>


                      <td>

                        <span className="customer-service-badge">
                          {customer
                            ._count
                            ?.serviceRequests ||
                            0}
                        </span>

                      </td>


                      <td>

                        <div className="table-actions">

                          <button
                            type="button"
                            className="text-button"
                            onClick={
                              event => {
                                event.stopPropagation()

                                openEdit(
                                  customer
                                )
                              }
                            }
                          >
                            Düzenle
                          </button>


                          <button
                            type="button"
                            className="danger-text-button"
                            onClick={
                              event => {
                                event.stopPropagation()

                                askDelete(
                                  customer
                                )
                              }
                            }
                          >
                            Sil
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
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
              {meta.totalPages ||
                1}
            </strong>

          </div>


          <div className="pagination-actions">

            <button
              type="button"
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
              type="button"
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
                  {editingCustomer
                    ? "Müşteri Düzenle"
                    : "Yeni Müşteri"}
                </span>

                <h2>
                  {editingCustomer
                    ? editingCustomer.name
                    : "Müşteri oluştur"}
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
                handleSubmit
              }
            >

              <label>
                Ad Soyad

                <input
                  required
                  value={
                    form.name
                  }
                  onChange={
                    event =>
                      handleFormChange(
                        "name",
                        event.target.value
                      )
                  }
                />

              </label>


              <label>
                Telefon

                <input
                  required
                  value={
                    form.phone
                  }
                  onChange={
                    event =>
                      handleFormChange(
                        "phone",
                        event.target.value
                      )
                  }
                />

              </label>


              <label>
                Email

                <input
                  type="email"
                  value={
                    form.email
                  }
                  onChange={
                    event =>
                      handleFormChange(
                        "email",
                        event.target.value
                      )
                  }
                />

              </label>


              <label>
                Adres

                <textarea
                  required
                  rows="4"
                  value={
                    form.address
                  }
                  onChange={
                    event =>
                      handleFormChange(
                        "address",
                        event.target.value
                      )
                  }
                />

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
                    ? "Kaydediliyor..."
                    : editingCustomer
                      ? "Değişiklikleri kaydet"
                      : "Müşteri oluştur"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}


      <ConfirmDialog
        open={
          confirmState.open
        }
        title="Müşteriyi sil?"
        message={
          confirmState.customer
            ? `${confirmState.customer.name} adlı müşteri kalıcı olarak silinecek. Servis geçmişi olan müşteriler güvenlik nedeniyle silinemez.`
            : ""
        }
        confirmText="Müşteriyi sil"
        cancelText="Vazgeç"
        danger
        loading={
          deleting
        }
        onCancel={
          closeDeleteConfirm
        }
        onConfirm={
          confirmDelete
        }
      />

    </AppLayout>
  )
}


export default Customers