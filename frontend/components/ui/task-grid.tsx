import { TaskCard } from './task-card';
import { Skeleton } from './skeleton';

interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'completed';
  completed: boolean;
  priority?: 'critical' | 'high' | 'medium' | 'low';
  dueDate?: string;
  tags?: string[];
  estimatedTime?: number;
  actualTimeSpent?: number;
  dependencies?: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface TaskGridProps {
  tasks: Task[];
  loading?: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onToggle: (id: number, completed: boolean) => void;
}

export function TaskGrid({ tasks, loading, onEdit, onDelete, onToggle }: TaskGridProps) {
  if (loading) {
    return (
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        role="progressbar"
        aria-label="Loading tasks"
        aria-busy="true"
      >
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="p-5 border bg-background shadow-sm rounded-lg animate-pulse"
            role="status"
            aria-label="Loading task card"
          >
            <Skeleton className="h-6 w-3/4 mb-4 rounded-lg" />
            <Skeleton className="h-4 w-full mb-2 rounded-lg" />
            <Skeleton className="h-4 w-2/3 mb-4 rounded-lg" />
            <Skeleton className="h-8 w-full rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div
        className="text-center py-16 animate-fade-in"
        role="status"
        aria-label="No tasks available"
      >
        <div className="mx-auto w-24 h-24 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mb-6 animate-bounce">
          <svg
            className="w-12 h-12 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold animate-slide-up">No tasks yet</h3>
        <p className="text-muted-foreground mt-2 max-w-md mx-auto animate-slide-up">
          Get started by creating your first task to organize your work.
        </p>
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      role="list"
      aria-label="Task list"
    >
      {tasks.map((task, index) => (
        <div
          key={task.id}
          className="animate-fade-in-up"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <TaskCard
            id={task.id}
            title={task.title}
            description={task.description}
            status={task.status}
            completed={task.completed}
            priority="medium" // Default priority
            onEdit={onEdit}
            onDelete={onDelete}
            onToggle={onToggle}
            onStatusChange={() => {}} // No-op function
            onPriorityChange={() => {}} // No-op function
          />
        </div>
      ))}
    </div>
  );
}