import { useHealth } from '../hooks/useHealth'
import { HealthStatus } from './HealthStatus'

export function HealthPanel() {
  const { data, isPending, isError } = useHealth()

  if (isPending) {
    return <p>Vérification en cours…</p>
  }

  if (isError) {
    return <p role="alert">Impossible de joindre l'API.</p>
  }

  return <HealthStatus health={data} />
}
