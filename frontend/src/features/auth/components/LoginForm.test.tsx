import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../test/renderWithProviders'
import { server } from '../../../test/server'
import { currentUserQueryKey } from '../hooks/useCurrentUser'
import { LoginForm } from './LoginForm'

const julie = {
  id: 1,
  name: 'Julie Infirmière',
  email: 'infirmiere@cliniflow.test',
  role: 'nurse',
  roleLabel: 'Infirmière',
}

function mockCsrfCookie() {
  server.use(
    http.get('*/sanctum/csrf-cookie', () => new HttpResponse(null, { status: 204 })),
  )
}

async function fillAndSubmit(email: string, password: string) {
  const user = userEvent.setup()
  await user.type(screen.getByLabelText('Courriel'), email)
  await user.type(screen.getByLabelText('Mot de passe'), password)
  await user.click(screen.getByRole('button', { name: 'Se connecter' }))
}

describe('LoginForm', () => {
  beforeEach(() => {
    document.cookie = 'XSRF-TOKEN=jeton-de-test'
    mockCsrfCookie()
  })

  it('shows validation errors without calling the API', async () => {
    const onSuccess = vi.fn()
    renderWithProviders(<LoginForm onSuccess={onSuccess} />)

    await userEvent.setup().click(screen.getByRole('button', { name: 'Se connecter' }))

    expect(await screen.findByText('Saisissez un courriel valide.')).toBeInTheDocument()
    expect(screen.getByText('Saisissez votre mot de passe.')).toBeInTheDocument()
    expect(screen.getByLabelText('Courriel')).toHaveAttribute('aria-invalid', 'true')
    expect(onSuccess).not.toHaveBeenCalled()
  })

  it('logs in, sends the CSRF token and stores the current user', async () => {
    let receivedToken: string | null = null
    server.use(
      http.post('*/api/login', ({ request }) => {
        receivedToken = request.headers.get('X-XSRF-TOKEN')
        return HttpResponse.json({ data: julie })
      }),
    )
    const onSuccess = vi.fn()
    const { queryClient } = renderWithProviders(<LoginForm onSuccess={onSuccess} />)

    await fillAndSubmit('infirmiere@cliniflow.test', 'password')

    await waitFor(() => expect(onSuccess).toHaveBeenCalledOnce())
    expect(receivedToken).toBe('jeton-de-test')
    expect(queryClient.getQueryData(currentUserQueryKey)).toEqual(julie)
  })

  it('shows the generic message when the credentials are rejected', async () => {
    server.use(
      http.post('*/api/login', () =>
        HttpResponse.json(
          {
            message: 'Identifiants invalides.',
            errors: { email: ['Identifiants invalides.'] },
          },
          { status: 422 },
        ),
      ),
    )
    const onSuccess = vi.fn()
    renderWithProviders(<LoginForm onSuccess={onSuccess} />)

    await fillAndSubmit('infirmiere@cliniflow.test', 'faux')

    expect(await screen.findByRole('alert')).toHaveTextContent('Identifiants invalides.')
    expect(onSuccess).not.toHaveBeenCalled()
  })

  it('shows the lockout message after too many attempts', async () => {
    server.use(
      http.post('*/api/login', () =>
        HttpResponse.json(
          { message: 'Trop de tentatives. Réessayez dans 42 secondes.' },
          { status: 429 },
        ),
      ),
    )
    renderWithProviders(<LoginForm onSuccess={vi.fn()} />)

    await fillAndSubmit('infirmiere@cliniflow.test', 'faux')

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Trop de tentatives. Réessayez dans 42 secondes.',
    )
  })

  it('shows a neutral message on an unexpected server error', async () => {
    server.use(http.post('*/api/login', () => new HttpResponse(null, { status: 500 })))
    renderWithProviders(<LoginForm onSuccess={vi.fn()} />)

    await fillAndSubmit('infirmiere@cliniflow.test', 'password')

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Une erreur est survenue. Réessayez plus tard.',
    )
  })
})
