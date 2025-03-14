import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useUser } from '@/features/auth/hooks/use-user'
import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { toast } from 'sonner'

const profileSchema = z.object({
  first_name: z.string().min(4, {message: "Le prénom doit contenir au moins 4 caractères"} ),
  last_name: z.string().min(4, {message: "Le nom doit contenir au moins 4 caractères"}),
  email: z.string().email({message: "L'email est invalide"}),
  phone_number: z.string().min(10, {message: "Le numéro de téléphone doit contenir au moins 10 chiffres"})
})

export function ProfileForm() {
  const { user } = useUser()
  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      phone_number: user?.phone_number || ''
    }
  })

  const mutation = useMutation({
    mutationFn: (data: z.infer<typeof profileSchema>) =>
      api.put(`/api/users/${user?.id}/profile`, data),
    onSuccess: () => {
      toast.success('Profil mis à jour avec succès')
    }
  })
  return (
    <form onSubmit={form.handleSubmit((data) => mutation.mutate({...data, phone_number: String(data.phone_number)}))} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first_name">Prénom</Label>
          <Input {...form.register('first_name')}/>
          <p className="text-sm text-red-500">{form.formState.errors.first_name?.message}</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="last_name">Nom</Label>
          <Input {...form.register('last_name')}  />
          <p className="text-sm text-red-500">{form.formState.errors.last_name?.message}</p>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input {...form.register('email')} type="email" />
        <p className="text-sm text-red-500">{form.formState.errors.email?.message}</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone_number">Téléphone</Label>
        <Input {...form.register('phone_number')} type="tel" />
        <p className="text-sm text-red-500">{form.formState.errors.phone_number?.message}</p>
      </div>
      <Button type="submit" className="bg-[#01631b] hover:bg-[#01631b]/90">
        Mettre à jour
      </Button>
    </form>
  )
} 