'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '../ui/alert'

interface FileUploaderProps {
  files: File[]
  onFilesChange: (files: File[]) => void
  onValidationStatusChange: (isValidating: boolean) => void
}

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

export function FileUploader({ files, onFilesChange, onValidationStatusChange }: FileUploaderProps) {
  const [error, setError] = useState<string>('')
  const [uploadProgress, setUploadProgress] = useState(0)

  const validateFiles = (acceptedFiles: File[]) => {
    // Check file size
    const oversizedFiles = acceptedFiles.filter(file => file.size > MAX_FILE_SIZE)
    if (oversizedFiles.length > 0) {
      setError('Some files exceed the 50MB size limit')
      return false
    }

    // Check for package.json
    const hasPackageJson = acceptedFiles.some(file => 
      file.name === 'package.json' || file.webkitRelativePath.endsWith('package.json')
    )
    if (!hasPackageJson) {
      setError('Missing package.json file')
      return false
    }

    return true
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError('')
    onValidationStatusChange(true)

    if (validateFiles(acceptedFiles)) {
      onFilesChange(acceptedFiles)
      // Simulate upload progress
      let progress = 0
      const interval = setInterval(() => {
        progress += 10
        setUploadProgress(progress)
        if (progress >= 100) {
          clearInterval(interval)
          onValidationStatusChange(false)
        }
      }, 200)
    } else {
      onValidationStatusChange(false)
    }
  }, [onFilesChange, onValidationStatusChange])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  })

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary'}`}
      >
        <input {...getInputProps()} />
        <div className="space-y-2">
          <p className="text-lg font-medium">
            {isDragActive ? 'Drop your files here' : 'Drag and drop your project files here'}
          </p>
          <p className="text-sm text-gray-500">or click to select files</p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          <p className="font-medium">Uploaded Files ({files.length})</p>
          <Progress value={uploadProgress} className="w-full" />
          <ul className="space-y-1">
            {files.slice(0, 5).map((file, index) => (
              <li key={index} className="text-sm text-gray-600">
                {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </li>
            ))}
            {files.length > 5 && <li className="text-sm text-gray-600">...and {files.length - 5} more</li>}
          </ul>
        </div>
      )}

      {files.length > 0 && (
        <Button 
          onClick={() => {
            onFilesChange([])
            setUploadProgress(0)
          }}
          variant="outline"
        >
          Clear Files
        </Button>
      )}
    </div>
  )
}
