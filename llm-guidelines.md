# LLM Guidelines for Next.js 15 and React 18 Development

## Core Principles

1. **Server-First Approach**

   - Prioritize Server Components by default
   - Use Client Components only when necessary (interactive features, browser APIs)
   - Follow the "move down" principle for client-side code

2. **Type Safety**

   - Use TypeScript for all components and functions
   - Implement strict type checking
   - Define comprehensive interface definitions
   - Utilize Zod for runtime validation

3. **Performance Optimization**

   - Implement proper component segmentation
   - Use React Suspense boundaries
   - Optimize images with next/image
   - Implement proper loading states
   - Use streaming where applicable

4. **State Management**
   - Use Server Components for static data
   - Implement React Server Actions for mutations
   - Use React hooks for client-state
   - Follow immutability principles
   - Implement optimistic updates

## Project Structure

```
src/
├── app/                     # App router pages
│   ├── api/                # API routes
│   ├── (auth)/             # Auth-required routes
│   └── layout.tsx          # Root layout
├── components/             # React components
│   ├── ui/                 # shadcn/ui components
│   ├── forms/              # Form components
│   └── layouts/            # Layout components
└── lib/                    # Utility functions
    ├── actions/            # Server actions
    ├── api/                # API client
    └── utils/              # Helper functions
```

## Component Guidelines

1. **UI Components**

   - Use shadcn/ui components as the primary UI building blocks
   - Follow shadcn/ui installation process for each component
   - Customize components using the provided configuration files
   - Store shadcn/ui components in `components/ui`

2. **Component Structure**

   ```typescript
   import { Button } from "@/components/ui/button"
   import { type ComponentProps } from '@/types'

   interface Props extends ComponentProps {
     // Component-specific props
   }

   export function ComponentName({ ...props }: Props) {
     return (
       <div>
         <Button variant="outline">
           shadcn/ui Button
         </Button>
       </div>
     )
   }
   ```

3. **Error Handling**
   - Use `Alert` component from shadcn/ui for error states
   - Implement error boundaries
   - Provide fallback UI components
   - Handle loading states with shadcn/ui `Skeleton` component

## Form Handling

1. **Server Actions**

   ```typescript
   "use server";

   export async function submitForm(data: FormData) {
     const validated = validateFormData(data);
     return processFormData(validated);
   }
   ```

2. **Client Forms**

   ```typescript
   'use client'

   import { useForm } from 'react-hook-form'
   import { zodResolver } from '@hookform/resolvers/zod'
   import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
   import { Input } from "@/components/ui/input"

   export function FormComponent() {
     const form = useForm({
       resolver: zodResolver(schema)
     })

     return (
       <Form {...form}>
         <FormField
           name="example"
           render={({ field }) => (
             <FormItem>
               <FormLabel>Label</FormLabel>
               <Input {...field} />
               <FormMessage />
             </FormItem>
           )}
         />
       </Form>
     )
   }
   ```

## Dialog and Modal Implementation

```typescript
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function DialogExample() {
  return (
    <Dialog>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Example Dialog</DialogTitle>
        </DialogHeader>
        {/* Dialog content */}
      </DialogContent>
    </Dialog>
  )
}
```

## Styling Guidelines

1. **Tailwind CSS with shadcn/ui**

   - Use shadcn/ui's predefined style variants
   - Extend component themes using the shadcn/ui configuration
   - Follow Tailwind CSS best practices
   - Use CSS variables defined in globals.css

2. **Component Customization**
   ```typescript
   // Example of extending shadcn/ui components
   export function CustomButton() {
     return (
       <Button
         variant="outline"
         className="bg-primary hover:bg-primary/90"
       >
         Custom Button
       </Button>
     )
   }
   ```

## Loading States

```typescript
import { Skeleton } from "@/components/ui/skeleton"

export function LoadingState() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[200px]" />
    </div>
  )
}
```

The rest of the sections (Testing Guidelines, Performance Guidelines, API Integration, Security Guidelines, Documentation Requirements, Accessibility Guidelines, and Monitoring and Analytics) remain unchanged as they don't specifically relate to UI components.

## Component Installation

When adding new shadcn/ui components:

1. Use the CLI command:

   ```bash
   npx shadcn-ui@latest add [component-name]
   ```

2. Import components from the local ui directory:

   ```typescript
   import { Button } from "@/components/ui/button";
   import { Card } from "@/components/ui/card";
   ```

3. Customize component themes in:
   ```
   components/ui/[component-name].tsx
   ```

If you would have any questions, or would need any clarification, please ask a question in 1 or 2 sentences.
