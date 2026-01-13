---
id: 1
title: "Fix Login Page Auto-Refresh Issue"
stage: "refactor"
date: "2026-01-13"
surface: "agent"
model: "claude-sonnet-4-5-20250929"
feature: "none"
branch: "main"
user: "ADMIN"
command: "fix login auto-refresh"
labels: ["bug", "authentication", "ui"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - "frontend/contexts/AuthContext.tsx"
tests: []
---

# Fix Login Page Auto-Refresh Issue

## PROMPT_TEXT
The user is experiencing an issue where the login page auto-refreshes, preventing them from seeing login errors or success messages. Please investigate and fix this issue in the todo app. The frontend auto-refreshes after attempting to sign in, making it impossible to see if the login was successful or if there were any errors.

## RESPONSE_TEXT
Fixed the login page auto-refresh issue by removing unnecessary `router.refresh()` calls from the AuthContext.tsx file. The issue was in the login, signup, and logout functions where `router.refresh()` was being called immediately after navigation, causing the page to refresh and hide error/success messages.

Changes made:
1. Removed `router.refresh()` from login function after `router.push('/tasks')`
2. Removed `router.refresh()` from signup function after `router.push('/tasks')`
3. Removed `router.refresh()` from logout function after `router.push('/')`

Now error messages and success notifications will be visible to users before redirection occurs.

## OUTCOME
The login and signup pages no longer auto-refresh after form submission, allowing users to see error messages when authentication fails or success notifications when it succeeds. The redirect functionality remains intact.

## EVALUATION
The fix was successful - the auto-refresh behavior has been eliminated while preserving the authentication flow and redirect functionality.