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

function inputClassName(hasError: boolean): string {
  const base =
    'mt-1 block w-full rounded-md border bg-white px-3 py-2 text-slate-900 shadow-xs focus:ring-2 focus:outline-none'

  return hasError
    ? `${base} border-red-600 focus:ring-red-600`
    : `${base} border-slate-300 focus:border-teal-600 focus:ring-teal-600`
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
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700">
          Courriel
        </label>
        <input
          id="email"
          type="email"
          autoComplete="username"
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? 'email-error' : undefined}
          className={inputClassName(Boolean(errors.email))}
          {...register('email')}
        />
        {errors.email && (
          <p id="email-error" className="mt-1 text-sm text-red-700">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-slate-700">
          Mot de passe
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          aria-invalid={errors.password ? true : undefined}
          aria-describedby={errors.password ? 'password-error' : undefined}
          className={inputClassName(Boolean(errors.password))}
          {...register('password')}
        />
        {errors.password && (
          <p id="password-error" className="mt-1 text-sm text-red-700">
            {errors.password.message}
          </p>
        )}
      </div>

      {serverError && (
        <p
          role="alert"
          className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-800 ring-1 ring-red-200"
        >
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={loginMutation.isPending}
        className="w-full rounded-md bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loginMutation.isPending ? 'Connexion…' : 'Se connecter'}
      </button>
    </form>
  )
}
