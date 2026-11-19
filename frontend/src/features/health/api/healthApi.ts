import { z } from 'zod'
import { getJson } from '../../../shared/api/httpClient'

const checkStatusSchema = z.enum(['ok', 'down'])

export const healthSchema = z.object({
  status: z.enum(['ok', 'degraded']),
  checks: z.object({
    database: checkStatusSchema,
    redis: checkStatusSchema,
  }),
})

export type Health = z.infer<typeof healthSchema>

export async function fetchHealth(): Promise<Health> {
  const { body } = await getJson('/api/health')

  return healthSchema.parse(body)
}
