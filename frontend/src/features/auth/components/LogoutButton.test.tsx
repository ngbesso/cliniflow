import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { MemoryRouter, Route, Routes } from 'react-router'
import { describe, expect, it } from 'vitest'
import { server } from '../../../test/server'
import { currentUserQueryKey } from '../hooks/useCurrentUser'
import { LogoutButton } from './LogoutButton'

function renderLoggedIn() {
  const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } })
  queryClient.setQueryData(currentUserQueryKey, { id: 1, name: 'Julie' })
  queryClient.setQueryData(['patients'], [{ id: 42, name: 'Patient confidentiel' }])

  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<LogoutButton />} />
          <Route path="/login" element={<p>Page de connexion</p>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )

  return queryClient
}

describe('LogoutButton', () => {
  it('logs out, clears every cached data and goes back to the login page', async () => {
    let logoutCalled = false
    server.use(
      http.post('*/api/logout', () => {
        logoutCalled = true
        return new HttpResponse(null, { status: 204 })
      }),
    )
    const queryClient = renderLoggedIn()

    await userEvent.setup().click(screen.getByRole('button', { name: 'Déconnexion' }))

    expect(await screen.findByText('Page de connexion')).toBeInTheDocument()
    expect(logoutCalled).toBe(true)
    expect(queryClient.getQueryData(currentUserQueryKey)).toBeNull()
    expect(queryClient.getQueryData(['patients'])).toBeUndefined()
  })
})
