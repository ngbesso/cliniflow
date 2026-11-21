import { useQuery } from '@tanstack/react-query'
import { fetchCurrentUser } from '../api/authApi'

export const currentUserQueryKey = ['currentUser'] as const

export function useCurrentUser() {
  return useQuery({
    queryKey: currentUserQueryKey,
    queryFn: fetchCurrentUser,
    staleTime: Infinity,
    retry: false,
  })
}
