# Data Model: todo-frontend-ui

**Feature**: 001-todo-frontend-ui
**Created**: 2026-01-04

## Task Entity

**Fields:**
- id: string (unique identifier)
- title: string (required, max 255 characters)
- description: string (optional, max 1000 characters)
- completed: boolean (default: false)
- createdAt: Date (auto-generated)
- updatedAt: Date (auto-generated)

**Validation Rules:**
- Title must be 1-255 characters
- Description must be 0-1000 characters if provided
- Completed must be boolean
- createdAt and updatedAt are auto-generated timestamps

**State Transitions:**
- pending → completed (when checkbox is clicked)
- completed → pending (when checkbox is clicked again)

## User Session Entity

**Fields:**
- userId: string (unique identifier)
- token: string (authentication token)
- theme: 'light' | 'dark' (user preference)
- expiresAt: Date (session expiration)

**Validation Rules:**
- userId must exist
- token must be valid JWT
- theme must be 'light' or 'dark'
- expiresAt must be in the future

## UI State Models

### TaskForm State
- isOpen: boolean
- taskData: { title: string, description: string }
- errors: { title?: string, description?: string }
- isSubmitting: boolean

### Theme State
- currentTheme: 'light' | 'dark'
- systemTheme: 'light' | 'dark'

### Toast State
- id: string
- message: string
- type: 'success' | 'error' | 'info'
- duration: number