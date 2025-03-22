import { useState, useEffect } from 'react'
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
import { queryClient } from '@/lib/query-client'
import { Spinner } from '@/components/ui/spinner'


const companySchema = z.object({
  name: z.string().min(5).max(20),
  address: z.string().min(10).max(20),
  phone: z.string()
    .min(10, {message: "Le numéro de téléphone doit contenir au moins 10 chiffres"})
    .max(10, {message: "Le numéro de téléphone doit contenir au plus 10 chiffres"})
    .regex(/^\d+$/, {message: "Le numéro de téléphone ne doit contenir que des chiffres"}),
  logo: z.union([
    z.instanceof(FileList).optional(),
    z.string().optional()
  ]).refine((value) => {
    if (!value) return true
    if (typeof value === 'string') return true
    if (value instanceof FileList && value.length > 0) {
      const file = value[0]
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/svg+xml']
      const isValidType = validTypes.includes(file.type)
      const isValidSize = file.size <= 2 * 1024 * 1024
      return isValidType && isValidSize
    }
    return true
  }, 'Le logo doit être une image de type: jpeg, png, jpg, gif, svg et ne pas dépasser 2MB')
})

type CompanyFormValues = z.infer<typeof companySchema>

export function CompanyProfileForm() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const { user } = useUser()
  
  const { data: company, isLoading } = useQuery({
    queryKey: ['company', user?.id],
    queryFn: () => api.get(`/api/companies/${user?.id}`).then(res => res.data)
  })

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: '',
      address: '',
      phone: '',
      logo: undefined
    }
  })

  useEffect(() => {
    if (company) {
      form.reset({
        name: company.name,
        address: company.address,
        phone: company.phone,
        logo: undefined // Don't try to set the logo from company data
      })
      // Set the preview URL from company logo if it exists
      if (company.logo) {
        setPreviewUrl(company.logo)
      }
    }
  }, [company, form])

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      const file = files[0]
      // Validate file size
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Le fichier ne doit pas dépasser 2MB')
        event.target.value = '' // Reset input
        return
      }
      
      // Convert to base64
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setPreviewUrl(base64String)
        // Update form with base64 string
        form.setValue('logo', base64String)
      }
      reader.readAsDataURL(file)
    }
  }

  const mutation = useMutation({
    mutationFn: (data: CompanyFormValues) => {
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('address', data.address)
      formData.append('phone', data.phone)
      
      // If logo is a base64 string, send it directly
      if (typeof data.logo === 'string') {
        formData.append('logo', data.logo)
      }
      
      return api.put(`/api/companies/${user?.id}`, formData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company', user?.id] })
      toast.success('Profil entreprise mis à jour avec succès')
    },
    onError: (error: any) => {
      console.error('Mutation error:', error)
      const errorMessage = error.response?.data?.message || 'Une erreur est survenue lors de la mise à jour du profil'
      toast.error(errorMessage)
    }
  })
  

  if (isLoading) {
    return (
      <div className="grid grid-cols-[1fr,300px] gap-8">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-[1fr,300px] gap-8">
      <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nom de l'entreprise</Label>
          <Input 
            {...form.register('name')} 
            placeholder="Nom de l'entreprise"
          />
          {form.formState.errors.name && (
            <p className="text-sm text-destructive">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Adresse</Label>
          <Input 
            {...form.register('address')} 
            placeholder="Adresse de l'entreprise"
          />
          {form.formState.errors.address && (
            <p className="text-sm text-destructive">
              {form.formState.errors.address.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <Input 
            {...form.register('phone')} 
            placeholder="Numéro de téléphone"
          />
          {form.formState.errors.phone && (
            <p className="text-sm text-destructive">
              {form.formState.errors.phone.message}
            </p>
          )}
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

        <Button 
          type="submit" 
          className="bg-[#01631b] hover:bg-[#01631b]/90"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? 'Mise à jour...' : 'Mettre à jour'}
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
              accept="image/jpeg,image/png,image/jpg,image/gif,image/svg+xml"
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
          {form.formState.errors.logo && (
            <p className="text-sm text-destructive">
              {form.formState.errors.logo.message}
            </p>
          )}
        </div>
        <p className="text-sm text-muted-foreground text-center">
          Format recommandé: JPEG, PNG, JPG, GIF, SVG
          <br />
          Taille maximale: 2MB
        </p>
      </div>
    </div>
  )
} 