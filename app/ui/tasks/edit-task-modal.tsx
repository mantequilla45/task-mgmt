'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/app/ui/button';
import { updateTask } from '@/app/lib/actions';
import { Task } from '@/app/lib/types';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface EditTaskModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (task: Task) => void;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <Button
      type="submit"
      variant="primary"
      disabled={pending}
    >
      {pending ? 'Saving...' : 'Save Changes'}
    </Button>
  );
}

export default function EditTaskModal({ task, isOpen, onClose, onUpdate }: EditTaskModalProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description || '',
    priority: (task.priority || 'medium') as 'low' | 'medium' | 'high',
    assignedTo: task.assignedTo || '',
    dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
  });

  const handleSubmit = async (formDataObj: FormData) => {
    formDataObj.append('id', task.id);
    const result = await updateTask(formDataObj);
    if (result.success) {
      // Update the task in the UI
      onUpdate({
        ...task,
        title: formData.title,
        description: formData.description || undefined,
        priority: formData.priority as Task['priority'],
        assignedTo: formData.assignedTo || undefined,
        dueDate: formData.dueDate || undefined,
      });
      router.refresh(); // Refresh the page data without full reload
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-zinc-900">Edit Task</h2>
          <button
            onClick={onClose}
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
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-md focus:outline-none focus:border-zinc-400 transition-colors"
              rows={3}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="priority" className="block text-xs font-medium text-zinc-700 mb-1.5">
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
              className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-md focus:outline-none focus:border-zinc-400 transition-colors"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="assignedTo" className="block text-xs font-medium text-zinc-700 mb-1.5">
              Assigned To
            </label>
            <input
              type="text"
              id="assignedTo"
              name="assignedTo"
              value={formData.assignedTo}
              onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-md focus:outline-none focus:border-zinc-400 transition-colors"
              placeholder="Enter name"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="dueDate" className="block text-xs font-medium text-zinc-700 mb-1.5">
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-md focus:outline-none focus:border-zinc-400 transition-colors"
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              onClick={onClose}
              variant="secondary"
            >
              Cancel
            </Button>
            <SubmitButton />
          </div>
        </form>
      </div>
    </div>
  );
}