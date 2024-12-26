'use client'

import { useState } from 'react'
import { FileUploader } from './FileUploader'
import { ConfigEditor } from './ConfigEditor'
import { DeploymentStatus } from './DeploymentStatus'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function DeploymentInterface() {
  const [projectFiles, setProjectFiles] = useState<File[]>([])
  const [deploymentStatus, setDeploymentStatus] = useState<'idle' | 'validating' | 'deploying' | 'completed' | 'error'>('idle')
  
  return (
    <Tabs defaultValue="upload" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="upload">Project Upload</TabsTrigger>
        <TabsTrigger value="config">Configuration</TabsTrigger>
        <TabsTrigger value="env">Environment</TabsTrigger>
        <TabsTrigger value="status">Status</TabsTrigger>
      </TabsList>
      
      <TabsContent value="upload">
        <Card className="p-6">
          <FileUploader 
            files={projectFiles}
            onFilesChange={setProjectFiles}
            onValidationStatusChange={(status) => setDeploymentStatus(status ? 'validating' : 'idle')}
          />
        </Card>
      </TabsContent>
      
      <TabsContent value="config">
        <Card className="p-6">
          <ConfigEditor />
        </Card>
      </TabsContent>
      
      <TabsContent value="status">
        <Card className="p-6">
          <DeploymentStatus status={deploymentStatus} />
        </Card>
      </TabsContent>
    </Tabs>
  )
}
