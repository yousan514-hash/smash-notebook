import { CardForm } from '@/components/card-form'

export default function NewCardPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create New Card</h1>
        <p className="text-muted-foreground">
          Create a new tactics card (will be saved without a deck)
        </p>
      </div>

      <CardForm />
    </div>
  )
}