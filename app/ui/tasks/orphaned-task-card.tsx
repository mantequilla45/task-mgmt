'use client';

import { Task } from '@/app/lib/types';
import { Button } from '@/app/ui/button';
import { deleteTask, assignTaskToBoard } from '@/app/lib/actions';
import { useState } from 'react';
import { GripVertical, Trash2, FolderPlus, X } from 'lucide-react';
import { Board } from '@/app/lib/types';

interface OrphanedTaskCardProps {
  task: Task;
  boards: Board[];
}

export default function OrphanedTaskCard({ task, boards }: OrphanedTaskCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedBoardId, setSelectedBoardId] = useState<string>('');
  const [isAssigning, setIsAssigning] = useState(false);
  
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

  const handleAssign = async () => {
    if (!selectedBoardId) return;
    
    setIsAssigning(true);
    const result = await assignTaskToBoard(task.id, selectedBoardId);
    
    if (result.success) {
      setShowAssignModal(false);
    } else {
      alert('Failed to assign task to board');
    }
    setIsAssigning(false);
  };

  return (
    <>
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
              <h3 className="text-xs font-medium text-zinc-900 line-clamp-2">{task.title}</h3>
              {task.description && (
                <p className="text-[10px] text-zinc-500 line-clamp-2 mt-1">{task.description}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 mt-2">
            {task.priority && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded ${priorityColors[task.priority]}`}>
                {task.priority}
              </span>
            )}
            {task.dueDate && (
              <span className="text-[10px] text-zinc-500">
                Due {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 mt-2">
            <button
              onClick={() => setShowAssignModal(true)}
              className="flex-1 px-2 py-1 text-[10px] bg-amber-50 text-amber-700 rounded hover:bg-amber-100 transition-colors flex items-center justify-center gap-1"
            >
              <FolderPlus className="w-3 h-3" />
              Assign to Board
            </button>
            <button
              onClick={handleDelete}
              className="p-1 text-zinc-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {showAssignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-zinc-900">Assign Task to Board</h2>
              <button
                onClick={() => setShowAssignModal(false)}
                className="text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                Select a board
              </label>
              <select
                value={selectedBoardId}
                onChange={(e) => setSelectedBoardId(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-md focus:outline-none focus:border-zinc-400 transition-colors"
              >
                <option value="">Choose a board...</option>
                {boards.map((board) => (
                  <option key={board.id} value={board.id}>
                    {board.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-4 p-3 bg-zinc-50 rounded-md">
              <h3 className="text-xs font-medium text-zinc-700 mb-1">Task Details</h3>
              <p className="text-xs text-zinc-600">{task.title}</p>
              {task.description && (
                <p className="text-[10px] text-zinc-500 mt-1">{task.description}</p>
              )}
            </div>

            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                onClick={() => setShowAssignModal(false)}
                variant="secondary"
                disabled={isAssigning}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAssign}
                variant="primary"
                disabled={!selectedBoardId || isAssigning}
              >
                {isAssigning ? 'Assigning...' : 'Assign to Board'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}