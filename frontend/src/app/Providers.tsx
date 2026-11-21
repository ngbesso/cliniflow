import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect, type ReactNode } from 'react'
import { BrowserRouter } from 'react-router'
import { handleSessionExpired } from '../features/auth/session'
import { setUnauthorizedListener } from '../shared/api/httpClient'

const queryClient = new QueryClient()

type Props = {
  children: ReactNode
}

export function Providers({ children }: Props) {
  useEffect(() => {
    setUnauthorizedListener(() => handleSessionExpired(queryClient))

    return () => setUnauthorizedListener(null)
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  )
}
