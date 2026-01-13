'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { TaskTimeTracker } from './task-time-tracker';
import { TaskDependencyManager } from './task-dependency-manager';
import { priorityConfig, formatTime, calculateProgress } from '@/lib/task-types';
import { Calendar, Clock, Flag, Tag, Timer, AlertTriangle, Edit3, CheckCircle, Circle } from 'lucide-react';

interface TaskDetailModalProps {
  task: {
    id: number;
    title: string;
    description?: string;
    status: 'todo' | 'in-progress' | 'completed';
    completed: boolean;
    priority: 'critical' | 'high' | 'medium' | 'low';
    dueDate?: string;
    tags?: string[];
    estimatedTime?: number;
    actualTimeSpent?: number;
    timeLogged?: Array<{
      id: string;
      date: string;
      minutes: number;
    }>;
    dependencies?: string[];
    createdAt: string;
    updatedAt: string;
  };
  allTasks: Array<{
    id: number;
    title: string;
    status: 'todo' | 'in-progress' | 'completed';
  }>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updatedTask: any) => void;
  onTimeLog: (taskId: number, minutes: number) => void;
  onTimeDelete: (taskId: number, entryId: string) => void;
  onAddDependency: (taskId: number, dependencyId: string) => void;
  onRemoveDependency: (taskId: number, dependencyId: string) => void;
}

export function TaskDetailModal({
  task,
  allTasks,
  open,
  onOpenChange,
  onSave,
  onTimeLog,
  onTimeDelete,
  onAddDependency,
  onRemoveDependency
}: TaskDetailModalProps) {
  const [editedTask, setEditedTask] = useState({
    title: task.title,
    description: task.description || '',
    priority: task.priority,
    dueDate: task.dueDate || '',
    tags: task.tags || [],
    estimatedTime: task.estimatedTime || undefined,
  });

  const [currentTag, setCurrentTag] = useState('');

  const priorityInfo = priorityConfig[task.priority];
  const progressPercentage = calculateProgress(task.estimatedTime, task.actualTimeSpent);

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { formatted: date.toLocaleDateString(), isOverdue: true, days: Math.abs(diffDays) };
    } else if (diffDays === 0) {
      return { formatted: 'Today', isOverdue: false, days: 0 };
    } else if (diffDays === 1) {
      return { formatted: 'Tomorrow', isOverdue: false, days: 1 };
    } else {
      return { formatted: date.toLocaleDateString(), isOverdue: false, days: diffDays };
    }
  };

  const dueDateInfo = task.dueDate ? formatDate(task.dueDate) : null;

  const addTag = () => {
    if (currentTag.trim() && !editedTask.tags.includes(currentTag.trim())) {
      setEditedTask({
        ...editedTask,
        tags: [...editedTask.tags, currentTag.trim()]
      });
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setEditedTask({
      ...editedTask,
      tags: editedTask.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleSave = () => {
    onSave({
      ...task,
      ...editedTask
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Task Details: {task.title}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <Input
                  value={editedTask.title}
                  onChange={(e) => setEditedTask({...editedTask, title: e.target.value})}
                  className="h-10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Textarea
                  value={editedTask.description}
                  onChange={(e) => setEditedTask({...editedTask, description: e.target.value})}
                  rows={4}
                  className="resize-none"
                />
              </div>
            </div>

            {/* Status and Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <div className="flex items-center gap-2">
                  {task.status === 'todo' && <Circle className="h-4 w-4 text-blue-500" />}
                  {task.status === 'in-progress' && <Clock className="h-4 w-4 text-orange-500" />}
                  {task.status === 'completed' && <CheckCircle className="h-4 w-4 text-emerald-500" />}
                  <span className="capitalize">{task.status.replace('-', ' ')}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Priority</label>
                <select
                  value={editedTask.priority}
                  onChange={(e) => setEditedTask({...editedTask, priority: e.target.value as any})}
                  className="w-full h-10 rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            {/* Dates and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Due Date</label>
                <Input
                  type="date"
                  value={editedTask.dueDate}
                  onChange={(e) => setEditedTask({...editedTask, dueDate: e.target.value})}
                  className="h-10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Estimated Time (min)</label>
                <Input
                  type="number"
                  value={editedTask.estimatedTime || ''}
                  onChange={(e) => setEditedTask({...editedTask, estimatedTime: e.target.value ? Number(e.target.value) : undefined})}
                  min="1"
                  className="h-10"
                />
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-3">
              <label className="block text-sm font-medium mb-1">Tags</label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  placeholder="Add a tag..."
                  className="h-10"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addTag}
                  className="h-10"
                >
                  <Tag className="h-4 w-4" />
                </Button>
              </div>

              {editedTask.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {editedTask.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-xs hover:text-destructive"
                        aria-label={`Remove tag ${tag}`}
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {/* Priority Badge */}
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Flag className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Priority</span>
              </div>
              <Badge className={`w-full justify-center ${priorityInfo.color}`}>
                {priorityInfo.icon} {priorityInfo.label}
              </Badge>
            </div>

            {/* Due Date */}
            {dueDateInfo && (
              <div className={`p-4 rounded-lg ${dueDateInfo.isOverdue ? 'bg-red-500/10 border border-red-500/30' : 'bg-muted/30'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Due Date</span>
                </div>
                <div className={`text-sm ${dueDateInfo.isOverdue ? 'text-red-600 font-medium' : 'text-foreground'}`}>
                  {dueDateInfo.formatted}
                  {dueDateInfo.isOverdue && <AlertTriangle className="h-4 w-4 inline ml-1" />}
                </div>
              </div>
            )}

            {/* Time Tracking */}
            <TaskTimeTracker
              taskId={task.id}
              totalMinutes={task.actualTimeSpent || 0}
              timeEntries={task.timeLogged || []}
              onTimeLog={(minutes) => onTimeLog(task.id, minutes)}
              onTimeDelete={(entryId) => onTimeDelete(task.id, entryId)}
            />

            {/* Dependencies */}
            <TaskDependencyManager
              taskId={task.id}
              taskTitle={task.title}
              availableTasks={allTasks.filter(t => t.id !== task.id)}
              dependencies={task.dependencies || []}
              onAddDependency={(depId) => onAddDependency(task.id, depId)}
              onRemoveDependency={(depId) => onRemoveDependency(task.id, depId)}
            />

            {/* Progress */}
            {task.estimatedTime && task.actualTimeSpent !== undefined && (
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Timer className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Progress</span>
                  </div>
                  <span className="text-sm font-medium">{progressPercentage}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      progressPercentage > 100
                        ? 'bg-red-500'
                        : progressPercentage >= 90
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(100, progressPercentage)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{formatTime(task.actualTimeSpent)} / {formatTime(task.estimatedTime)}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}