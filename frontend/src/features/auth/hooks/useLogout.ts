import { useMutation, useQueryClient } from '@tanstack/react-query'
import { logout } from '../api/authApi'
import { clearSession } from '../session'

export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      clearSession(queryClient)
    },
  })
}
