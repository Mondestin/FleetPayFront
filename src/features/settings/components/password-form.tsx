import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { useUser } from '@/features/auth/hooks/use-user'
import { AxiosError } from 'axios'

const passwordSchema = z.object({
  current_password: z.string().min(6, {message: "Le mot de passe doit contenir au moins 6 caractères"}),
  new_password: z.string().min(6, {message: "Le mot de passe doit contenir au moins 6 caractères"}) .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial"
  }),
  confirm_password: z.string().min(6, {message: "Le mot de passe doit contenir au moins 6 caractères"})
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirm_password"]
})

type PasswordFormValues = z.infer<typeof passwordSchema>

interface ApiErrorResponse {
  errors?: {
    current_password?: string;
    new_password?: string;
    confirm_password?: string;
  };
}

export function PasswordForm() {
  const { user } = useUser()
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema), 
  })

  const mutation = useMutation({
    //add the connected user to the api when changing the password
    mutationFn: (data: PasswordFormValues) => api.post(`/api/users/${user?.id}/password`, data),
    onSuccess: () => {
      toast.success('Mot de passe mis à jour avec succès')
      form.reset()
    },
    onError: (error: AxiosError) => {
      console.log(error)
      toast.error(error.message)
    }
  })

  return (
    <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="current_password">Mot de passe actuel</Label>
        <Input type="password" {...form.register('current_password')} />
        <p className="text-sm text-red-500">{form.formState.errors.current_password?.message}</p>
        {mutation.error && <p className="text-sm text-red-500">{(mutation.error as AxiosError<ApiErrorResponse>)?.response?.data?.errors?.current_password}</p>}
      </div>
      <div className="space-y-2"> 
        <Label htmlFor="new_password">Nouveau mot de passe</Label>
        <Input type="password" {...form.register('new_password')} />
        <p className="text-sm text-red-500">{form.formState.errors.new_password?.message}</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirm_password">Confirmer le mot de passe</Label>
        <Input type="password" {...form.register('confirm_password')} />
        <p className="text-sm text-red-500">{form.formState.errors.confirm_password?.message}</p>
      </div>
      <Button 
        type="submit" 
        className="bg-[#01631b] hover:bg-[#01631b]/90"
        disabled={mutation.isPending}
      >
        {mutation.isPending ? 'Mise à jour...' : 'Mettre à jour'}
      </Button>
    </form>
  )
} 