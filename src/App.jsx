import { useEffect, useState } from "react"
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom"

import PublicLayout from "./components/public/PublicLayout.jsx"
import Home from "./pages/public/Home.jsx"
import Features from "./pages/public/Features.jsx"
import Solutions from "./pages/public/Solutions.jsx"
import About from "./pages/public/About.jsx"
import Contact from "./pages/public/Contact.jsx"

import Login from "./pages/Login.jsx"
import Dashboard from "./pages/Dashboard.jsx"
import ServiceRequests from "./pages/ServiceRequests.jsx"
import ServiceRequestDetail from "./pages/ServiceRequestDetail.jsx"
import Customers from "./pages/Customers.jsx"
import CustomerDetail from "./pages/CustomerDetail.jsx"
import Members from "./pages/Members.jsx"
import MyJobs from "./pages/MyJobs.jsx"
import Settings from "./pages/Settings.jsx"
import MemberDetail from "./pages/MemberDetail.jsx"

import {
  getCurrentRole
} from "./services/api.js"


function ProtectedRoute({
  children,
  roles
}) {
  const [, refreshSession] = useState(0)

  useEffect(() => {
    const refresh = () => refreshSession(value => value + 1)
    window.addEventListener("bizflow:session-expired", refresh)
    return () => window.removeEventListener("bizflow:session-expired", refresh)
  }, [])

  const token =
    localStorage.getItem(
      "token"
    )

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
      />
    )
  }


  if (roles?.length) {
    const role =
      getCurrentRole()

    if (!role || !["OWNER", "MANAGER", "TECHNICIAN"].includes(role)) {
      return <Navigate to="/login" replace />
    }

    if (
      !roles.includes(role)
    ) {
      return (
        <Navigate
          to={
            role ===
            "TECHNICIAN"
              ? "/my-jobs"
              : "/dashboard"
          }
          replace
        />
      )
    }
  }


  return children
}


function App() {
  return (
    <BrowserRouter>

      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        <Route
          path="/login"
          element={
            <Login />
          }
        />


        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              roles={[
                "OWNER",
                "MANAGER"
              ]}
            >
              <Dashboard />
            </ProtectedRoute>
          }
        />


        <Route
          path="/service-requests"
          element={
            <ProtectedRoute
              roles={[
                "OWNER",
                "MANAGER"
              ]}
            >
              <ServiceRequests />
            </ProtectedRoute>
          }
        />


        <Route
          path="/service-requests/:id"
          element={
            <ProtectedRoute
              roles={[
                "OWNER",
                "MANAGER",
                "TECHNICIAN"
              ]}
            >
              <ServiceRequestDetail />
            </ProtectedRoute>
          }
        />


        <Route
          path="/customers"
          element={
            <ProtectedRoute
              roles={[
                "OWNER",
                "MANAGER"
              ]}
            >
              <Customers />
            </ProtectedRoute>
          }
        />


        <Route
          path="/customers/:id"
          element={
            <ProtectedRoute
              roles={[
                "OWNER",
                "MANAGER"
              ]}
            >
              <CustomerDetail />
            </ProtectedRoute>
          }
        />


        <Route
          path="/members"
          element={
            <ProtectedRoute
              roles={[
                "OWNER",
                "MANAGER"
              ]}
            >
              <Members />
            </ProtectedRoute>
            
          }
        />

        <Route
          path="/members/:id"
          element={
            <ProtectedRoute
              roles={[
                "OWNER",
                "MANAGER"
              ]}
            >
              <MemberDetail />
            </ProtectedRoute>
          }
        />


        <Route
          path="/my-jobs"
          element={
            <ProtectedRoute
              roles={[
                "TECHNICIAN"
              ]}
            >
              <MyJobs />
            </ProtectedRoute>
          }
        />


        <Route
          path="/settings"
          element={
            <ProtectedRoute
              roles={[
                "OWNER",
                "MANAGER",
                "TECHNICIAN"
              ]}
            >
              <Settings />
            </ProtectedRoute>
          }
        />


        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  )
}


export default App