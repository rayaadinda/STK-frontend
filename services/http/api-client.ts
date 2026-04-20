import { backendUrl } from "@/lib/backend"

type SuccessEnvelope<T> = {
  success: true
  message?: string
  data: T
}

type ErrorEnvelope = {
  success: false
  error: {
    code: string
    message: string
    details?: unknown
  }
}

type Envelope<T> = SuccessEnvelope<T> | ErrorEnvelope

export class ApiError extends Error {
  readonly statusCode: number
  readonly code?: string
  readonly details?: unknown

  constructor(message: string, statusCode: number, code?: string, details?: unknown) {
    super(message)
    this.name = "ApiError"
    this.statusCode = statusCode
    this.code = code
    this.details = details
  }
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(backendUrl(path), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  })

  const rawBody = await response.text()
  let payload: Envelope<T> | null = null

  if (rawBody) {
    try {
      payload = JSON.parse(rawBody) as Envelope<T>
    } catch {
      payload = null
    }
  }

  if (!response.ok) {
    if (payload && !payload.success) {
      throw new ApiError(payload.error.message, response.status, payload.error.code, payload.error.details)
    }

    throw new ApiError(`Request failed with status ${response.status}`, response.status)
  }

  if (!payload || !payload.success) {
    throw new ApiError("Invalid API response format.", response.status)
  }

  return payload.data
}
