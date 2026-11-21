import { http, HttpResponse } from 'msw'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { server } from '../../test/server'
import { getJson, setUnauthorizedListener } from './httpClient'

describe('httpClient', () => {
  afterEach(() => setUnauthorizedListener(null))

  it('notifies the listener when the API answers 401', async () => {
    const listener = vi.fn()
    setUnauthorizedListener(listener)
    server.use(http.get('*/api/patients', () => new HttpResponse(null, { status: 401 })))

    await getJson('/api/patients')

    expect(listener).toHaveBeenCalledOnce()
  })

  it('does not notify the listener on a successful response', async () => {
    const listener = vi.fn()
    setUnauthorizedListener(listener)
    server.use(http.get('*/api/patients', () => HttpResponse.json([])))

    await getJson('/api/patients')

    expect(listener).not.toHaveBeenCalled()
  })
})
