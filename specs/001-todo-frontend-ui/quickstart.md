# Quickstart Guide: todo-frontend-ui

**Feature**: 001-todo-frontend-ui
**Created**: 2026-01-04

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn package manager

### Setup Instructions

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install next react react-dom typescript @types/react @types/node @types/react-dom
   npm install tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

2. **Configure Tailwind CSS**
   ```bash
   npx shadcn-ui@latest init
   ```

3. **Install shadcn/ui components**
   ```bash
   npx shadcn-ui@latest add button card dialog input label textarea toast skeleton avatar
   ```

4. **Initialize Tailwind Configuration**
   Update `tailwind.config.js` with indigo-600 primary color and dark mode:
   ```js
   module.exports = {
     darkMode: ["class"],
     theme: {
       extend: {
         colors: {
           primary: {
             600: '#4f46e5',
           },
         },
       },
     },
   }
   ```

5. **Run Development Server**
   ```bash
   npm run dev
   ```

## Key Files Structure
- `app/` - Next.js App Router pages
- `components/` - Reusable UI components
- `lib/` - Utility functions (api.ts for API calls)
- `styles/` - Global styles and theme configuration

## Running the Application
The application will be available at `http://localhost:3000`

## Common Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server