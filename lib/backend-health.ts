import { backendUrl } from "@/lib/backend"

export type BackendHealthSummary = {
  status: "online" | "offline"
  message: string
  checkedAt: string
}

export async function fetchBackendHealthSummary(): Promise<BackendHealthSummary> {
  const checkedAt = new Date().toISOString()

  try {
    const response = await fetch(backendUrl("/api/health"), {
      method: "GET",
      cache: "no-store",
    })

    if (!response.ok) {
      return {
        status: "offline",
        message: `Backend responded with status ${response.status}.`,
        checkedAt,
      }
    }

    return {
      status: "online",
      message: "Backend is reachable and ready for module integration.",
      checkedAt,
    }
  } catch {
    return {
      status: "offline",
      message: "Cannot reach backend yet. Ensure backend server is running.",
      checkedAt,
    }
  }
}
