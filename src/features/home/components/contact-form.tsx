import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { api } from '@/lib/api'

interface FormData {
  name: string
  email: string
  company: string
  phone: string
  message: string
}

interface FormErrors {
  email?: string
  phone?: string
}

export function ContactForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: ''
  })

  const validateForm = () => {
    const newErrors: FormErrors = {}
    let isValid = true

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email) {
      newErrors.email = 'L\'email est requis'
      isValid = false
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide'
      isValid = false
    }

    // Phone validation
    const phoneRegex = /^(\+33|0)[1-9](\d{2}){4}$/
    if (!formData.phone) {
      newErrors.phone = 'Le numéro de téléphone est requis'
      isValid = false
    } else if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Format de numéro de téléphone invalide'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      await api.post('/api/contact', formData)
      toast.success('Message envoyé avec succès')
      setFormData({ name: '', email: '', company: '', phone: '', message: '' })
      setErrors({})
    } catch (error) {
      console.error('Contact form error:', error)
      toast.error('Une erreur est survenue lors de l\'envoi du message')
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
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
          <Label htmlFor="phone_number">Numéro de téléphone</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            required
            value={formData.phone}
            onChange={handleChange}
            disabled={isLoading}
            placeholder="+33 6 00 00 00 00"
            className={errors.phone ? "border-red-500" : ""}
          />
          {errors.phone && (
            <p className="text-sm text-red-500">{errors.phone}</p>
          )}
        </div>
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