function Toast({ type = "success", message, onClose }) {
  return (
    <div className={`toast toast-${type}`} role={type === "error" ? "alert" : "status"}>
      <div className="toast-content">
        <strong>
          {type === "success"
            ? "Başarılı"
            : type === "error"
            ? "Hata"
            : "Bilgi"}
        </strong>

        <span>{message}</span>
      </div>

      <button
        type="button"
        aria-label="Bildirimi kapat"
        className="toast-close"
        onClick={onClose}
      >
        ×
      </button>
    </div>
  )
}

export default Toast