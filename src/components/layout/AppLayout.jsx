import Sidebar from "./Sidebar.jsx"
import Topbar from "./Topbar.jsx"

function AppLayout({
  children,
  active,
  eyebrow,
  title,
  description,
  action
}) {
  return (
    <div className="app-shell">
      <Sidebar active={active} />

      <main className="main-content">
        <Topbar
          eyebrow={eyebrow}
          title={title}
          description={description}
          action={action}
        />

        <div className="page-content">
          {children}
        </div>
      </main>
    </div>
  )
}

export default AppLayout