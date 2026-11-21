export type HttpResponse = {
  status: number
  body: unknown
}

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export class HttpError extends Error {
  readonly status: number
  readonly body: unknown

  constructor(status: number, body: unknown) {
    super(`Réponse HTTP inattendue : ${status}`)
    this.name = 'HttpError'
    this.status = status
    this.body = body
  }
}

type UnauthorizedListener = () => void

let unauthorizedListener: UnauthorizedListener | null = null

export function setUnauthorizedListener(listener: UnauthorizedListener | null): void {
  unauthorizedListener = listener
}

function readCookie(name: string): string | null {
  const cookie = document.cookie.split('; ').find((row) => row.startsWith(`${name}=`))

  return cookie ? decodeURIComponent(cookie.slice(name.length + 1)) : null
}

async function parseBody(response: Response): Promise<unknown> {
  const text = await response.text()

  return text === '' ? null : (JSON.parse(text) as unknown)
}

function toAbsoluteUrl(url: string): string {
  return new URL(url, window.location.origin).toString()
}

export async function request(
  method: Method,
  url: string,
  data?: unknown,
): Promise<HttpResponse> {
  const headers: Record<string, string> = { Accept: 'application/json' }

  if (data !== undefined) {
    headers['Content-Type'] = 'application/json'
  }

  const xsrfToken = readCookie('XSRF-TOKEN')
  if (method !== 'GET' && xsrfToken) {
    headers['X-XSRF-TOKEN'] = xsrfToken
  }

  const response = await fetch(toAbsoluteUrl(url), {
    method,
    headers,
    credentials: 'same-origin',
    body: data === undefined ? undefined : JSON.stringify(data),
  })

  if (response.status === 401 && unauthorizedListener) {
    unauthorizedListener()
  }

  return { status: response.status, body: await parseBody(response) }
}

export function getJson(url: string): Promise<HttpResponse> {
  return request('GET', url)
}

export async function ensureCsrfCookie(): Promise<void> {
  await fetch(toAbsoluteUrl('/sanctum/csrf-cookie'), { credentials: 'same-origin' })
}
