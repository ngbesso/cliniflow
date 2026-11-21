import { useHealth } from '../hooks/useHealth'
import { HealthStatus } from './HealthStatus'

export function HealthPanel() {
  const { data, isPending, isError } = useHealth()

  if (isPending) {
    return <p className="text-sm text-slate-600">Vérification en cours…</p>
  }

  if (isError) {
    return (
      <p
        role="alert"
        className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-800 ring-1 ring-red-200"
      >
        Impossible de joindre l'API.
      </p>
    )
  }

  return <HealthStatus health={data} />
}
