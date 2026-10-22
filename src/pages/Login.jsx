import { useState } from "react"
import { useNavigate } from "react-router-dom"

import {
  loginRequest,
  saveSession
} from "../services/api.js"

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] =
    useState("")
  const [error, setError] =
    useState("")
  const [loading, setLoading] =
    useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (loading) return

    try {
      setLoading(true)
      setError("")

      const response =
        await loginRequest(
          email,
          password
        )

      saveSession(response)

      const role =
        response.data.user
          ?.memberships?.[0]?.role

      if (role === "TECHNICIAN") {
        navigate("/my-jobs")
      } else {
        navigate("/dashboard")
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-screen">
      <div className="login-visual">
        <div className="login-brand">
          <div className="brand-mark large">
            B
          </div>

          <div>
            <strong>BizFlow</strong>
            <span>
              Operations Cloud
            </span>
          </div>
        </div>

        <div className="login-copy">
          <span className="eyebrow">
            Operasyon Yönetimi
          </span>

          <h1>
            Saha operasyonunuzu
            tek merkezden yönetin.
          </h1>

          <p>
            Müşterilerinizi, servis
            taleplerinizi ve teknisyen
            operasyonlarını tek bir
            platformda yönetin.
          </p>
        </div>

        <div className="login-feature-list">
          <div>✓ Canlı servis takibi</div>
          <div>✓ Ekip ve rol yönetimi</div>
          <div>✓ Operasyon geçmişi</div>
          <div>✓ Multi-tenant altyapı</div>
        </div>
      </div>

      <div className="login-form-side">
        <form
          className="login-card"
          onSubmit={handleSubmit}
        >
          <div>
            <span className="eyebrow">
              BizFlow Hesabı
            </span>

            <h2>Tekrar hoş geldiniz</h2>

            <p>
              Operasyon panelinize devam
              etmek için giriş yapın.
            </p>
          </div>

          <label>
            Email

            <input
              type="email"
              required
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value
                )
              }
              placeholder="mail@sirket.com"
            />
          </label>

          <label>
            Şifre

            <input
              type="password"
              required
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              placeholder="••••••••"
            />
          </label>

          {error && (
            <div className="inline-error">
              {error}
            </div>
          )}

          <button
            className="primary-button login-submit"
            disabled={loading}
          >
            {loading
              ? "Giriş yapılıyor..."
              : "Giriş yap"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login