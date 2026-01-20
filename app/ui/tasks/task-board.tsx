'use client';

import { useState, useCallback, useEffect } from 'react';
import { Task, TaskStatus } from '@/app/lib/types';
import TaskList from './task-list-optimistic';
import { updateTaskStatus } from '@/app/lib/actions';

interface TaskBoardProps {
  initialTasks: Task[];
  boardId: string;
  onTasksChange?: (tasks: Task[]) => void;
}

export default function TaskBoard({ initialTasks, boardId, onTasksChange }: TaskBoardProps) {
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  
  // Use tasks directly from props - parent manages the state
  const tasks = initialTasks;
  
  const setTasks = useCallback((newTasks: Task[] | ((prev: Task[]) => Task[])) => {
    if (onTasksChange) {
      if (typeof newTasks === 'function') {
        onTasksChange(newTasks(tasks));
      } else {
        onTasksChange(newTasks);
      }
    }
  }, [tasks, onTasksChange]);

  const tasksByStatus = {
    todo: tasks.filter(task => task.status === 'todo'),
    in_progress: tasks.filter(task => task.status === 'in_progress'),
    done: tasks.filter(task => task.status === 'done'),
  };

  const handleDragStart = useCallback((task: Task) => {
    setDraggedTask(task);
  }, []);

  const handleDrop = useCallback(async (newStatus: TaskStatus) => {
    if (!draggedTask) return;

    // Optimistically update the UI immediately
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === draggedTask.id 
          ? { ...task, status: newStatus }
          : task
      )
    );

    // Clear the dragged task
    setDraggedTask(null);

    // Then update the server in the background
    try {
      await updateTaskStatus(draggedTask.id, newStatus);
    } catch (error) {
      // If the server update fails, revert the change
      console.error('Failed to update task status:', error);
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === draggedTask.id 
            ? { ...task, status: draggedTask.status }
            : task
        )
      );
    }
  }, [draggedTask]);

  const handleDeleteTask = useCallback((taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  }, []);

  const handleUpdateTask = useCallback((updatedTask: Task) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      )
    );
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-3 h-full">
      <TaskList 
        title="To Do" 
        tasks={tasksByStatus.todo} 
        status="todo" 
        boardId={boardId}
        onDragStart={handleDragStart}
        onDrop={handleDrop}
        onDelete={handleDeleteTask}
        onUpdate={handleUpdateTask}
      />
      <TaskList 
        title="In Progress" 
        tasks={tasksByStatus.in_progress} 
        status="in_progress" 
        boardId={boardId}
        onDragStart={handleDragStart}
        onDrop={handleDrop}
        onDelete={handleDeleteTask}
        onUpdate={handleUpdateTask}
      />
      <TaskList 
        title="Done" 
        tasks={tasksByStatus.done} 
        status="done" 
        boardId={boardId}
        onDragStart={handleDragStart}
        onDrop={handleDrop}
        onDelete={handleDeleteTask}
        onUpdate={handleUpdateTask}
      />
    </div>
  );
}