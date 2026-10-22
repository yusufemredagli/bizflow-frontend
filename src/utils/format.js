const statusLabels = {
  OPEN: "Açık",
  ASSIGNED: "Atandı",
  ON_THE_WAY: "Yolda",
  IN_PROGRESS: "İşlemde",
  COMPLETED: "Tamamlandı",
  CANCELLED: "İptal"
}

const priorityLabels = {
  LOW: "Düşük",
  NORMAL: "Normal",
  HIGH: "Yüksek",
  URGENT: "Acil"
}

const roleLabels = {
  OWNER: "Şirket Sahibi",
  MANAGER: "Yönetici",
  TECHNICIAN: "Teknisyen"
}

const statusLabel = (value) =>
  statusLabels[value] || value

const priorityLabel = (value) =>
  priorityLabels[value] || value

const roleLabel = (value) =>
  roleLabels[value] || value


const formatDate = (date) => {
  if (!date || !Number.isFinite(new Date(date).getTime())) return "-"

  return new Intl.DateTimeFormat(
    "tr-TR",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }
  ).format(new Date(date))
}


const formatDateTime = (date) => {
  if (!date || !Number.isFinite(new Date(date).getTime())) {
    return "-"
  }

  return new Intl.DateTimeFormat(
    "tr-TR",
    {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    }
  ).format(new Date(date))
}


const formatShortDate = (date) => {
  if (!date || !Number.isFinite(new Date(date).getTime())) return "-"

  return new Intl.DateTimeFormat(
    "tr-TR",
    {
      day: "2-digit",
      month: "long",
      year: "numeric"
    }
  ).format(new Date(date))
}


const getSlaState = (
  slaDeadline,
  status
) => {
  if (!slaDeadline) {
    return {
      key: "none",
      label: "SLA yok",
      remainingMs: null
    }
  }

  if (
    status === "COMPLETED"
  ) {
    return {
      key: "completed",
      label: "Tamamlandı",
      remainingMs: null
    }
  }

  if (
    status === "CANCELLED"
  ) {
    return {
      key: "cancelled",
      label: "İptal",
      remainingMs: null
    }
  }

  const deadline =
    new Date(
      slaDeadline
    ).getTime()

  const now =
    Date.now()

  const remainingMs =
    deadline - now

  if (remainingMs <= 0) {
    return {
      key: "overdue",
      label: "Gecikmiş",
      remainingMs
    }
  }

  const remainingHours =
    remainingMs /
    (1000 * 60 * 60)

  if (remainingHours <= 1) {
    return {
      key: "risk",
      label: "SLA Riski",
      remainingMs
    }
  }

  return {
    key: "normal",
    label: "Normal",
    remainingMs
  }
}


const initials = (name = "") => {
  return name
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}


const serviceCode = (id) => {
  return `SR-${String(id).padStart(4, "0")}`
}


export {
  statusLabel,
  priorityLabel,
  roleLabel,
  formatDate,
  formatDateTime,
  formatShortDate,
  getSlaState,
  initials,
  serviceCode
}