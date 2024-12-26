import { Suspense } from 'react'
import DeploymentInterface from '@/components/deployment/DeploymentInterface'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export default function DeployPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-8">Deploy Node.js Project</h1>
      <Suspense fallback={<LoadingSpinner />}>
        <DeploymentInterface />
      </Suspense>
    </div>
  )
}
