import { useForm } from 'react-hook-form'
import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from '@/hooks/use-toast'
import { api } from '@/lib/api'
import React, { useState } from 'react'

const formSchema = z.object({
  commission: z.number().min(0, 'La commission doit être positive'),
})

export default function Settings() {
  const [isEditing, setIsEditing] = useState(false)
  const { data: commissionData } = useQuery({
    queryKey: ['commission'],
    queryFn: async () => {
      const response = await api.get('/api/settings/commission')
      return response.data
    }
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      commission: 0,
    },
  })

  React.useEffect(() => {
    if (commissionData) {
      form.setValue('commission', Number(commissionData.value))
    }
  }, [commissionData, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await api.post('/api/settings/commission', values)
      toast({
        title: 'Commission mise à jour',
        variant: 'default',
      })
      setIsEditing(false)
    } catch (error) {
      toast({
        title: 'Erreur lors de la mise à jour',
        variant: 'error',
      })
    }
  }

  return (
    <>
      <Header fixed>
        <div className="ml-auto flex items-center space-x-4">
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold">Paramètres</h1>
            <p className="text-muted-foreground">
              Gérez les paramètres de votre application
            </p>
          </div>

          <div className="grid gap-6 max-w-xl">
            <div className="space-y-4 rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Commission</h2>
                
              </div>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="commission"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Montant de la commission (€)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            disabled={!isEditing}
                            onChange={e => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? 'Annuler' : 'Modifier'}
                  </Button>

                  {isEditing && (
                    <Button 
                      type="submit"
                      className="bg-[#01631b] hover:bg-[#01631b]/90"
                    >
                      Enregistrer
                    </Button>
                  )}
                </form>
              </Form>
            </div>
          </div>
        </div>
      </Main>
    </>
  )
} 