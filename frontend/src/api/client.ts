import { z } from 'zod'

const API_URL = import.meta.env.VITE_API_URL

export type Credentials = {
  username: string
  password: string
}

export class ApiError extends Error {
  readonly status: number
  readonly body: unknown

  constructor(status: number, body: unknown) {
    super(`API error ${status}`)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

export async function apiFetch<T>(
  path: string,
  schema: z.ZodType<T>,
  credentials?: Credentials | null,
  init?: RequestInit
): Promise<T> {
  if (!API_URL) {
    throw new Error('VITE_API_URL is not set in .env')
  }

  const requestHeaders: Headers = new Headers(init?.headers)
  if (!requestHeaders.has('Content-Type')) {
    requestHeaders.set('Content-Type', 'application/json')
  }

  if (credentials) {
    const auth = btoa(`${credentials.username}:${credentials.password}`)
    requestHeaders.set('Authorization', `Basic ${auth}`)
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: requestHeaders,
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new ApiError(response.status, body)
  }

  if (response.status === 204) {
    return schema.parse(undefined)
  }

  const json = await response.json().catch(() => {
    throw new ApiError(response.status, { detail: 'Invalid JSON response from server' })
  })
  
  return schema.parse(json)
}

export async function apiDownload(
  path: string,
  filename: string,
  credentials?: Credentials | null,
  init?: RequestInit
): Promise<void> {
  if (!API_URL) {
    throw new Error('VITE_API_URL is not set in .env')
  }

  const requestHeaders: Headers = new Headers(init?.headers)
  
  if (credentials) {
    const auth = btoa(`${credentials.username}:${credentials.password}`)
    requestHeaders.set('Authorization', `Basic ${auth}`)
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: requestHeaders,
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new ApiError(response.status, body)
  }

  // Guard: ensure the server returned the expected file type
  const contentType = response.headers.get('content-type') ?? ''
  const expectedType = filename.endsWith('.pdf') ? 'application/pdf' : 'text/csv'
  if (!contentType.includes(expectedType)) {
    throw new ApiError(response.status, {
      detail: `Server returned unexpected content type "${contentType}" — expected "${expectedType}".`,
    })
  }

  // Prefer filename from Content-Disposition header (now CORS-exposed by backend)
  // Fall back to the filename argument if the header is absent or unparseable
  const disposition = response.headers.get('content-disposition') ?? ''
  const match = disposition.match(/filename=([^;]+)/)
  const downloadFilename = match ? match[1].trim().replace(/"/g, '') : filename

  const blob = await response.blob()
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.style.display = 'none'
  a.href = url
  a.download = downloadFilename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => {
    window.URL.revokeObjectURL(url)
  }, 1000)
}
