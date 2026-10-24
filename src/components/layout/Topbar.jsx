import { useNavigate } from "react-router-dom"
import {
  clearSession,
  getSessionUser,
  getCurrentRole
} from "../../services/api.js"

import {
  initials,
  roleLabel
} from "../../utils/format.js"

function Topbar({
  eyebrow,
  title,
  description,
  action
}) {
  const navigate = useNavigate()

  const user = getSessionUser()
  const role = getCurrentRole()

  const logout = () => {
    clearSession()
    navigate("/login")
  }

  return (
    <header className="topbar">
      <div className="topbar-heading">
        <span className="eyebrow">
          {eyebrow}
        </span>

        <h1>{title}</h1>

        {description && (
          <p>{description}</p>
        )}
      </div>

      <div className="topbar-actions">
        {action}

        <div className="topbar-separator" />

        <div className="profile-menu">
          <div className="profile-avatar">
            {initials(user?.name || "User")}
          </div>

          <div className="profile-text">
            <strong>
              {user?.name || "Kullanıcı"}
            </strong>

            <span>
              {roleLabel(role)}
            </span>
          </div>
        </div>

        <button
          className="logout-button"
          onClick={logout}
        >
          Çıkış
        </button>
      </div>
    </header>
  )
}

export default Topbar