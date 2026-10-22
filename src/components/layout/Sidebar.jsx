import { useNavigate } from "react-router-dom"
import {
  getCurrentRole
} from "../../services/api.js"

function Sidebar({ active }) {
  const navigate = useNavigate()
  const role = getCurrentRole()

  const managementItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      path: "/dashboard",
      icon: "▦",
      roles: ["OWNER", "MANAGER"]
    },
    {
      id: "requests",
      label: "Servis Talepleri",
      path: "/service-requests",
      icon: "◫",
      roles: ["OWNER", "MANAGER"]
    },
    {
      id: "customers",
      label: "Müşteriler",
      path: "/customers",
      icon: "◎",
      roles: ["OWNER", "MANAGER"]
    },
    {
      id: "members",
      label: "Çalışanlar",
      path: "/members",
      icon: "◇",
      roles: ["OWNER", "MANAGER"]
    },
    {
      id: "my-jobs",
      label: "Bana Atanan İşler",
      path: "/my-jobs",
      icon: "✓",
      roles: ["TECHNICIAN"]
    }
  ]

  const visibleItems =
    managementItems.filter((item) =>
      item.roles.includes(role)
    )

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-mark">
          B
        </div>

        <div className="brand-copy">
          <strong>BizFlow</strong>
          <span>Operations Cloud</span>
        </div>
      </div>

      <div className="workspace-card">
        <div className="workspace-avatar">
          BF
        </div>

        <div>
          <strong>BizFlow Teknik</strong>
          <span>Aktif çalışma alanı</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <span className="nav-section-title">
          Yönetim
        </span>

        {visibleItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${
              active === item.id
                ? "active"
                : ""
            }`}
            onClick={() =>
              navigate(item.path)
            }
          >
            <span className="nav-icon">
              {item.icon}
            </span>

            <span>
              {item.label}
            </span>
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="system-status">
          <span className="system-status-dot" />

          <div>
            <strong>Sistem aktif</strong>
            <span>
              Tüm servisler çalışıyor
            </span>
          </div>
        </div>

        <button
            className={`nav-item ${
                active === "settings"
                ? "active"
                : ""
            }`}
            onClick={() =>
                navigate("/settings")
            }
            >
            <span className="nav-icon">
                ⚙
            </span>

            Ayarlar
        </button>
      </div>
    </aside>
  )
}

export default Sidebar