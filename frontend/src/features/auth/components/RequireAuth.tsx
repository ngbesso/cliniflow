import type { ReactNode } from 'react'
import { Navigate } from 'react-router'
import { useCurrentUser } from '../hooks/useCurrentUser'

type Props = {
  children: ReactNode
}

export function RequireAuth({ children }: Props) {
  const { data: user, isPending } = useCurrentUser()

  if (isPending) {
    return <p>Chargement…</p>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}
