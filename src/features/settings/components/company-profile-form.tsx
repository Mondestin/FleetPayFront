import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useUser } from '@/features/auth/hooks/use-user'
import { useMutation, useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { IconUpload } from '@tabler/icons-react'

const companySchema = z.object({
  name: z.string().min(2),
  address: z.string().min(2),
  phone: z.string().min(2),
  logo: z.instanceof(FileList).optional(),
})

type CompanyFormValues = z.infer<typeof companySchema>

export function CompanyProfileForm() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const { user } = useUser()
  const { data: company } = useQuery({
    queryKey: ['company'],
    queryFn: () => api.get(`/api/companies/${user?.id}`).then(res => res.data)
  })

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: company?.name || '',
      address: company?.address || '',
      phone: company?.phone || '',
    }
  })

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const mutation = useMutation({
    mutationFn: (data: FormData) => api.put(`/api/companies/${user?.id}`, data),
    onSuccess: () => {
      toast.success('Profil entreprise mis à jour avec succès')
    }
  })

  const onSubmit = (data: CompanyFormValues) => {
    const formData = new FormData()
    formData.append('name', data.name)
    if (data.logo?.[0]) {
      formData.append('logo', data.logo[0])
    }
    mutation.mutate(formData)
  }

  return (
    <div className="grid grid-cols-[1fr,300px] gap-8">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nom de l'entreprise</Label>
          <Input {...form.register('name')} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Adresse</Label>
          <Input {...form.register('address')} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <Input {...form.register('phone')} />
        </div>

        <div className="space-y-2">
          <Label>Manager</Label>
          <div className="text-sm text-muted-foreground">
            {user?.first_name} {user?.last_name}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Statut</Label>
          <div>
            <Badge variant={company?.status === 'active' ? 'success' : 'destructive'}>
              {company?.status === 'active' ? 'Actif' : 'Inactif'}
            </Badge>
          </div>
        </div>

        <Button type="submit" className="bg-[#01631b] hover:bg-[#01631b]/90">
          Mettre à jour
        </Button>
      </form>

      <div className="flex flex-col items-center gap-4">
        <Label htmlFor="logo">Logo</Label>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm w-full aspect-square flex items-center justify-center overflow-hidden">
          {(previewUrl || company?.logo) ? (
            <img 
              src={previewUrl || company?.logo} 
              alt="Logo de l'entreprise" 
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="text-muted-foreground text-sm">
              Aucun logo
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <Input 
              type="file" 
              accept="image/*" 
              {...form.register('logo', {
                onChange: handleLogoChange
              })} 
              className="hidden" 
              id="logo"
            />
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => document.getElementById('logo')?.click()}
              className="w-full"
            >
              <IconUpload className="mr-2 h-4 w-4" />
              Choisir un fichier
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground text-center">
          Format recommandé: PNG, JPG
          <br />
          Taille maximale: 2MB
        </p>
      </div>
    </div>
  )
} 