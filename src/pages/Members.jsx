import {
  useCallback,
  useEffect,
  useRef,
  useState
} from "react"

import {
  useNavigate
} from "react-router-dom"

import AppLayout from "../components/layout/AppLayout.jsx"
import TableSkeleton from "../components/ui/TableSkeleton.jsx"

import {
  getMembers,
  createMember
} from "../services/api.js"

import {
  initials,
  roleLabel,
  formatShortDate
} from "../utils/format.js"

import {
  useToast
} from "../context/ToastContext.jsx"


function Members() {
  const navigate =
    useNavigate()

  const { showToast } =
    useToast()


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
    showModal,
    setShowModal
  ] = useState(false)

  const [
    form,
    setForm
  ] = useState({
    name: "",
    email: "",
    password: "",
    role: "TECHNICIAN"
  })


  const loadVersion = useRef(0)
  useEffect(() => () => { loadVersion.current += 1 }, [])

  const loadMembers = useCallback(async () => {
      const version = ++loadVersion.current
      try {
        setLoading(true)

        const response =
          await getMembers()

        if (version !== loadVersion.current) return

        setMembers(
          response.data || []
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
    }, [showToast])


  useEffect(() => {
    loadMembers()
  }, [loadMembers])


  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      password: "",
      role: "TECHNICIAN"
    })
  }


  const openModal = () => {
    resetForm()

    setShowModal(true)
  }


  const closeModal = () => {
    if (submitting) {
      return
    }

    setShowModal(false)

    resetForm()
  }


  const handleChange = (
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

      await createMember(
        form
      )

      showToast(
        "Çalışan başarıyla eklendi",
        "success"
      )

      setShowModal(false)

      resetForm()

      await loadMembers()

    } catch (error) {
      showToast(
        error.message,
        "error"
      )
    } finally {
      setSubmitting(false)
    }
  }


  const technicianCount =
    members.filter(
      member =>
        member.role ===
        "TECHNICIAN"
    ).length


  const managerCount =
    members.filter(
      member =>
        member.role ===
        "MANAGER"
    ).length


  const totalAssignments =
    members.reduce(
      (
        total,
        member
      ) =>
        total +
        (
          member._count
            ?.assignments ||
          0
        ),
      0
    )


  return (
    <AppLayout
      active="members"
      eyebrow="Ekip Yönetimi"
      title="Çalışanlar"
      description="Operasyon ekibinizi, çalışan rollerini ve saha kapasitesini yönetin."
      action={
        <button
          className="primary-button"
          onClick={
            openModal
          }
        >
          ＋ Çalışan ekle
        </button>
      }
    >

      <section className="team-summary">

        <div>
          <strong>
            {members.length}
          </strong>

          <span>
            Toplam ekip üyesi
          </span>
        </div>


        <div>
          <strong>
            {technicianCount}
          </strong>

          <span>
            Aktif teknisyen
          </span>
        </div>


        <div>
          <strong>
            {managerCount}
          </strong>

          <span>
            Yönetici
          </span>
        </div>


        <div>
          <strong>
            {totalAssignments}
          </strong>

          <span>
            Toplam iş ataması
          </span>
        </div>

      </section>


      <section className="panel">

        <div className="panel-header">

          <div>

            <span className="panel-kicker">
              Organizasyon
            </span>

            <h2>
              Ekip üyeleri
            </h2>

          </div>

        </div>


        <div className="table-wrap">

          <table className="service-table">

            <thead>
              <tr>
                <th>Çalışan</th>
                <th>Rol</th>
                <th>Durum</th>
                <th>Atanan İş</th>
                <th>Katılım</th>
              </tr>
            </thead>


            <tbody>

              {loading ? (

                <TableSkeleton
                  rows={6}
                  columns={5}
                />

              ) : members.length ===
                0 ? (

                <tr>
                  <td colSpan="5">
                    Henüz çalışan bulunmuyor.
                  </td>
                </tr>

              ) : (

                members.map(
                  member => (

                    <tr
                      key={
                        member.id
                      }
                      className="clickable-row"
                      onClick={() =>
                        navigate(
                          `/members/${member.id}`
                        )
                      }
                    >

                      <td>

                        <div className="member-cell">

                          <div className="member-avatar">
                            {initials(
                              member.user
                                .name
                            )}
                          </div>


                          <div className="table-primary">

                            <strong>
                              {
                                member.user
                                  .name
                              }
                            </strong>

                            <span>
                              {
                                member.user
                                  .email
                              }
                            </span>

                          </div>

                        </div>

                      </td>


                      <td>

                        <span className="role-badge">
                          {roleLabel(
                            member.role
                          )}
                        </span>

                      </td>


                      <td>

                        <span className="active-status">
                          Aktif
                        </span>

                      </td>


                      <td>

                        <span className="customer-service-badge">
                          {member
                            ._count
                            ?.assignments ||
                            0}
                        </span>

                      </td>


                      <td>
                        {formatShortDate(
                          member.createdAt
                        )}
                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

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
                  Yeni Çalışan
                </span>

                <h2>
                  Ekip üyesi ekle
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
                      handleChange(
                        "name",
                        event.target.value
                      )
                  }
                />

              </label>


              <label>
                Email

                <input
                  required
                  type="email"
                  value={
                    form.email
                  }
                  onChange={
                    event =>
                      handleChange(
                        "email",
                        event.target.value
                      )
                  }
                />

              </label>


              <label>
                Geçici Şifre

                <input
                  required
                  type="password"
                  minLength="8"
                  value={
                    form.password
                  }
                  onChange={
                    event =>
                      handleChange(
                        "password",
                        event.target.value
                      )
                  }
                />

              </label>


              <label>
                Rol

                <select
                  value={
                    form.role
                  }
                  onChange={
                    event =>
                      handleChange(
                        "role",
                        event.target.value
                      )
                  }
                >
                  <option value="TECHNICIAN">
                    Teknisyen
                  </option>

                  <option value="MANAGER">
                    Yönetici
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
                    ? "Ekleniyor..."
                    : "Çalışanı ekle"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </AppLayout>
  )
}


export default Members