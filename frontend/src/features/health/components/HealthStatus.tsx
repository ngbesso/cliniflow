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
    <section
      aria-label="État du système"
      className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
    >
      <h2 className="text-base font-semibold text-slate-900">
        {health.status === 'ok' ? 'Système opérationnel' : 'Système dégradé'}
      </h2>
      <ul className="mt-3 space-y-1 text-sm">
        {checkNames.map((name) => {
          const isUp = health.checks[name] === 'ok'

          return (
            <li
              key={name}
              className={`flex items-center ${isUp ? 'text-slate-700' : 'font-medium text-red-700'}`}
            >
              <span
                aria-hidden="true"
                className={`mr-2 inline-block size-2 rounded-full ${isUp ? 'bg-green-600' : 'bg-red-600'}`}
              />
              {labels[name]} : {isUp ? 'OK' : 'En panne'}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
