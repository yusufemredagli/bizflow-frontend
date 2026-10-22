import {
  useEffect,
  useState
} from "react"

import { useNavigate } from "react-router-dom"

import AppLayout from "../components/layout/AppLayout.jsx"

import {
  getMyAssignedRequests
} from "../services/api.js"

import {
  statusLabel,
  priorityLabel,
  serviceCode
} from "../utils/format.js"

function MyJobs() {
  const navigate = useNavigate()

  const [assignments, setAssignments] =
    useState([])

  const [error, setError] =
    useState("")

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {
    let active = true
    const load = async () => {
      try {
        const response =
          await getMyAssignedRequests()

        if (!active) return

        setAssignments(
          response.data || []
        )
      } catch (error) {
        if (!active) return
        setError(error.message)
      } finally {
        if (active) setLoading(false)
      }
    }

    load()
    return () => { active = false }
  }, [])

  return (
    <AppLayout
      active="my-jobs"
      eyebrow="Saha Operasyonu"
      title="Bana atanan işler"
      description="Üzerinize atanmış servis operasyonlarını ve müşteri bilgilerini görüntüleyin."
    >
      {error && (
        <div className="inline-error">
          {error}
        </div>
      )}

      <div className="job-grid">
        {loading ? (
          <div className="panel empty-state">
            Yükleniyor...
          </div>
        ) : assignments.length ===
          0 ? (
          <div className="panel empty-state">
            Size atanmış servis
            talebi bulunmuyor.
          </div>
        ) : (
          assignments.map(
            (assignment) => {
              const request =
                assignment.request

              return (
                <article
                  className="job-card"
                  key={assignment.id}
                  onClick={() =>
                    navigate(
                      `/service-requests/${request.id}`
                    )
                  }
                >
                  <div className="job-card-top">
                    <span>
                      {serviceCode(
                        request.id
                      )}
                    </span>

                    <span
                      className={`status-badge ${request.status.toLowerCase()}`}
                    >
                      {statusLabel(
                        request.status
                      )}
                    </span>
                  </div>

                  <h3>
                    {request.title}
                  </h3>

                  <p>
                    {
                      request
                        .description
                    }
                  </p>

                  <div className="job-meta">
                    <div>
                      <span>Müşteri</span>

                      <strong>
                        {
                          request
                            .customer
                            ?.name
                        }
                      </strong>
                    </div>

                    <div>
                      <span>Telefon</span>

                      <strong>
                        {
                          request
                            .customer
                            ?.phone
                        }
                      </strong>
                    </div>

                    <div>
                      <span>Öncelik</span>

                      <strong>
                        {priorityLabel(
                          request.priority
                        )}
                      </strong>
                    </div>
                  </div>
                </article>
              )
            }
          )
        )}
      </div>
    </AppLayout>
  )
}

export default MyJobs