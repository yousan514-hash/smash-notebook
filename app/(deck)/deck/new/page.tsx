'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { createDeck } from '@/src/actions/deck-actions'
import type { DeckFormData } from '@/src/types/domain'

export default function NewDeckPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<DeckFormData>({
    name: '',
    description: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await createDeck(formData)
      
      if (result.success) {
        router.push('/deck')
      } else {
        alert(result.error || 'Failed to create deck')
      }
    } catch (error) {
      console.error('Error creating deck:', error)
      alert('Failed to create deck')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof DeckFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }))
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create New Deck</h1>
        <p className="text-muted-foreground">
          Create a new deck to organize your tactics cards
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Deck Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Deck Name *
              </label>
              <Input
                type="text"
                value={formData.name}
                onChange={handleChange('name')}
                placeholder="e.g., Fox Neutral Game, Marth Edgeguards"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Description (Optional)
              </label>
              <Textarea
                value={formData.description}
                onChange={handleChange('description')}
                placeholder="Brief description of what this deck covers..."
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Deck'}
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}