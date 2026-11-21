import { Navigate, useNavigate } from 'react-router'
import { LoginForm } from '../components/LoginForm'
import { useCurrentUser } from '../hooks/useCurrentUser'

export function LoginPage() {
  const navigate = useNavigate()
  const { data: user } = useCurrentUser()

  if (user) {
    return <Navigate to="/" replace />
  }

  return (
    <main>
      <h1>CliniFlow</h1>
      <h2>Connexion</h2>
      <LoginForm onSuccess={() => navigate('/', { replace: true })} />
    </main>
  )
}
