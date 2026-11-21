import type { ReactNode } from 'react'
import { Navigate } from 'react-router'
import { useCurrentUser } from '../hooks/useCurrentUser'

type Props = {
  children: ReactNode
}

export function RequireAuth({ children }: Props) {
  const { data: user, isPending } = useCurrentUser()

  if (isPending) {
    return (
      <p className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-600">
        Chargement…
      </p>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}
