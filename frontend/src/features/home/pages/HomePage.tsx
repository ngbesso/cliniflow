import type { User } from '../../auth/api/authApi'
import { LogoutButton } from '../../auth/components/LogoutButton'
import { useCurrentUser } from '../../auth/hooks/useCurrentUser'
import { HealthPanel } from '../../health/components/HealthPanel'

const workspaceByRole: Record<User['role'], string> = {
  nurse: 'Triage et enregistrement des patients',
  doctor: "File d'attente et résultats de laboratoire",
  admin: "Gestion des comptes et journal d'audit",
}

export function HomePage() {
  const { data: user } = useCurrentUser()

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <p className="text-lg font-semibold text-teal-700">CliniFlow</p>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-slate-700">{user.name}</span>
            <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-medium text-teal-800 ring-1 ring-teal-200">
              {user.roleLabel}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 px-6 py-8">
        <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h1 className="text-xl font-semibold text-slate-900">Bonjour, {user.name}</h1>
          <p className="mt-1 text-slate-600">
            Votre espace : {workspaceByRole[user.role]}
          </p>
        </section>

        <HealthPanel />
      </main>
    </div>
  )
}
