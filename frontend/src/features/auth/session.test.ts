import { QueryClient } from '@tanstack/react-query'
import { beforeEach, describe, expect, it } from 'vitest'
import { currentUserQueryKey } from './hooks/useCurrentUser'
import { consumeSessionExpiredNotice, handleSessionExpired } from './session'

describe('session expiry', () => {
  beforeEach(() => sessionStorage.clear())

  it('clears the session and leaves a notice when a logged-in user expires', () => {
    const queryClient = new QueryClient()
    queryClient.setQueryData(currentUserQueryKey, { id: 1, name: 'Julie' })
    queryClient.setQueryData(['patients'], [{ id: 42 }])

    handleSessionExpired(queryClient)

    expect(queryClient.getQueryData(currentUserQueryKey)).toBeNull()
    expect(queryClient.getQueryData(['patients'])).toBeUndefined()
    expect(consumeSessionExpiredNotice()).toBe(true)
  })

  it('shows the notice only once', () => {
    const queryClient = new QueryClient()
    queryClient.setQueryData(currentUserQueryKey, { id: 1, name: 'Julie' })

    handleSessionExpired(queryClient)

    expect(consumeSessionExpiredNotice()).toBe(true)
    expect(consumeSessionExpiredNotice()).toBe(false)
  })

  it('does nothing for a visitor who was never logged in', () => {
    const queryClient = new QueryClient()

    handleSessionExpired(queryClient)

    expect(consumeSessionExpiredNotice()).toBe(false)
  })
})
