const API_URL =
  import.meta.env.VITE_API_URL?.trim().replace(/\/+$/, "")

if (!API_URL) {
  throw new Error(
    "VITE_API_URL environment değişkeni tanımlanmamış."
  )
}


const request = async (
  endpoint,
  options = {}
) => {
  const token =
    localStorage.getItem("token")

  const isFormData =
    options.body instanceof FormData

  const headers = {
    ...(token && {
      Authorization:
        `Bearer ${token}`
    }),

    ...(!isFormData && {
      "Content-Type":
        "application/json"
    }),

    ...options.headers
  }


  let response
  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers
    })
  } catch (error) {
    if (error.name === "AbortError") throw error
    throw new Error("Sunucuya bağlanılamadı. Lütfen tekrar deneyin.")
  }

  // Authentication must be handled even when a proxy returns HTML or an empty body.
  if (response.status === 401 && token &&
      localStorage.getItem("token") === token) {
    clearSession()
    window.dispatchEvent(new Event("bizflow:session-expired"))
  }

  if (response.status === 204) return null

  const contentType = response.headers.get("content-type") || ""
  let data
  try {
    if (!contentType.includes("application/json") &&
        !contentType.includes("+json")) {
      throw new Error("Invalid response")
    }
    data = await response.json()
  } catch {
    throw new Error(response.status === 401
      ? "Oturumunuz sona erdi. Lütfen tekrar giriş yapın."
      : "Sunucudan geçersiz yanıt geldi. Lütfen tekrar deneyin.")
  }

  if (!response.ok) {
    throw new Error(response.status >= 500
      ? "Sunucu hatası oluştu. Lütfen tekrar deneyin."
      : (typeof data?.message === "string" && data.message) || "İşlem başarısız")
  }


  return data
}


const saveSession = (
  loginResponse
) => {
  const token =
    loginResponse.data.token

  const user =
    loginResponse.data.user

  localStorage.setItem(
    "token",
    token
  )

  localStorage.setItem(
    "user",
    JSON.stringify(user)
  )
}


const clearSession = () => {
  localStorage.removeItem(
    "token"
  )

  localStorage.removeItem(
    "user"
  )
}


const getSessionUser = () => {
  const raw =
    localStorage.getItem(
      "user"
    )

  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}


const getCurrentRole = () => {
  const user =
    getSessionUser()

  return (
    user
      ?.memberships
      ?.[0]
      ?.role || null
  )
}


const loginRequest = (
  email,
  password
) => {
  return request(
    "/auth/login",
    {
      method: "POST",

      body:
        JSON.stringify({
          email,
          password
        })
    }
  )
}


const getDashboardSummary = (
  range = "7d"
) => {
  const params =
    new URLSearchParams({
      range
    })

  return request(
    `/dashboard/summary?${params.toString()}`
  )
}


const getDashboardActivity =
  () => {
    return request(
      "/dashboard/activity"
    )
  }


const getCustomers = ({
  page = 1,
  limit = 10,
  search = ""
} = {}) => {
  const params =
    new URLSearchParams({
      page:
        String(page),

      limit:
        String(limit),

      search
    })

  return request(
    `/customers?${params.toString()}`
  )
}


const createCustomer = (
  data
) => {
  return request(
    "/customers",
    {
      method: "POST",

      body:
        JSON.stringify(data)
    }
  )
}


const updateCustomer = (
  id,
  data
) => {
  return request(
    `/customers/${id}`,
    {
      method: "PATCH",

      body:
        JSON.stringify(data)
    }
  )
}


const deleteCustomer = (
  id
) => {
  return request(
    `/customers/${id}`,
    {
      method: "DELETE"
    }
  )
}


const getMembers = () => {
  return request(
    "/members"
  )
}


const createMember = (
  data
) => {
  return request(
    "/members",
    {
      method: "POST",

      body:
        JSON.stringify(data)
    }
  )
}


const getServiceRequests = ({
  page = 1,
  limit = 10,
  search = "",
  status = "",
  priority = "",
  filter = ""
} = {}) => {
  const params =
    new URLSearchParams({
      page:
        String(page),

      limit:
        String(limit)
    })

  if (search) {
    params.set(
      "search",
      search
    )
  }

  if (status) {
    params.set(
      "status",
      status
    )
  }

  if (priority) {
    params.set(
      "priority",
      priority
    )
  }

  if (filter) {
    params.set(
      "filter",
      filter
    )
  }

  return request(
    `/service-requests?${params.toString()}`
  )
}

const getServiceRequest = (
  id
) => {
  return request(
    `/service-requests/${id}`
  )
}


const createServiceRequest = (
  data
) => {
  return request(
    "/service-requests",
    {
      method: "POST",

      body:
        JSON.stringify(data)
    }
  )
}


const assignTechnician = (
  requestId,
  memberId
) => {
  return request(
    `/service-requests/${requestId}/assign`,
    {
      method: "POST",

      body:
        JSON.stringify({
          memberId
        })
    }
  )
}


const updateRequestStatus = (
  requestId,
  status
) => {
  return request(
    `/service-requests/${requestId}/status`,
    {
      method: "PATCH",

      body:
        JSON.stringify({
          status
        })
    }
  )
}


const getMyAssignedRequests =
  () => {
    return request(
      "/service-requests/my"
    )
  }


const getAttachments = (
  requestId
) => {
  return request(
    `/service-requests/${requestId}/attachments`
  )
}


const uploadAttachment = (
  requestId,
  file
) => {
  const formData =
    new FormData()

  formData.append(
    "file",
    file
  )

  return request(
    `/service-requests/${requestId}/attachments`,
    {
      method: "POST",
      body: formData
    }
  )
}

const deleteAttachment = (
  requestId,
  attachmentId
) => {
  return request(
    `/service-requests/${requestId}/attachments/${attachmentId}`,
    {
      method:
        "DELETE"
    }
  )
}

const completeServiceRequest = (
  requestId,
  data
) => {
  return request(
    `/service-requests/${requestId}/complete`,
    {
      method: "PATCH",
      body: JSON.stringify(data)
    }
  )
}


const getCustomer = (
  id
) => {
  return request(
    `/customers/${id}`
  )
}

const getMember = (
  id
) => {
  return request(
    `/members/${id}`
  )
}

export {
  loginRequest,

  saveSession,
  clearSession,
  getSessionUser,
  getCurrentRole,

  getDashboardSummary,
  getDashboardActivity,

  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,

  getMembers,
  createMember,

  getServiceRequests,
  getServiceRequest,
  createServiceRequest,
  assignTechnician,
  updateRequestStatus,
  getMyAssignedRequests,

  getAttachments,
  uploadAttachment,
  deleteAttachment,
  completeServiceRequest,

  getCustomer,
  getMember,
}