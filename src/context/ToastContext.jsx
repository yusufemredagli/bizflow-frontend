import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react"

import Toast from "../components/ui/Toast.jsx"

const ToastContext = createContext()

function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)

  const timerRef = useRef(null)
  useEffect(() => () => clearTimeout(timerRef.current), [])

  const showToast = useCallback((
    message,
    type = "success"
  ) => {
    clearTimeout(timerRef.current)
    setToast({
      message,
      type
    })

    timerRef.current = setTimeout(() => {
      setToast(null)
    }, 3000)
  }, [])

  const closeToast = () => {
    clearTimeout(timerRef.current)
    setToast(null)
  }

  return (
    <ToastContext.Provider
      value={{ showToast }}
    >
      {children}

      {toast && (
        <div className="toast-container">
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={closeToast}
          />
        </div>
      )}
    </ToastContext.Provider>
  )
}

function useToast() {
  return useContext(ToastContext)
}

export {
  ToastProvider,
  useToast
}