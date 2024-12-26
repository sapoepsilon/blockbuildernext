'use client'

import { CheckCircle, Clock, AlertCircle, Loader2 } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

interface DeploymentStatusProps {
  status: 'idle' | 'validating' | 'deploying' | 'completed' | 'error'
}

export function DeploymentStatus({ status }: DeploymentStatusProps) {
  const getStatusDetails = () => {
    switch (status) {
      case 'idle':
        return {
          icon: <Clock className="w-6 h-6 text-gray-500" />,
          title: 'Waiting to Start',
          description: 'Upload your project files to begin deployment',
          progress: 0,
        }
      case 'validating':
        return {
          icon: <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />,
          title: 'Validating Project',
          description: 'Checking project structure and dependencies',
          progress: 25,
        }
      case 'deploying':
        return {
          icon: <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />,
          title: 'Deploying',
          description: 'Building and deploying your application',
          progress: 75,
        }
      case 'completed':
        return {
          icon: <CheckCircle className="w-6 h-6 text-green-500" />,
          title: 'Deployment Complete',
          description: 'Your application is now live',
          progress: 100,
        }
      case 'error':
        return {
          icon: <AlertCircle className="w-6 h-6 text-red-500" />,
          title: 'Deployment Failed',
          description: 'There was an error during deployment',
          progress: 100,
        }
    }
  }

  const details = getStatusDetails()

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        {details.icon}
        <div>
          <h3 className="text-lg font-medium">{details.title}</h3>
          <p className="text-sm text-gray-500">{details.description}</p>
        </div>
      </div>

      <Progress value={details.progress} className="w-full" />

      {status === 'completed' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-medium text-green-800">Deployment URL</h4>
          <p className="text-sm text-green-600">https://your-app.example.com</p>
        </div>
      )}

      {status === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="font-medium text-red-800">Error Details</h4>
          <p className="text-sm text-red-600">Failed to install dependencies. Check your package.json file.</p>
        </div>
      )}
    </div>
  )
}
