const rawBackendUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080"

export const BACKEND_BASE_URL = rawBackendUrl.replace(/\/$/, "")

export function backendUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  return `${BACKEND_BASE_URL}${normalizedPath}`
}
