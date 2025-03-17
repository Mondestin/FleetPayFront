import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { toast } from 'sonner'

const commissionSchema = z.object({
  commission: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Montant invalide')
})

export function CommissionSettings() {
  const queryClient = useQueryClient()
  const { data: commission } = useQuery({
    queryKey: ['commission'],
    queryFn: async () => {
      const response = await api.get('/api/settings/commission')
      return response.data
    }    
  })

  const form = useForm({
    resolver: zodResolver(commissionSchema),
    defaultValues: {
      commission: commission?.commission || '0'
    }
  })

  const mutation = useMutation({
    mutationFn: (data: z.infer<typeof commissionSchema>) =>
      api.post('/api/settings/commission', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commission'] })
      toast.success('Commission mise à jour avec succès')
    }
  })

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