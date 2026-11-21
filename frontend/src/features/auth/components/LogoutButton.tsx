import { useNavigate } from 'react-router'
import { useLogout } from '../hooks/useLogout'

export function LogoutButton() {
  const navigate = useNavigate()
  const logoutMutation = useLogout()

  return (
    <button
      type="button"
      onClick={() =>
        logoutMutation.mutate(undefined, {
          onSuccess: () => navigate('/login', { replace: true }),
        })
      }
      disabled={logoutMutation.isPending}
      className="rounded-md px-3 py-1.5 text-sm font-medium text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 disabled:opacity-60"
    >
      {logoutMutation.isPending ? 'Déconnexion…' : 'Déconnexion'}
    </button>
  )
}
