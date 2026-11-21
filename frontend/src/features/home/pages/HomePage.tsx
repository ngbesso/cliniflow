import type { User } from '../../auth/api/authApi'
import { useCurrentUser } from '../../auth/hooks/useCurrentUser'
import { HealthPanel } from '../../health/components/HealthPanel'

const workspaceByRole: Record<User['role'], string> = {
  nurse: 'Triage et enregistrement des patients',
  doctor: "File d'attente et résultats de laboratoire",
  admin: 'Gestion des comptes et journal d’audit',
}

export function HomePage() {
  const { data: user } = useCurrentUser()

  if (!user) {
    return null
  }

  return (
    <main>
      <h1>Bonjour, {user.name}</h1>
      <p>Connecté en tant que {user.roleLabel}</p>
      <p>Votre espace : {workspaceByRole[user.role]}</p>
      <HealthPanel />
    </main>
  )
}
