import { describe, it, expect } from 'vitest'
import { GET } from '@/app/api/health/route'

describe('GET /api/health', () => {
  it('returns ok status', async () => {
    const response = await GET(new Request('https://example.com/api/health'))
    expect(response.status).toBe(200)
    const payload = await response.json()
    expect(payload).toEqual({ status: 'ok' })
  })
})
