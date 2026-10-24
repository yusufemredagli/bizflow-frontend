import { useNavigate } from "react-router-dom"

import AppLayout from "../components/layout/AppLayout.jsx"

import {
  clearSession,
  getSessionUser,
  getCurrentRole
} from "../services/api.js"

import {
  roleLabel,
  initials
} from "../utils/format.js"

function Settings() {
  const navigate = useNavigate()

  const user = getSessionUser()
  const role = getCurrentRole()

  const membership =
    user?.memberships?.[0]

  const handleLogout = () => {
    clearSession()
    navigate("/login")
  }

  return (
    <AppLayout
      active="settings"
      eyebrow="Sistem Ayarları"
      title="Ayarlar"
      description="Hesap, çalışma alanı ve güvenlik bilgilerinizi yönetin."
    >
      <div className="settings-grid">

        <section className="panel settings-panel">
          <div className="panel-header">
            <div>
              <span className="panel-kicker">
                Hesap
              </span>

              <h2>
                Kullanıcı bilgileri
              </h2>
            </div>
          </div>

          <div className="settings-content">

            <div className="settings-profile">
              <div className="settings-avatar">
                {initials(
                  user?.name || "User"
                )}
              </div>

              <div>
                <strong>
                  {user?.name ||
                    "Kullanıcı"}
                </strong>

                <span>
                  {user?.email || "-"}
                </span>
              </div>
            </div>

            <div className="settings-list">
              <SettingsRow
                label="Ad Soyad"
                value={
                  user?.name || "-"
                }
              />

              <SettingsRow
                label="Email"
                value={
                  user?.email || "-"
                }
              />

              <SettingsRow
                label="Rol"
                value={
                  roleLabel(role)
                }
              />

              <SettingsRow
                label="Kullanıcı ID"
                value={
                  user?.id || "-"
                }
              />
            </div>

          </div>
        </section>

        <section className="panel settings-panel">
          <div className="panel-header">
            <div>
              <span className="panel-kicker">
                Çalışma Alanı
              </span>

              <h2>
                Şirket bilgileri
              </h2>
            </div>
          </div>

          <div className="settings-content">

            <div className="workspace-settings-card">
              <div className="workspace-settings-icon">
                BF
              </div>

              <div>
                <strong>
                  BizFlow Teknik
                </strong>

                <span>
                  Aktif çalışma alanı
                </span>
              </div>
            </div>

            <div className="settings-list">
              <SettingsRow
                label="Şirket ID"
                value={
                  membership
                    ?.companyId || "-"
                }
              />

              <SettingsRow
                label="Üyelik ID"
                value={
                  membership?.id || "-"
                }
              />

              <SettingsRow
                label="Yetki"
                value={
                  roleLabel(
                    membership?.role
                  )
                }
              />

              <SettingsRow
                label="Durum"
                value="Aktif"
                status
              />
            </div>

            <div className="settings-note">
              Şirket adı ve çalışma alanı bilgileri
              şu an sadece görüntülenebilir.
              Düzenleme özelliğini backend şirket
              ayarları endpoint'i ile ekleyeceğiz.
            </div>

          </div>
        </section>

        <section className="panel settings-panel settings-security">
          <div className="panel-header">
            <div>
              <span className="panel-kicker">
                Güvenlik
              </span>

              <h2>
                Oturum yönetimi
              </h2>
            </div>
          </div>

          <div className="settings-content">

            <div className="security-row">
              <div>
                <strong>
                  Aktif oturumu kapat
                </strong>

                <span>
                  Bu cihazdaki oturum ve JWT
                  bilgileri temizlenir.
                </span>
              </div>

              <button
                className="danger-button"
                onClick={handleLogout}
              >
                Oturumu kapat
              </button>
            </div>

            <div className="security-row disabled-setting">
              <div>
                <strong>
                  Şifre değiştir
                </strong>

                <span>
                  Bu özellik sonraki sürümde
                  aktif edilecek.
                </span>
              </div>

              <button
                className="secondary-button"
                disabled
              >
                Yakında
              </button>
            </div>

          </div>
        </section>

      </div>
    </AppLayout>
  )
}

function SettingsRow({
  label,
  value,
  status
}) {
  return (
    <div className="settings-row">
      <span>{label}</span>

      {status ? (
        <strong className="settings-status">
          <i />
          {value}
        </strong>
      ) : (
        <strong>{value}</strong>
      )}
    </div>
  )
}

export default Settings