'use client';

import { useState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/app/ui/button';
import { createTask } from '@/app/lib/actions';
import { Plus, X, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CreateTaskButtonProps {
  boardId: string;
  onTaskCreate?: (task: any) => (realTask: any) => void;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <Button
      type="submit"
      variant="primary"
      disabled={pending}
    >
      {pending ? 'Creating...' : 'Create Task'}
    </Button>
  );
}

export default function CreateTaskButton({ boardId, onTaskCreate }: CreateTaskButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    // Extract form values for optimistic update
    const tempTask = {
      title: formData.get('title') as string,
      description: formData.get('description') as string || undefined,
      status: formData.get('status') as string || 'todo',
      priority: formData.get('priority') as string || 'medium',
      assignedTo: formData.get('assignedTo') as string || undefined,
      dueDate: formData.get('dueDate') as string || undefined,
    };
    
    // Close modal immediately
    setIsOpen(false);
    
    // Add task optimistically if callback provided
    let updateWithRealTask: ((realTask: any) => void) | undefined;
    if (onTaskCreate) {
      updateWithRealTask = onTaskCreate(tempTask);
    }
    
    // Send to server
    formData.append('boardId', boardId);
    const result = await createTask(formData);
    
    // Update with real task from server
    if (result.success && result.task && updateWithRealTask) {
      updateWithRealTask(result.task);
    } else if (!onTaskCreate) {
      // Fallback to refresh if no optimistic callback
      router.refresh();
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)} 
        className="h-9 px-3 rounded-md bg-zinc-900 text-white flex items-center gap-1.5 hover:bg-zinc-800 transition-colors text-xs font-medium cursor-pointer"
      >
        <Plus className="h-3 w-3" />
        Add Task
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-zinc-900">Create New Task</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form action={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-xs font-medium text-zinc-700 mb-1.5">
                  Task Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-md focus:outline-none focus:border-zinc-400 transition-colors"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="description" className="block text-xs font-medium text-zinc-700 mb-1.5">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-md focus:outline-none focus:border-zinc-400 transition-colors"
                  rows={3}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="status" className="block text-xs font-medium text-zinc-700 mb-1.5">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-md focus:outline-none focus:border-zinc-400 transition-colors"
                  defaultValue="todo"
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="priority" className="block text-xs font-medium text-zinc-700 mb-1.5">
                    Priority
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-md focus:outline-none focus:border-zinc-400 transition-colors"
                    defaultValue="medium"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="dueDate" className="block text-xs font-medium text-zinc-700 mb-1.5">
                    Due Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="dueDate"
                      name="dueDate"
                      className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-md focus:outline-none focus:border-zinc-400 transition-colors"
                      min={new Date().toISOString().split('T')[0]}
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="assignedTo" className="block text-xs font-medium text-zinc-700 mb-1.5">
                  Assigned To
                </label>
                <input
                  type="text"
                  id="assignedTo"
                  name="assignedTo"
                  placeholder="Enter name"
                  className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-md focus:outline-none focus:border-zinc-400 transition-colors"
                />
              </div>

              <div className="flex gap-3 justify-end">
                <Button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  variant="secondary"
                >
                  Cancel
                </Button>
                <SubmitButton />
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}