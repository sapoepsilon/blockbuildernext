'use client';

import React from 'react';
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Trash2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

const formSchema = z.object({
  name: z.string().min(1, "Container name is required"),
  image: z.string().min(1, "Image name is required"),
  cpu: z.number().min(0.1).max(8),
  memory: z.number().min(0.5).max(16),
  ports: z.array(z.object({
    hostPort: z.number().min(1).max(65535),
    containerPort: z.number().min(1).max(65535)
  })).default([]),
  environment: z.array(z.object({
    key: z.string().min(1),
    value: z.string()
  })).default([])
})

type FormValues = z.infer<typeof formSchema>

interface Props {
  onSuccess?: () => void;
}

export function ContainerForm({ onSuccess }: Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cpu: 1,
      memory: 1,
      ports: [],
      environment: []
    }
  })

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await fetch('/api/containers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create container');
      }

      onSuccess?.();
      form.reset();
    } catch (error) {
      console.error('Error creating container:', error);
    }
  }

  const addPort = () => {
    const currentPorts = form.getValues('ports');
    form.setValue('ports', [...currentPorts, { hostPort: 80, containerPort: 80 }]);
  }

  const removePort = (index: number) => {
    const currentPorts = form.getValues('ports');
    form.setValue('ports', currentPorts.filter((_, i) => i !== index));
  }

  const addEnvironmentVariable = () => {
    const currentEnv = form.getValues('environment');
    form.setValue('environment', [...currentEnv, { key: '', value: '' }]);
  }

  const removeEnvironmentVariable = (index: number) => {
    const currentEnv = form.getValues('environment');
    form.setValue('environment', currentEnv.filter((_, i) => i !== index));
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Container Name</FormLabel>
                <FormControl>
                  <Input placeholder="my-container" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <Input placeholder="nginx:latest" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="cpu"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CPU Cores</FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    <Slider
                      min={0.1}
                      max={8}
                      step={0.1}
                      value={[field.value]}
                      onValueChange={([value]) => field.onChange(value)}
                    />
                    <div className="text-sm text-muted-foreground text-right">
                      {field.value} cores
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="memory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Memory (GB)</FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    <Slider
                      min={0.5}
                      max={16}
                      step={0.5}
                      value={[field.value]}
                      onValueChange={([value]) => field.onChange(value)}
                    />
                    <div className="text-sm text-muted-foreground text-right">
                      {field.value} GB
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Port Mappings</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addPort}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Port
            </Button>
          </div>
          <ScrollArea className="h-[200px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Host Port</TableHead>
                  <TableHead>Container Port</TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {form.watch('ports').map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`ports.${index}.hostPort`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`ports.${index}.containerPort`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removePort(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Environment Variables</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addEnvironmentVariable}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Variable
            </Button>
          </div>
          <ScrollArea className="h-[200px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Key</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {form.watch('environment').map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`environment.${index}.key`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`environment.${index}.value`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeEnvironmentVariable(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="submit">Create Container</Button>
        </div>
      </form>
    </Form>
  );
}
