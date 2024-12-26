'use client'

import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'

const configTemplates = {
  basic: {
    name: 'Basic Node.js',
    config: {
      engine: 'node16',
      start: 'npm start',
      build: 'npm install && npm run build',
      port: 3000,
    },
  },
  typescript: {
    name: 'TypeScript',
    config: {
      engine: 'node16',
      start: 'npm start',
      build: 'npm install && npm run build',
      port: 3000,
      typescript: true,
      buildCommand: 'tsc',
    },
  },
  express: {
    name: 'Express.js',
    config: {
      engine: 'node16',
      start: 'node server.js',
      build: 'npm install',
      port: 3000,
      type: 'express',
    },
  },
}

export function ConfigEditor() {
  const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof configTemplates>('basic')
  const [config, setConfig] = useState(JSON.stringify(configTemplates.basic.config, null, 2))

  const handleTemplateChange = (value: keyof typeof configTemplates) => {
    setSelectedTemplate(value)
    setConfig(JSON.stringify(configTemplates[value].config, null, 2))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select template" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(configTemplates).map(([key, { name }]) => (
              <SelectItem key={key} value={key}>{name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={() => setConfig(JSON.stringify(configTemplates[selectedTemplate].config, null, 2))}>
          Reset to Template
        </Button>
      </div>

      <Card className="p-4">
        <Textarea
          value={config}
          onChange={(e) => setConfig(e.target.value)}
          className="font-mono h-[300px]"
          placeholder="Enter your configuration..."
        />
      </Card>

      <div className="flex justify-end">
        <Button onClick={() => {
          try {
            JSON.parse(config)
            // Here you would typically save the configuration
          } catch {
            alert('Invalid JSON configuration')
          }
        }}>
          Save Configuration
        </Button>
      </div>
    </div>
  )
}
