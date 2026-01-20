'use client';

import { Task } from '@/app/lib/types';
import { Button } from '@/app/ui/button';
import { deleteTask } from '@/app/lib/actions';
import { useState } from 'react';
import { GripVertical, Trash2 } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  boardId: string;
}

export default function TaskCard({ task, boardId }: TaskCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  
  const priorityColors = {
    low: 'bg-zinc-100 text-zinc-600',
    medium: 'bg-amber-50 text-amber-700',
    high: 'bg-red-50 text-red-700',
  };

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('taskId', task.id);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this task?')) {
      await deleteTask(task.id);
    }
  };

  return (
    <div 
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`bg-white rounded-md p-3 border border-zinc-200 hover:border-zinc-300 transition-all cursor-move ${
        isDragging ? 'opacity-50 rotate-2 scale-105' : 'hover:shadow-sm'
      }`}>
      <div className="space-y-2.5">
        <div className="flex items-start gap-2">
          <GripVertical className="w-4 h-4 text-zinc-300 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-medium text-zinc-900 text-sm leading-tight">{task.title}</h3>
          </div>
          <button
            onClick={handleDelete}
            className="text-zinc-400 hover:text-red-600 transition-colors p-0.5"
            title="Delete task"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
        
        {task.description && (
          <p className="text-xs text-zinc-500 line-clamp-2 ml-6">{task.description}</p>
        )}
        
        <div className="flex items-center gap-2 ml-6">
          {task.priority && (
            <span className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider ${priorityColors[task.priority]}`}>
              {task.priority}
            </span>
          )}
          
          {task.dueDate && (
            <span className="text-[11px] text-zinc-400">
              {new Date(task.dueDate).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })}
            </span>
          )}
        </div>

        {task.assignedTo && (
          <div className="flex items-center gap-1.5 ml-6">
            <div className="w-5 h-5 rounded-full bg-zinc-200 flex items-center justify-center">
              <span className="text-[10px] font-medium text-zinc-600">
                {task.assignedTo.charAt(0).toUpperCase()}
              </span>
            </div>
            <p className="text-[11px] text-zinc-500">{task.assignedTo}</p>
          </div>
        )}
      </div>
    </div>
  );
}