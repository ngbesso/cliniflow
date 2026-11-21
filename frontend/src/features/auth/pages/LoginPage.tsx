import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { LoginForm } from '../components/LoginForm'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { consumeSessionExpiredNotice } from '../session'

export function LoginPage() {
  const navigate = useNavigate()
  const { data: user } = useCurrentUser()
  const [sessionExpired] = useState(consumeSessionExpiredNotice)

  if (user) {
    return <Navigate to="/" replace />
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-2xl font-semibold text-teal-700">CliniFlow</p>
          <p className="mt-1 text-sm text-slate-600">Triage et suivi des patients</p>
        </div>

        <section className="rounded-xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <h1 className="mb-6 text-lg font-semibold text-slate-900">Connexion</h1>
          {sessionExpired && (
            <p
              role="status"
              className="mb-5 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-900 ring-1 ring-amber-200"
            >
              Votre session a expiré après une période d'inactivité. Reconnectez-vous.
            </p>
          )}
          <LoginForm onSuccess={() => navigate('/', { replace: true })} />
        </section>
      </div>
    </main>
  )
}
