'use client';

import React from 'react';
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Card } from "@/components/ui/card"

const formSchema = z.object({
  name: z.string().min(1, "Container name is required"),
  image: z.string().min(1, "Image name is required"),
  cpu: z.number().min(0.1).max(8),
  memory: z.number().min(0.5).max(16),
  ports: z.array(z.object({
    hostPort: z.number().min(1).max(65535),
    containerPort: z.number().min(1).max(65535)
  })).optional(),
  environment: z.array(z.object({
    key: z.string().min(1),
    value: z.string()
  })).optional()
})

type FormValues = z.infer<typeof formSchema>

export function ContainerForm() {
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
      // TODO: Implement API call to create container
      console.log('Creating container with values:', data);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      form.reset();
    } catch (error) {
      console.error('Failed to create container:', error);
    }
  }

  const addPortMapping = () => {
    const currentPorts = form.getValues('ports') || [];
    form.setValue('ports', [...currentPorts, { hostPort: 0, containerPort: 0 }]);
  }

  const addEnvironmentVariable = () => {
    const currentEnv = form.getValues('environment') || [];
    form.setValue('environment', [...currentEnv, { key: '', value: '' }]);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

        <FormField
          control={form.control}
          name="cpu"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CPU Allocation (cores)</FormLabel>
              <FormControl>
                <Slider
                  min={0.1}
                  max={8}
                  step={0.1}
                  value={[field.value]}
                  onValueChange={([value]) => field.onChange(value)}
                />
              </FormControl>
              <FormDescription>Current: {field.value} cores</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="memory"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Memory Allocation (GB)</FormLabel>
              <FormControl>
                <Slider
                  min={0.5}
                  max={16}
                  step={0.5}
                  value={[field.value]}
                  onValueChange={([value]) => field.onChange(value)}
                />
              </FormControl>
              <FormDescription>Current: {field.value} GB</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Port Mappings</h3>
            <Button
              type="button"
              variant="outline"
              onClick={addPortMapping}
            >
              Add Port Mapping
            </Button>
          </div>
          
          {form.watch('ports')?.map((_, index) => (
            <Card key={index} className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`ports.${index}.hostPort`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Host Port</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} max={65535} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`ports.${index}.containerPort`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Container Port</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} max={65535} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="mt-2"
                onClick={() => {
                  const currentPorts = form.getValues('ports') || [];
                  form.setValue('ports', currentPorts.filter((_, i) => i !== index));
                }}
              >
                Remove
              </Button>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Environment Variables</h3>
            <Button
              type="button"
              variant="outline"
              onClick={addEnvironmentVariable}
            >
              Add Environment Variable
            </Button>
          </div>
          
          {form.watch('environment')?.map((_, index) => (
            <Card key={index} className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`environment.${index}.key`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Key</FormLabel>
                      <FormControl>
                        <Input placeholder="VARIABLE_NAME" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`environment.${index}.value`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Value</FormLabel>
                      <FormControl>
                        <Input placeholder="value" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="mt-2"
                onClick={() => {
                  const currentEnv = form.getValues('environment') || [];
                  form.setValue('environment', currentEnv.filter((_, i) => i !== index));
                }}
              >
                Remove
              </Button>
            </Card>
          ))}
        </div>

        <Button type="submit" className="w-full">
          Create Container
        </Button>
      </form>
    </Form>
  );
}

export default ContainerForm;
