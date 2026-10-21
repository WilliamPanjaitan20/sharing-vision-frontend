import { LoaderCircle } from 'lucide-react'

export function Loading() {
  return (
    <div className="loading">
      <LoaderCircle />
      Loading articles...
    </div>
  )
}
