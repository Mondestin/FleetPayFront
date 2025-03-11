import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { toast } from 'sonner'

const passwordSchema = z.object({
  current_password: z.string().min(6),
  new_password: z.string().min(6),
  confirm_password: z.string().min(6)
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirm_password"]
})

export function PasswordForm() {
  const form = useForm({
    resolver: zodResolver(passwordSchema)
  })

  const mutation = useMutation({
    mutationFn: (data: z.infer<typeof passwordSchema>) =>
      api.put('/api/users/password', data),
    onSuccess: () => {
      toast.success('Mot de passe mis à jour avec succès')
      form.reset()
    }
  })

  return (
    <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="current_password">Mot de passe actuel</Label>
        <Input type="password" {...form.register('current_password')} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="new_password">Nouveau mot de passe</Label>
        <Input type="password" {...form.register('new_password')} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirm_password">Confirmer le mot de passe</Label>
        <Input type="password" {...form.register('confirm_password')} />
      </div>
      <Button type="submit" className="bg-[#01631b] hover:bg-[#01631b]/90">
        Mettre à jour
      </Button>
    </form>
  )
} 