'use client';

import { Task, TaskStatus } from '@/app/lib/types';
import TaskCard from './task-card';
import { updateTaskStatus } from '@/app/lib/actions';
import { useState } from 'react';

interface TaskListProps {
  title: string;
  tasks: Task[];
  status: TaskStatus;
  boardId: string;
}

export default function TaskList({ title, tasks, status, boardId }: TaskListProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  
  const statusColors = {
    todo: 'border-zinc-300',
    in_progress: 'border-blue-400',
    done: 'border-emerald-400',
  };

  const statusDots = {
    todo: 'bg-zinc-400',
    in_progress: 'bg-blue-400',
    done: 'bg-emerald-400',
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      await updateTaskStatus(taskId, status);
    }
  };

  return (
    <div className="flex flex-col">
      <div className={`border-t-2 ${statusColors[status]} bg-white rounded-t-md px-3 py-2.5 border-x border-b border-zinc-200`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${statusDots[status]}`}></div>
            <h2 className="font-medium text-sm text-zinc-900">{title}</h2>
          </div>
          <span className="text-xs text-zinc-500 font-medium">{tasks.length}</span>
        </div>
      </div>
      
      <div 
        className={`bg-zinc-50/50 rounded-b-md border-x border-b border-zinc-200 p-3 min-h-125 flex flex-col transition-all ${
          isDragOver ? 'bg-zinc-100 ring-2 ring-zinc-400 ring-opacity-50' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="space-y-2 flex-1">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} boardId={boardId} />
          ))}
        </div>
        
        {tasks.length === 0 && (
          <div className="flex items-center justify-center h-full min-h-100">
            <div className="text-center">
              <svg
                className="mx-auto h-10 w-10 text-zinc-300 mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-xs text-zinc-400">No tasks</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}