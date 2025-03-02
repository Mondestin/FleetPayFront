import { HTMLAttributes, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { cn } from '@/lib/utils'
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
import { PasswordInput } from '@/components/password-input'
import { useRouter } from '@tanstack/react-router'
import { Spinner } from '@/components/ui/spinner'
import { authService } from '../../data/auth-service'

type UserAuthFormProps = HTMLAttributes<HTMLDivElement>

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Veuillez entrer votre email' })
    .email({ message: 'Adresse email invalide' }),
  password: z
    .string()
    .min(1, {
      message: 'Veuillez entrer votre mot de passe',
    })
    .min(7, {
      message: 'Mot de passe doit contenir au moins 7 caractères',
    }),
})

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setError('')

    try {
      const response = await authService.login({
        email: values.email,
        password: values.password,
        device_name: 'iphone' // Or detect device name
      })
      
      authService.setToken(response.token)
      router.navigate({ to: '/dashboard' })
    } catch (err) {
      setError('Email ou mot de passe invalide')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-2'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder='name@example.com' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem className='space-y-1 mt-2'>
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder='********' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && (
              <div className="text-sm text-red-500 mt-2">
                {error}
              </div>
            )}
            <Button className='mt-2' disabled={isLoading} variant='primary'>
              {isLoading && <Spinner className="h-4 w-4 mr-2" />}
              Se connecter
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
