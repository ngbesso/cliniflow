import type { QueryClient } from '@tanstack/react-query'
import { currentUserQueryKey } from './hooks/useCurrentUser'

const SESSION_EXPIRED_KEY = 'cliniflow.sessionExpired'

export function clearSession(queryClient: QueryClient): void {
  queryClient.clear()
  queryClient.setQueryData(currentUserQueryKey, null)
}

export function handleSessionExpired(queryClient: QueryClient): void {
  const wasLoggedIn = Boolean(queryClient.getQueryData(currentUserQueryKey))

  if (!wasLoggedIn) {
    return
  }

  sessionStorage.setItem(SESSION_EXPIRED_KEY, '1')
  clearSession(queryClient)
}

export function consumeSessionExpiredNotice(): boolean {
  const expired = sessionStorage.getItem(SESSION_EXPIRED_KEY) === '1'
  sessionStorage.removeItem(SESSION_EXPIRED_KEY)

  return expired
}
