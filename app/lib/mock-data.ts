import { Board, Task } from './types';

export const mockBoards: Board[] = [
  {
    id: 'b1',
    name: 'Marketing Campaign',
    description: 'Q1 2024 marketing initiatives and campaigns',
    color: '#3B82F6',
    createdAt: '2024-01-01T09:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z',
    taskCount: 5
  },
  {
    id: 'b2',
    name: 'Product Development',
    description: 'New feature development and bug fixes',
    color: '#10B981',
    createdAt: '2024-01-02T10:00:00Z',
    updatedAt: '2024-01-20T16:45:00Z',
    taskCount: 5
  },
  {
    id: 'b3',
    name: 'Customer Support',
    description: 'Customer tickets and support tasks',
    color: '#F59E0B',
    createdAt: '2024-01-03T08:30:00Z',
    updatedAt: '2024-01-18T11:20:00Z',
    taskCount: 4
  },
  {
    id: 'b4',
    name: 'Sales Pipeline',
    description: 'Lead tracking and sales activities',
    color: '#8B5CF6',
    createdAt: '2024-01-04T11:00:00Z',
    updatedAt: '2024-01-19T09:15:00Z',
    taskCount: 4
  },
  {
    id: 'b5',
    name: 'HR & Recruiting',
    description: 'Hiring and team management tasks',
    color: '#EF4444',
    createdAt: '2024-01-05T09:30:00Z',
    updatedAt: '2024-01-17T13:00:00Z',
    taskCount: 4
  },
  {
    id: 'b6',
    name: 'Personal Tasks',
    description: 'Personal to-dos and reminders',
    color: '#06B6D4',
    createdAt: '2024-01-06T14:00:00Z',
    updatedAt: '2024-01-16T10:30:00Z',
    taskCount: 4
  },
  {
    id: 'b7',
    name: 'Website Redesign',
    description: 'Complete website overhaul project',
    color: '#EC4899',
    createdAt: '2024-01-07T10:30:00Z',
    updatedAt: '2024-01-19T15:00:00Z',
    taskCount: 5
  },
  {
    id: 'b8',
    name: 'Data Analytics',
    description: 'Reports and data analysis tasks',
    color: '#14B8A6',
    createdAt: '2024-01-08T08:00:00Z',
    updatedAt: '2024-01-18T12:45:00Z',
    taskCount: 4
  }
];

export const mockTasks: Task[] = [
  // Marketing Campaign (b1)
  {
    id: 't1',
    boardId: 'b1',
    title: 'Create social media content calendar',
    description: 'Plan posts for Facebook Instagram and Twitter',
    status: 'done',
    priority: 'high',
    assignedTo: 'Sarah Johnson',
    dueDate: '2024-01-25',
    createdAt: '2024-01-01T09:30:00Z',
    updatedAt: '2024-01-10T14:00:00Z'
  },
  {
    id: 't2',
    boardId: 'b1',
    title: 'Design email newsletter template',
    description: 'Create responsive template for monthly newsletter',
    status: 'in_progress',
    priority: 'medium',
    assignedTo: 'Mike Chen',
    dueDate: '2024-01-28',
    createdAt: '2024-01-02T10:00:00Z',
    updatedAt: '2024-01-15T11:30:00Z'
  },
  {
    id: 't3',
    boardId: 'b1',
    title: 'Update marketing website copy',
    description: 'Revise homepage and product pages',
    status: 'todo',
    priority: 'high',
    assignedTo: 'Emily Davis',
    dueDate: '2024-01-30',
    createdAt: '2024-01-03T11:00:00Z',
    updatedAt: '2024-01-03T11:00:00Z'
  },
  {
    id: 't4',
    boardId: 'b1',
    title: 'Analyze Q4 campaign performance',
    status: 'done',
    priority: 'medium',
    createdAt: '2024-01-04T08:30:00Z',
    updatedAt: '2024-01-12T16:00:00Z'
  },
  {
    id: 't5',
    boardId: 'b1',
    title: 'Set up Google Ads campaign',
    status: 'todo',
    priority: 'high',
    dueDate: '2024-02-01',
    createdAt: '2024-01-05T13:00:00Z',
    updatedAt: '2024-01-05T13:00:00Z'
  },
  
  // Product Development (b2)
  {
    id: 't6',
    boardId: 'b2',
    title: 'Fix login authentication bug',
    description: 'Users unable to login with special characters in password',
    status: 'done',
    priority: 'high',
    assignedTo: 'Alex Turner',
    createdAt: '2024-01-01T08:00:00Z',
    updatedAt: '2024-01-08T17:00:00Z'
  },
  {
    id: 't7',
    boardId: 'b2',
    title: 'Implement dark mode feature',
    description: 'Add dark theme toggle to settings',
    status: 'in_progress',
    priority: 'medium',
    assignedTo: 'Lisa Wang',
    dueDate: '2024-01-31',
    createdAt: '2024-01-02T09:00:00Z',
    updatedAt: '2024-01-16T10:00:00Z'
  },
  {
    id: 't8',
    boardId: 'b2',
    title: 'Optimize database queries',
    status: 'in_progress',
    priority: 'high',
    assignedTo: 'David Kim',
    createdAt: '2024-01-03T10:30:00Z',
    updatedAt: '2024-01-17T14:30:00Z'
  },
  {
    id: 't9',
    boardId: 'b2',
    title: 'Add export to CSV functionality',
    status: 'todo',
    priority: 'low',
    createdAt: '2024-01-04T11:00:00Z',
    updatedAt: '2024-01-04T11:00:00Z'
  },
  {
    id: 't10',
    boardId: 'b2',
    title: 'Update API documentation',
    status: 'todo',
    priority: 'medium',
    dueDate: '2024-01-29',
    createdAt: '2024-01-05T14:00:00Z',
    updatedAt: '2024-01-05T14:00:00Z'
  }
];

export async function getBoards(): Promise<Board[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockBoards;
}

export async function getBoardById(id: string): Promise<Board | null> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockBoards.find(board => board.id === id) || null;
}

export async function getTasksByBoardId(boardId: string): Promise<Task[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockTasks.filter(task => task.boardId === boardId);
}