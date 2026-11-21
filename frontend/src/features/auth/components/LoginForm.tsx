import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { LoginError } from '../api/authApi'
import { useLogin } from '../hooks/useLogin'

const loginFormSchema = z.object({
  email: z.email('Saisissez un courriel valide.'),
  password: z.string().min(1, 'Saisissez votre mot de passe.'),
})

type LoginFormValues = z.infer<typeof loginFormSchema>

type Props = {
  onSuccess: () => void
}

export function LoginForm({ onSuccess }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginFormSchema) })

  const loginMutation = useLogin()

  const onSubmit = handleSubmit((values) => {
    loginMutation.mutate(values, { onSuccess })
  })

  let serverError: string | null = null
  if (loginMutation.error instanceof LoginError) {
    serverError = loginMutation.error.message
  } else if (loginMutation.error) {
    serverError = 'Une erreur est survenue. Réessayez plus tard.'
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <div>
        <label htmlFor="email">Courriel</label>
        <input
          id="email"
          type="email"
          autoComplete="username"
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? 'email-error' : undefined}
          {...register('email')}
        />
        {errors.email && <p id="email-error">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="password">Mot de passe</label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          aria-invalid={errors.password ? true : undefined}
          aria-describedby={errors.password ? 'password-error' : undefined}
          {...register('password')}
        />
        {errors.password && <p id="password-error">{errors.password.message}</p>}
      </div>

      {serverError && <p role="alert">{serverError}</p>}

      <button type="submit" disabled={loginMutation.isPending}>
        {loginMutation.isPending ? 'Connexion…' : 'Se connecter'}
      </button>
    </form>
  )
}
