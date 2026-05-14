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
    credentials: Credentials,
    init?: RequestInit,
): Promise<T> {
    if (!API_URL) {
        throw new Error('VITE_API_URL is not set in .env')
    }

    const auth = btoa(`${credentials.username}:${credentials.password}`)

    const response = await fetch(`${API_URL}${path}`, {
        ...init,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${auth}`,
            ...init?.headers,
        },
    })

    if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new ApiError(response.status, body)
    }

    const json = await response.json()
    return schema.parse(json)
}