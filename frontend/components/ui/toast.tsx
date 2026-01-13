import * as React from "react"

import { cn } from "@/lib/utils"

// Simple toast implementation since we can't install sonner
interface ToastProps {
  children?: React.ReactNode
  className?: string
  variant?: "default" | "success" | "error" | "info"
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    const [isVisible, setIsVisible] = React.useState(true)

    React.useEffect(() => {
      if (props.open !== undefined) {
        setIsVisible(props.open)
      }
    }, [props.open])

    if (!isVisible) return null

    const variantClasses = {
      default: "border border-gray-200 bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100",
      success: "border border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-900/30 dark:text-green-200",
      error: "border border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-900/30 dark:text-red-200",
      info: "border border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-200",
    }

    return (
      <div
        ref={ref}
        className={cn(
          "max-w-md rounded-md shadow-lg transition-all duration-300",
          variantClasses[variant],
          className
        )}
        {...props}
      >
        <div className="flex p-4">
          <div className="flex-1">{children}</div>
          <button
            onClick={() => {
              setIsVisible(false)
              if (props.onOpenChange) props.onOpenChange(false)
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
      </div>
    )
  }
)
Toast.displayName = "Toast"

interface ToastProviderProps {
  children: React.ReactNode
}

const ToastProvider = ({ children }: ToastProviderProps) => {
  return <>{children}</>
}

interface ToastViewportProps {
  children?: React.ReactNode
}

const ToastViewport = ({ children }: ToastViewportProps) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {children}
    </div>
  )
}

export { Toast, ToastProvider, ToastViewport }