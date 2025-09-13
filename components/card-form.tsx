'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { createCard } from '@/src/actions/deck-actions'
import type { CardFormData, PercentBand, Situation } from '@/src/types/domain'
import { CHARACTERS } from '@/src/types/domain'

interface CardFormProps {
  deckId?: string
  onSuccess?: () => void
  initialData?: Partial<CardFormData>
}

const PERCENT_BANDS: PercentBand[] = ['0-30', '40-70', '80+', 'Kill%']
const SITUATIONS: Situation[] = ['neutral', 'ledgetrap', 'edgeguard', 'recovery', 'combo', 'line']

export function CardForm({ deckId, onSuccess, initialData }: CardFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<CardFormData>({
    myChar: initialData?.myChar || '',
    oppChar: initialData?.oppChar || '',
    percentBand: initialData?.percentBand || '0-30',
    situation: initialData?.situation || 'neutral',
    oppMove: initialData?.oppMove || '',
    answerMD: initialData?.answerMD || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await createCard({ ...formData, deckId })
      
      if (result.success) {
        if (onSuccess) {
          onSuccess()
        } else {
          router.push(deckId ? `/deck/${deckId}` : '/deck')
        }
      } else {
        alert(result.error || 'Failed to create card')
      }
    } catch (error) {
      console.error('Error creating card:', error)
      alert('Failed to create card')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof CardFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Card</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                My Character
              </label>
              <Select
                value={formData.myChar}
                onChange={handleChange('myChar')}
                required
              >
                <option value="">Select character...</option>
                {CHARACTERS.map(char => (
                  <option key={char} value={char}>{char}</option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Opponent Character
              </label>
              <Select
                value={formData.oppChar}
                onChange={handleChange('oppChar')}
                required
              >
                <option value="">Select character...</option>
                {CHARACTERS.map(char => (
                  <option key={char} value={char}>{char}</option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Percent Band
              </label>
              <Select
                value={formData.percentBand}
                onChange={handleChange('percentBand')}
                required
              >
                {PERCENT_BANDS.map(band => (
                  <option key={band} value={band}>{band}</option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Situation
              </label>
              <Select
                value={formData.situation}
                onChange={handleChange('situation')}
                required
              >
                {SITUATIONS.map(situation => (
                  <option key={situation} value={situation}>
                    {situation.charAt(0).toUpperCase() + situation.slice(1)}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Opponent Move (Optional)
            </label>
            <Input
              type="text"
              value={formData.oppMove}
              onChange={handleChange('oppMove')}
              placeholder="e.g., Forward Smash, Neutral Air, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Answer (MDX)
            </label>
            <Textarea
              value={formData.answerMD}
              onChange={handleChange('answerMD')}
              placeholder="Describe the tactic using Markdown. You can use **bold**, *italic*, `code`, and [YouTube:VIDEO_ID] for embeds."
              rows={8}
              required
            />
            <p className="text-sm text-muted-foreground mt-1">
              Supports Markdown formatting and YouTube embeds with [YouTube:VIDEO_ID]
            </p>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Card'}
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
  )
}