'use client';

import { useState, useCallback } from 'react';
import { Task } from '@/app/lib/types';
import TaskBoard from './task-board';
import CreateTaskButton from './create-task-button';
import ExpandableSearch from '@/app/ui/expandable-search';
import BoardSettingsDropdown from '@/app/ui/boards/board-settings-dropdown';
import { Board } from '@/app/lib/types';

interface BoardContentProps {
  board: Board;
  initialTasks: Task[];
  allBoards: Board[];
}

export default function BoardContent({ board, initialTasks, allBoards }: BoardContentProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  
  // Add task optimistically to the UI
  const addTaskOptimistically = useCallback((tempTask: Partial<Task>) => {
    const newTask: Task = {
      id: `temp-${Date.now()}`, // Temporary ID until server responds
      boardId: board.id,
      title: tempTask.title || '',
      description: tempTask.description,
      status: (tempTask.status || 'todo') as Task['status'],
      priority: tempTask.priority as Task['priority'],
      assignedTo: tempTask.assignedTo,
      dueDate: tempTask.dueDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setTasks(prevTasks => [newTask, ...prevTasks]);
    
    // Return a function to update with the real task from server
    return (realTask: Task) => {
      setTasks(prevTasks => 
        prevTasks.map(t => t.id === newTask.id ? realTask : t)
      );
    };
  }, [board.id]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-start justify-between mb-6 flex-shrink-0">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: board.color || '#a1a1aa' }}
            />
            <h1 className="text-2xl font-semibold text-zinc-900 font-heading">{board.name}</h1>
          </div>
          {board.description && (
            <p className="text-sm text-zinc-500">{board.description}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <ExpandableSearch placeholder="Search tasks..." />
          <CreateTaskButton 
            boardId={board.id} 
            onTaskCreate={addTaskOptimistically}
          />
          <BoardSettingsDropdown 
            boardId={board.id} 
            boardName={board.name} 
            board={board} 
            taskCount={tasks.length}
            allBoards={allBoards}
          />
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <TaskBoard 
          initialTasks={tasks} 
          boardId={board.id} 
          onTasksChange={setTasks}
        />
      </div>
    </div>
  );
}