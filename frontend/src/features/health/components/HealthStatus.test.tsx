import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { HealthStatus } from './HealthStatus'

describe('HealthStatus', () => {
    it('shows an operational system when every check is ok', () => {
        render(
            <HealthStatus health={{ status: 'ok', checks: { database: 'ok', redis: 'ok' } }} />,
        )

        expect(
            screen.getByRole('heading', { name: 'Système opérationnel' }),
        ).toBeInTheDocument()
    })

    it('flags the failing dependency', () => {
        render(
            <HealthStatus
                health={{ status: 'degraded', checks: { database: 'ok', redis: 'down' } }}
            />,
        )

        expect(screen.getByRole('heading', { name: 'Système dégradé' })).toBeInTheDocument()
        expect(screen.getByText('Redis : En panne')).toBeInTheDocument()
    })
})