export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type Priority = 'low' | 'medium' | 'high';

export interface Board {
  id: string;
  name: string;
  description?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
  taskCount?: number;
}

export interface Task {
  id: string;
  boardId: string | null;
  title: string;
  description?: string;
  status: TaskStatus;
  priority?: Priority;
  assignedTo?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BoardWithTasks extends Board {
  tasks: Task[];
}

export interface DashboardStats {
  totalBoards: number;
  totalTasks: number;
  inProgressTasks: number;
  completionRate: number;
}