import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { Spinner } from '@/components/ui/spinner'
import { useEffect } from 'react'

const commissionSchema = z.object({
  commission: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Montant invalide')
})

type CommissionFormValues = z.infer<typeof commissionSchema>

export function CommissionSettings() {
  const queryClient = useQueryClient()
  
  const { data: commission, isLoading } = useQuery({
    queryKey: ['commission'],
    queryFn: () => api.get('/api/settings/commission').then(res => res.data),
  })

  const form = useForm<CommissionFormValues>({
    resolver: zodResolver(commissionSchema),
    defaultValues: {
      commission: '0'
    }
  })

  // Update form values when commission data loads
  useEffect(() => {
    if (commission) {
      form.reset({
        commission: commission.commission || '0'
      })
    }
  }, [commission, form])

  const mutation = useMutation({
    mutationFn: (data: CommissionFormValues) =>
      api.post('/api/settings/commission', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commission'] })
      toast.success('Commission mise à jour avec succès')
    }
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Montant de la commission (€)</Label>
          <Spinner />
        </div>
        <Button disabled className="bg-[#01631b] hover:bg-[#01631b]/90">
          Mettre à jour
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="commission">Montant de la commission (€)</Label>
        <Input {...form.register('commission')} type="number" step="0.01" />
      </div>
      <Button type="submit" className="bg-[#01631b] hover:bg-[#01631b]/90">
        Mettre à jour
      </Button>
    </form>
  )
} 