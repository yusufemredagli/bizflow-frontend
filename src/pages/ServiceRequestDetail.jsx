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
import ConfirmDialog from "../components/ui/ConfirmDialog.jsx"

import {
  getServiceRequest,
  updateRequestStatus,
  getAttachments,
  uploadAttachment,
  deleteAttachment,
  completeServiceRequest
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


const API_URL =
  import.meta.env.VITE_API_URL?.trim().replace(/\/+$/, "")

const FILE_BASE_URL =
  API_URL.replace(
    /\/api\/?$/,
    ""
  )


const emptyCompletionForm = {
  completionNote: "",
  materialsUsed: "",
  customerNote: "",
  serviceFee: ""
}


function ServiceRequestDetail() {
  const { id } =
    useParams()

  const navigate =
    useNavigate()

  const { showToast } =
    useToast()

  const fileInputRef =
    useRef(null)


  const [request, setRequest] =
    useState(null)

  const [
    attachments,
    setAttachments
  ] = useState([])

  const [loading, setLoading] =
    useState(true)

  const [
    statusLoading,
    setStatusLoading
  ] = useState(false)

  const [
    uploading,
    setUploading
  ] = useState(false)

  const [
    deletingAttachmentId,
    setDeletingAttachmentId
  ] = useState(null)

  const [
    deleteTarget,
    setDeleteTarget
  ] = useState(null)

  const [
    completionOpen,
    setCompletionOpen
  ] = useState(false)

  const [
    completing,
    setCompleting
  ] = useState(false)

  const [
    completionForm,
    setCompletionForm
  ] = useState(
    emptyCompletionForm
  )


  const loadVersion = useRef(0)
  useEffect(() => () => { loadVersion.current += 1 }, [])

  const load = useCallback(async () => {
    const version = ++loadVersion.current
    try {
      setLoading(true)

      const [
        requestResponse,
        attachmentResponse
      ] = await Promise.all([
        getServiceRequest(id),
        getAttachments(id)
      ])

      if (version !== loadVersion.current) return

      setRequest(
        requestResponse.data
      )

      setAttachments(
        attachmentResponse.data || []
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
    setRequest(null)
    load()
    return () => { loadVersion.current += 1 }
  }, [load])


  const handleStatus = async (
    status
  ) => {
    try {
      setStatusLoading(true)

      await updateRequestStatus(
        request.id,
        status
      )

      showToast(
        `Servis durumu ${statusLabel(status)} olarak güncellendi`,
        "success"
      )

      await load()

    } catch (error) {
      showToast(
        error.message,
        "error"
      )
    } finally {
      setStatusLoading(false)
    }
  }


  const handleCompletionChange =
    event => {
      const {
        name,
        value
      } = event.target

      setCompletionForm(
        current => ({
          ...current,
          [name]: value
        })
      )
    }


  const openCompletionModal = () => {
    setCompletionForm(
      emptyCompletionForm
    )

    setCompletionOpen(true)
  }


  const closeCompletionModal = () => {
    if (completing) {
      return
    }

    setCompletionOpen(false)

    setCompletionForm(
      emptyCompletionForm
    )
  }


  const handleCompleteService =
    async event => {
      event.preventDefault()

      if (completing) return

      const completionNote =
        completionForm
          .completionNote
          .trim()

      if (
        completionNote.length < 5
      ) {
        showToast(
          "Yapılan işlem en az 5 karakter olmalı.",
          "error"
        )

        return
      }


      if (
        completionForm.serviceFee !== ""
      ) {
        const fee =
          Number(
            completionForm.serviceFee
          )

        if (
          !Number.isFinite(fee) ||
          fee < 0
        ) {
          showToast(
            "Servis ücreti geçerli bir tutar olmalı.",
            "error"
          )

          return
        }
      }


      try {
        setCompleting(true)


        const payload = {
          completionNote,

          materialsUsed:
            completionForm
              .materialsUsed
              .trim(),

          customerNote:
            completionForm
              .customerNote
              .trim()
        }


        if (
          completionForm.serviceFee !== ""
        ) {
          payload.serviceFee =
            Number(
              completionForm.serviceFee
            )
        }


        await completeServiceRequest(
          request.id,
          payload
        )


        showToast(
          "Servis başarıyla tamamlandı",
          "success"
        )


        setCompletionOpen(false)

        setCompletionForm(
          emptyCompletionForm
        )


        await load()

      } catch (error) {
        showToast(
          error.message,
          "error"
        )
      } finally {
        setCompleting(false)
      }
    }


  const handleFileSelect = async (
    event
  ) => {
    const file =
      event.target.files?.[0]

    event.target.value = ""

    if (!file) {
      return
    }


    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf"
    ]


    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      showToast(
        "Sadece JPG, PNG, WEBP veya PDF yükleyebilirsiniz.",
        "error"
      )

      return
    }


    if (
      file.size >
      10 * 1024 * 1024
    ) {
      showToast(
        "Dosya boyutu en fazla 10 MB olabilir.",
        "error"
      )

      return
    }


    try {
      setUploading(true)

      await uploadAttachment(
        request.id,
        file
      )

      const response =
        await getAttachments(
          request.id
        )

      setAttachments(
        response.data || []
      )

      showToast(
        "Dosya başarıyla yüklendi",
        "success"
      )

    } catch (error) {
      showToast(
        error.message,
        "error"
      )
    } finally {
      setUploading(false)
    }
  }


  const handleDeleteAttachment =
    async () => {
      if (!deleteTarget) {
        return
      }

      try {
        setDeletingAttachmentId(
          deleteTarget.id
        )

        await deleteAttachment(
          request.id,
          deleteTarget.id
        )

        setAttachments(
          current =>
            current.filter(
              attachment =>
                attachment.id !==
                deleteTarget.id
            )
        )

        showToast(
          "Dosya başarıyla silindi",
          "success"
        )

        setDeleteTarget(null)

      } catch (error) {
        showToast(
          error.message,
          "error"
        )
      } finally {
        setDeletingAttachmentId(
          null
        )
      }
    }


  if (loading) {
    return (
      <div className="app-loading">
        Servis detayı yükleniyor...
      </div>
    )
  }


  if (!request) {
    return (
      <div className="app-loading">
        Servis talebi bulunamadı.
      </div>
    )
  }


  const technician =
    request.assignments?.[0]
      ?.member?.user


  const slaState =
    getSlaState(
      request.slaDeadline,
      request.status
    )


  const slaTimeText =
    getSlaTimeText(
      request.slaDeadline,
      request.status
    )


  return (
    <AppLayout
      active="requests"
      eyebrow={
        serviceCode(
          request.id
        )
      }
      title={
        request.title
      }
      description="Servis operasyonunun zaman planını, saha ekibini, SLA durumunu, belgelerini ve işlem geçmişini yönetin."
      action={
        <button
          className="secondary-button"
          onClick={() =>
            navigate(
              "/service-requests"
            )
          }
        >
          ← Listeye dön
        </button>
      }
    >

      <div className="detail-header-strip">

        <div>
          <span>
            Durum
          </span>

          <strong>
            {statusLabel(
              request.status
            )}
          </strong>
        </div>


        <div>
          <span>
            Öncelik
          </span>

          <strong>
            {priorityLabel(
              request.priority
            )}
          </strong>
        </div>


        <div>
          <span>
            Müşteri
          </span>

          <strong>
            {request.customer?.name}
          </strong>
        </div>


        <div>
          <span>
            Teknisyen
          </span>

          <strong>
            {technician?.name ||
              "Atanmadı"}
          </strong>
        </div>


        <div>
          <span>
            Randevu
          </span>

          <strong>
            {formatDateTime(
              request.scheduledAt
            )}
          </strong>
        </div>

      </div>


      <div className="detail-grid">

        <section className="panel detail-main-panel">

          <div className="panel-header">

            <div>
              <span className="panel-kicker">
                İş Detayı
              </span>

              <h2>
                Servis açıklaması
              </h2>
            </div>

          </div>


          <div className="detail-content">

            <p className="request-description">
              {request.description}
            </p>


            <div className="customer-card">

              <span className="panel-kicker">
                Müşteri Bilgileri
              </span>

              <strong>
                {request.customer
                  ?.name}
              </strong>

              <span>
                {request.customer
                  ?.phone || "-"}
              </span>

              <span>
                {request.customer
                  ?.email || "-"}
              </span>

              <span>
                {request.customer
                  ?.address || "-"}
              </span>

            </div>

          </div>

        </section>


        <aside className="detail-side-column">

          <section className="panel operation-card">

            <div className="panel-header compact">

              <div>
                <span className="panel-kicker">
                  Zaman Yönetimi
                </span>

                <h2>
                  Operasyon planı
                </h2>
              </div>

            </div>


            <div className="operation-info-list">

              <OperationInfo
                label="Randevu"
                value={
                  formatDateTime(
                    request.scheduledAt
                  )
                }
              />


              <OperationInfo
                label="SLA Son Tarihi"
                value={
                  formatDateTime(
                    request.slaDeadline
                  )
                }
              />


              <div className="operation-info">

                <span>
                  SLA Durumu
                </span>

                <div className="operation-sla-row">

                  <span
                    className={`sla-badge ${slaState.key}`}
                  >
                    {slaState.label}
                  </span>

                  {slaTimeText && (
                    <small>
                      {slaTimeText}
                    </small>
                  )}

                </div>

              </div>


              <OperationInfo
                label="Teknisyen"
                value={
                  technician?.name ||
                  "Henüz atanmadı"
                }
              />


              <OperationInfo
                label="Oluşturulma"
                value={
                  formatDate(
                    request.createdAt
                  )
                }
              />


              {request.completedAt && (
                <OperationInfo
                  label="Tamamlanma"
                  value={
                    formatDateTime(
                      request.completedAt
                    )
                  }
                />
              )}

            </div>

          </section>


          <section className="panel">

            <div className="panel-header compact">

              <div>
                <span className="panel-kicker">
                  Operasyon
                </span>

                <h2>
                  Durumu güncelle
                </h2>
              </div>

            </div>


            <div className="status-action-list">

              {request.status ===
                "IN_PROGRESS" && (

                <button
                  type="button"
                  className="complete-service-button"
                  disabled={
                    statusLoading ||
                    completing
                  }
                  onClick={
                    openCompletionModal
                  }
                >
                  Servisi Tamamla

                  <span>
                    ✓
                  </span>
                </button>

              )}


              {nextStatuses(
                request.status
              ).map(
                status => (

                  <button
                    key={status}
                    disabled={
                      statusLoading ||
                      completing
                    }
                    onClick={() =>
                      handleStatus(
                        status
                      )
                    }
                  >
                    {statusLabel(
                      status
                    )}

                    <span>
                      →
                    </span>
                  </button>

                )
              )}


              {request.status !==
                "IN_PROGRESS" &&
                nextStatuses(
                  request.status
                ).length === 0 && (

                <div className="terminal-status">
                  Bu operasyon kapanmış durumda.
                </div>

              )}

            </div>

          </section>

        </aside>

      </div>


      {request.status ===
        "COMPLETED" && (

        <section className="panel completion-summary-panel">

          <div className="panel-header">

            <div>
              <span className="panel-kicker">
                Servis Sonucu
              </span>

              <h2>
                Tamamlama raporu
              </h2>
            </div>


            <div className="completion-success-badge">
              ✓ Tamamlandı
            </div>

          </div>


          <div className="completion-summary-grid">

            <CompletionSummaryItem
              label="Yapılan İşlem"
              value={
                request.completionNote
              }
            />

            <CompletionSummaryItem
              label="Kullanılan Malzemeler"
              value={
                request.materialsUsed ||
                "Malzeme kullanılmadı / belirtilmedi"
              }
            />

            <CompletionSummaryItem
              label="Müşteri Notu"
              value={
                request.customerNote ||
                "Müşteri notu bulunmuyor"
              }
            />

            <CompletionSummaryItem
              label="Servis Ücreti"
              value={
                formatCurrency(
                  request.serviceFee
                )
              }
            />

          </div>

        </section>

      )}


      <section className="panel attachment-panel">

        <div className="panel-header">

          <div>
            <span className="panel-kicker">
              Servis Belgeleri
            </span>

            <h2>
              Dosyalar & Fotoğraflar
            </h2>
          </div>


          <div className="attachment-header-actions">

            <span className="attachment-count">
              {attachments.length} dosya
            </span>


            <button
              className="primary-button attachment-upload-button"
              disabled={
                uploading
              }
              onClick={() =>
                fileInputRef.current
                  ?.click()
              }
            >
              {uploading
                ? "Yükleniyor..."
                : "＋ Dosya yükle"}
            </button>


            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,.pdf"
              hidden
              onChange={
                handleFileSelect
              }
            />

          </div>

        </div>


        {attachments.length === 0 ? (

          <div className="attachment-empty">

            <div className="attachment-empty-icon">
              ↑
            </div>

            <strong>
              Henüz dosya yüklenmemiş
            </strong>

            <p>
              Arıza fotoğrafı, işlem sonrası görsel
              veya servis belgesi ekleyebilirsiniz.
            </p>

            <button
              className="secondary-button"
              onClick={() =>
                fileInputRef.current
                  ?.click()
              }
            >
              İlk dosyayı yükle
            </button>

          </div>

        ) : (

          <div className="attachment-grid">

            {attachments.map(
              attachment => (

                <AttachmentCard
                  key={
                    attachment.id
                  }
                  attachment={
                    attachment
                  }
                  deleting={
                    deletingAttachmentId ===
                    attachment.id
                  }
                  onDelete={() =>
                    setDeleteTarget(
                      attachment
                    )
                  }
                />

              )
            )}

          </div>

        )}

      </section>


      <section className="panel timeline-panel">

        <div className="panel-header">

          <div>
            <span className="panel-kicker">
              Audit Trail
            </span>

            <h2>
              Operasyon geçmişi
            </h2>
          </div>

        </div>


        <div className="timeline">

          {request.statusHistory
            ?.length === 0 && (

            <div className="empty-state">
              Henüz durum değişikliği bulunmuyor.
            </div>

          )}


          {request.statusHistory?.map(
            history => (

              <div
                className="timeline-item"
                key={
                  history.id
                }
              >

                <div className="timeline-line">
                  <span />
                </div>


                <div className="timeline-content">

                  <div>

                    <strong>
                      {statusLabel(
                        history.newStatus
                      )}
                    </strong>

                    <span>
                      {formatDate(
                        history.createdAt
                      )}
                    </span>

                  </div>


                  <p>
                    {statusLabel(
                      history.oldStatus
                    )}

                    {" → "}

                    {statusLabel(
                      history.newStatus
                    )}
                  </p>


                  <small>
                    Değiştiren:{" "}
                    {history.changedBy
                      ?.user?.name ||
                      "-"}
                  </small>

                </div>

              </div>

            )
          )}

        </div>

      </section>


      <ConfirmDialog
        open={
          Boolean(
            deleteTarget
          )
        }

        title="Dosyayı sil"

        message={
          deleteTarget
            ? `"${deleteTarget.originalName}" dosyasını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`
            : ""
        }

        confirmText="Dosyayı sil"

        cancelText="Vazgeç"

        danger

        loading={
          deletingAttachmentId !==
          null
        }

        onConfirm={
          handleDeleteAttachment
        }

        onCancel={() => {
          if (
            deletingAttachmentId ===
            null
          ) {
            setDeleteTarget(
              null
            )
          }
        }}
      />


      {completionOpen && (

        <div
          className="completion-modal-backdrop"
          onMouseDown={
            event => {
              if (
                event.target ===
                event.currentTarget
              ) {
                closeCompletionModal()
              }
            }
          }
        >

          <section
            className="completion-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="completion-modal-title"
          >

            <div className="completion-modal-header">

              <div>

                <span className="panel-kicker">
                  Servis Kapatma
                </span>

                <h2 id="completion-modal-title">
                  Servisi tamamla
                </h2>

                <p>
                  Yapılan işlemi ve servis sonucunu
                  kaydederek operasyonu kapatın.
                </p>

              </div>


              <button
                type="button"
                className="completion-modal-close"
                disabled={
                  completing
                }
                onClick={
                  closeCompletionModal
                }
              >
                ×
              </button>

            </div>


            <form
              className="completion-form"
              onSubmit={
                handleCompleteService
              }
            >

              <div className="completion-field completion-field-full">

                <label htmlFor="completionNote">
                  Yapılan işlem
                  <span>*</span>
                </label>

                <textarea
                  id="completionNote"
                  name="completionNote"
                  rows="5"
                  maxLength="5000"
                  required
                  value={
                    completionForm.completionNote
                  }
                  onChange={
                    handleCompletionChange
                  }
                  placeholder="Arızanın nasıl giderildiğini ve yapılan işlemleri açıklayın..."
                />

                <small>
                  Servis kapatma raporunun ana açıklaması.
                </small>

              </div>


              <div className="completion-field completion-field-full">

                <label htmlFor="materialsUsed">
                  Kullanılan malzeme / parça
                </label>

                <textarea
                  id="materialsUsed"
                  name="materialsUsed"
                  rows="3"
                  maxLength="5000"
                  value={
                    completionForm.materialsUsed
                  }
                  onChange={
                    handleCompletionChange
                  }
                  placeholder="Örn: 1 adet 16A otomatik sigorta, 2 metre kablo..."
                />

              </div>


              <div className="completion-field completion-field-full">

                <label htmlFor="customerNote">
                  Müşteri notu
                </label>

                <textarea
                  id="customerNote"
                  name="customerNote"
                  rows="3"
                  maxLength="5000"
                  value={
                    completionForm.customerNote
                  }
                  onChange={
                    handleCompletionChange
                  }
                  placeholder="Müşteriye iletilen bilgi veya sonraki işlem önerisi..."
                />

              </div>


              <div className="completion-field">

                <label htmlFor="serviceFee">
                  Servis ücreti
                </label>

                <div className="completion-money-input">

                  <input
                    id="serviceFee"
                    name="serviceFee"
                    type="number"
                    min="0"
                    step="0.01"
                    value={
                      completionForm.serviceFee
                    }
                    onChange={
                      handleCompletionChange
                    }
                    placeholder="0.00"
                  />

                  <span>
                    ₺
                  </span>

                </div>

              </div>


              <div className="completion-preview">

                <span>
                  İş durumu
                </span>

                <strong>
                  İşlemde
                  <span>→</span>
                  Tamamlandı
                </strong>

                <small>
                  Tamamlanma zamanı otomatik kaydedilecek.
                </small>

              </div>


              <div className="completion-modal-actions">

                <button
                  type="button"
                  className="secondary-button"
                  disabled={
                    completing
                  }
                  onClick={
                    closeCompletionModal
                  }
                >
                  Vazgeç
                </button>


                <button
                  type="submit"
                  className="primary-button completion-submit-button"
                  disabled={
                    completing
                  }
                >
                  {completing
                    ? "Servis kapatılıyor..."
                    : "✓ Servisi tamamla"}
                </button>

              </div>

            </form>

          </section>

        </div>

      )}

    </AppLayout>
  )
}


function AttachmentCard({
  attachment,
  deleting,
  onDelete
}) {
  const isImage =
    attachment.mimeType
      ?.startsWith(
        "image/"
      )


  const fileUrl =
    `${FILE_BASE_URL}${attachment.filePath}`


  const uploader =
    attachment.uploadedBy
      ?.user?.name ||
    "Sistem"


  return (
    <article className="attachment-card">

      <div className="attachment-preview">

        {isImage ? (

          <img
            src={
              fileUrl
            }
            alt={
              attachment.originalName
            }
          />

        ) : (

          <div className="attachment-file-icon">
            PDF
          </div>

        )}


        <button
          type="button"
          className="attachment-delete-button"
          disabled={
            deleting
          }
          onClick={
            onDelete
          }
          title="Dosyayı sil"
          aria-label="Dosyayı sil"
        >
          {deleting
            ? "…"
            : "×"}
        </button>

      </div>


      <div className="attachment-card-body">

        <div className="attachment-file-info">

          <strong
            title={
              attachment.originalName
            }
          >
            {attachment.originalName}
          </strong>

          <span>
            {formatFileSize(
              attachment.fileSize
            )}
          </span>

        </div>


        <div className="attachment-meta">

          <span>
            {uploader}
          </span>

          <span>
            {formatDate(
              attachment.createdAt
            )}
          </span>

        </div>


        <a
          className="attachment-open-link"
          href={
            fileUrl
          }
          target="_blank"
          rel="noreferrer"
        >
          Dosyayı görüntüle

          <span>
            ↗
          </span>
        </a>

      </div>

    </article>
  )
}


function OperationInfo({
  label,
  value
}) {
  return (
    <div className="operation-info">

      <span>
        {label}
      </span>

      <strong>
        {value || "-"}
      </strong>

    </div>
  )
}


function CompletionSummaryItem({
  label,
  value
}) {
  return (
    <div className="completion-summary-item">

      <span>
        {label}
      </span>

      <p>
        {value || "-"}
      </p>

    </div>
  )
}


function nextStatuses(
  status
) {
  const transitions = {
    OPEN: [
      "CANCELLED"
    ],

    ASSIGNED: [
      "ON_THE_WAY",
      "CANCELLED"
    ],

    ON_THE_WAY: [
      "IN_PROGRESS",
      "CANCELLED"
    ],

    IN_PROGRESS: [
      "CANCELLED"
    ],

    COMPLETED: [],

    CANCELLED: []
  }

  return (
    transitions[status] ||
    []
  )
}


function getSlaTimeText(
  slaDeadline,
  status
) {
  if (
    !slaDeadline ||
    status === "COMPLETED" ||
    status === "CANCELLED"
  ) {
    return ""
  }


  const deadline =
    new Date(
      slaDeadline
    ).getTime()


  const difference =
    deadline -
    Date.now()


  const absoluteMinutes =
    Math.floor(
      Math.abs(
        difference
      ) /
      60000
    )


  const hours =
    Math.floor(
      absoluteMinutes /
      60
    )


  const minutes =
    absoluteMinutes % 60


  const text =
    hours > 0
      ? `${hours} sa ${minutes} dk`
      : `${minutes} dk`


  if (
    difference < 0
  ) {
    return `${text} gecikmiş`
  }


  return `${text} kaldı`
}


function formatFileSize(
  bytes
) {
  if (
    !bytes ||
    bytes <= 0
  ) {
    return "0 KB"
  }


  if (
    bytes <
    1024 * 1024
  ) {
    return `${Math.ceil(
      bytes / 1024
    )} KB`
  }


  return `${(
    bytes /
    (1024 * 1024)
  ).toFixed(1)} MB`
}


function formatCurrency(
  value
) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "Belirtilmedi"
  }


  const numericValue =
    Number(value)


  if (
    Number.isNaN(
      numericValue
    )
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
    numericValue
  )
}


export default ServiceRequestDetail