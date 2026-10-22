function ConfirmDialog({
  open,
  title = "İşlemi onayla",
  message = "Bu işlemi gerçekleştirmek istediğinize emin misiniz?",
  confirmText = "Onayla",
  cancelText = "Vazgeç",
  danger = false,
  loading = false,
  onConfirm,
  onCancel
}) {
  if (!open) {
    return null
  }

  return (
    <div className="confirm-backdrop">
      <div className="confirm-dialog" role="dialog" aria-modal="true" aria-label={title}>
        <div className="confirm-icon">
          !
        </div>

        <div className="confirm-content">
          <span className="panel-kicker">
            Onay Gerekli
          </span>

          <h2>
            {title}
          </h2>

          <p>
            {message}
          </p>
        </div>

        <div className="confirm-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelText}
          </button>

          <button
            type="button"
            className={
              danger
                ? "danger-button"
                : "primary-button"
            }
            onClick={onConfirm}
            disabled={loading}
          >
            {loading
              ? "İşleniyor..."
              : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog