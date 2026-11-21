import { z } from 'zod'
import {
  ensureCsrfCookie,
  getJson,
  HttpError,
  request,
} from '../../../shared/api/httpClient'

export const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  role: z.enum(['nurse', 'doctor', 'admin']),
  roleLabel: z.string(),
})

export type User = z.infer<typeof userSchema>

const userResponseSchema = z.object({ data: userSchema })

const errorResponseSchema = z.object({
  message: z.string(),
  errors: z.record(z.string(), z.array(z.string())).optional(),
})

export type Credentials = {
  email: string
  password: string
}

export class LoginError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'LoginError'
  }
}

export async function login(credentials: Credentials): Promise<User> {
  await ensureCsrfCookie()

  const { status, body } = await request('POST', '/api/login', credentials)

  if (status === 200) {
    return userResponseSchema.parse(body).data
  }

  const error = errorResponseSchema.safeParse(body)
  if ((status === 422 || status === 429) && error.success) {
    throw new LoginError(error.data.errors?.email?.[0] ?? error.data.message)
  }

  throw new HttpError(status, body)
}

export async function fetchCurrentUser(): Promise<User | null> {
  const { status, body } = await getJson('/api/user')

  if (status === 401) {
    return null
  }

  if (status !== 200) {
    throw new HttpError(status, body)
  }

  return userResponseSchema.parse(body).data
}

export async function logout(): Promise<void> {
  const { status, body } = await request('POST', '/api/logout')

  if (status !== 204 && status !== 401) {
    throw new HttpError(status, body)
  }
}
