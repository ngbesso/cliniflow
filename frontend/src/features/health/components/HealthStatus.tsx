import type { Health } from '../api/healthApi'

type CheckName = keyof Health['checks']

const labels: Record<CheckName, string> = {
    database: 'Base de données',
    redis: 'Redis',
}

type Props = {
    health: Health
}

export function HealthStatus({ health }: Props) {
    const checkNames = Object.keys(health.checks) as CheckName[]

    return (
        <section aria-label="État du système">
            <h2>{health.status === 'ok' ? 'Système opérationnel' : 'Système dégradé'}</h2>
            <ul>
                {checkNames.map((name) => (
                    <li key={name}>
                        {labels[name]} : {health.checks[name] === 'ok' ? 'OK' : 'En panne'}
                    </li>
                ))}
            </ul>
        </section>
    )
}