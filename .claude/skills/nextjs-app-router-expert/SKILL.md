# Next.js App Router Expert

A reusable skill for generating high-quality Next.js 16+ App Router code following best practices and consistent patterns.

## Core Principles

- Always use TypeScript
- Prefer server components by default, only use `'use client'` when needed (interactivity, hooks, etc.)
- Use Tailwind CSS classes for styling (no inline styles)
- Integrate shadcn/ui components whenever possible (Card, Button, Badge, Input, Table, Dialog, etc.)
- Handle data fetching properly with async/await + Suspense/loading states
- Use centralized API client from `lib/api.ts` with JWT token attachment
- Make components responsive (mobile-first) and dark-mode compatible
- Add basic accessibility (aria-labels, keyboard navigation where needed)
- Follow App Router file structure: `app/(dashboard)/tasks/page.tsx`, `components/TaskCard.tsx`, etc.

## Interface

This skill accepts natural language descriptions of desired functionality (e.g., "Create a task list page that fetches and displays tasks with loading state").

Optional structured parameters may be added later if needed.

## API Client Integration

- Assumes `lib/api.ts` exists with centralized API client (token attachment, base URL from env, error handling)
- Import and use as: `import { api } from '@/lib/api'; api.getTasks()`
- If client doesn't exist, suggest basic setup template as fallback

## File Generation & Organization

### File Generation
- Generate complete files from scratch by default (e.g., full `page.tsx`, `TaskCard.tsx`)
- Support modifying existing files when specified (e.g., "Add component to existing TaskList.tsx")
- Always include full file paths in output (e.g., `app/(dashboard)/tasks/page.tsx`)

### Component Organization
- Pages: `app/(dashboard)/.../page.tsx`
- Reusable components: `components/` (e.g., `components/TaskCard.tsx`)
- API client/utils: `lib/`
- Hooks: `hooks/` (if custom)
- When unsure, suggest path and ask for confirmation, but default to standard structure

## Error Handling

- Default: Suspense + loading fallback for data fetching
- Error states: Simple error message UI (e.g., `<div>Error loading tasks</div>`) + optional sonner/toast notification
- No full error boundary unless specifically requested (keep lightweight)

## Form Validation

- Preferred: Zod + React Hook Form (modern, type-safe, great DX)
- Fallback: built-in HTML validation for simple forms
- Always include Zod schema + RHF setup in form examples

## Typical Use Cases

### Create a page that fetches and displays data
```
User: "Create a task list page that fetches and displays tasks with loading state"
Skill: Generates server component with async data fetching, Suspense wrapper, loading fallback, and responsive grid layout using shadcn/ui Card components
```

### Build a form with validation
```
User: "Create a task form with validation using shadcn/ui components"
Skill: Generates client component with Zod schema, React Hook Form, and shadcn/ui form elements
```

### Make a responsive component
```
User: "Create a responsive task card that works on mobile and desktop"
Skill: Generates component with Tailwind responsive classes, dark mode support, and accessibility attributes
```

### Handle API calls with loading/error states
```
User: "Show how to handle loading and error states for API calls"
Skill: Demonstrates proper Suspense usage, error handling, and user feedback patterns
```

## Code Patterns to Follow

### Server Component with Data Fetching
```tsx
import { Suspense } from 'react'
import { api } from '@/lib/api'

interface PageProps {
  searchParams?: { [key: string]: string | string[] | undefined }
}

export default async function TasksPage({ searchParams }: PageProps) {
  const tasks = await api.getTasks(searchParams)

  return (
    <div className="container mx-auto py-6">
      <Suspense fallback={<TasksLoading />}>
        <TasksList initialTasks={tasks} />
      </Suspense>
    </div>
  )
}
```

### Client Component with Hooks
```tsx
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
})

type TaskFormData = z.infer<typeof taskSchema>

export function TaskForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  })

  // Implementation...
}
```

### API Client Usage
```tsx
// In server components
const tasks = await api.getTasks()

// In client components
const createTask = async (data: TaskCreateInput) => {
  try {
    const response = await api.createTask(data)
    // Handle success
  } catch (error) {
    // Handle error
  }
}
```

### Responsive & Accessible Components
```tsx
// Use Tailwind responsive classes and accessibility attributes
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <Card className="dark:bg-gray-800" aria-labelledby="task-title">
    {/* Content */}
  </Card>
</div>
```

## Quality Standards

- All components must be TypeScript compliant
- Follow mobile-first responsive design
- Include proper accessibility attributes
- Use dark mode compatible styling
- Implement proper error boundaries and loading states
- Follow Next.js App Router conventions
- Use shadcn/ui components where appropriate
- Include proper form validation for user input
- Follow consistent naming conventions