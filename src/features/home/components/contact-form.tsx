import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

interface FormData {
  name: string
  email: string
  company: string
  message: string
}

export function ContactForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    message: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // TODO: Implement contact form submission
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulated API call
      toast.success('Message envoyé avec succès')
      setFormData({ name: '', email: '', company: '', message: '' })
    } catch (error) {
      toast.error('Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Nom complet</Label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            disabled={isLoading}
            placeholder="John Doe"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
            placeholder="john@example.com"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="company">Entreprise</Label>
        <Input
          id="company"
          name="company"
          type="text"
          required
          value={formData.company}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="Nom de votre entreprise"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          required
          value={formData.message}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="Comment pouvons-nous vous aider ?"
          className="min-h-[150px]"
        />
      </div>

      <Button 
        type="submit" 
        className="w-full bg-[#01631b] hover:bg-[#01631b]/90"
        disabled={isLoading}
      >
        {isLoading ? 'Envoi en cours...' : 'Envoyer le message'}
      </Button>
    </form>
  )
} 