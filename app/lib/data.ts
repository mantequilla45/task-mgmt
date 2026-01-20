// data.ts - Read-only data fetching functions for server components
import { prisma } from './prisma';
import { Board, Task, DashboardStats } from './types';

// Type definitions for Prisma results
type BoardWithTasks = {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
  createdAt: Date;
  updatedAt: Date;
  tasks: Array<{
    id: string;
    title: string;
    description: string | null;
    status: string;
    priority: string | null;
    dueDate: Date | null;
    assignedTo: string | null;
    boardId: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
};

type PrismaTask = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string | null;
  dueDate: Date | null;
  assignedTo: string | null;
  boardId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

// Map Prisma types to our app types
function mapPrismaBoard(board: BoardWithTasks): Board {
  return {
    id: board.id,
    name: board.name,
    description: board.description || undefined,
    color: board.color || undefined,
    taskCount: board.tasks.length,
    createdAt: board.createdAt.toISOString(),
    updatedAt: board.updatedAt.toISOString(),
  };
}

function mapPrismaTask(task: PrismaTask): Task {
  return {
    id: task.id,
    title: task.title,
    description: task.description || undefined,
    status: task.status.toLowerCase() as 'todo' | 'in_progress' | 'done',
    priority: task.priority?.toLowerCase() as 'low' | 'medium' | 'high' | undefined,
    dueDate: task.dueDate?.toISOString(),
    assignedTo: task.assignedTo || undefined,
    boardId: task.boardId,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  };
}

export async function fetchFilteredBoards(
  query: string,
  currentPage: number,
  itemsPerPage: number = 10
): Promise<{ boards: Board[], totalPages: number, totalCount: number, orphanedTasksCount: number }> {
  try {
    const skip = (currentPage - 1) * itemsPerPage;
    
    // Build where clause for search
    const where = query
      ? {
          OR: [
            { name: { contains: query, mode: 'insensitive' as const } },
            { description: { contains: query, mode: 'insensitive' as const } },
          ],
        }
      : {};

    // Get total count for pagination  
    const totalCount = await prisma.board.count({ where });
    
    // Get orphaned tasks count separately
    let orphanedTasksCount = 0;
    try {
      const orphanedTasks = await prisma.task.findMany({
        where: { boardId: null },
        select: { id: true }
      });
      orphanedTasksCount = orphanedTasks.length;
    } catch (e) {
      // If query fails, default to 0
      orphanedTasksCount = 0;
    }
    
    // Fetch boards with task count
    const boards = await prisma.board.findMany({
      where,
      include: {
        tasks: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      skip,
      take: itemsPerPage,
    });

    const totalPages = Math.ceil(totalCount / itemsPerPage);

    return {
      boards: boards.map(mapPrismaBoard),
      totalPages,
      totalCount,
      orphanedTasksCount,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch boards.');
  }
}

export async function fetchBoardById(id: string): Promise<Board | null> {
  try {
    const board = await prisma.board.findUnique({
      where: { id },
      include: {
        tasks: true,
      },
    });

    if (!board) return null;
    
    return mapPrismaBoard(board);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch board.');
  }
}

export async function fetchFilteredTasks(
  boardId: string,
  query: string
): Promise<Task[]> {
  try {
    // Build where clause
    const where = {
      boardId,
      ...(query && {
        OR: [
          { title: { contains: query, mode: 'insensitive' as const } },
          { description: { contains: query, mode: 'insensitive' as const } },
          { assignedTo: { contains: query, mode: 'insensitive' as const } },
        ],
      }),
    };

    const tasks = await prisma.task.findMany({
      where,
      orderBy: [
        { status: 'asc' },
        { priority: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return tasks.map(mapPrismaTask);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch tasks.');
  }
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  try {
    const [
      totalBoards,
      totalTasks,
      taskStats,
    ] = await Promise.all([
      prisma.board.count(),
      prisma.task.count(),
      prisma.task.groupBy({
        by: ['status'],
        _count: true,
      }),
    ]);

    const inProgressTasks = taskStats.find((s: any) => s.status === 'IN_PROGRESS')?._count || 0;
    const doneTasks = taskStats.find((s: any) => s.status === 'DONE')?._count || 0;
    const completionRate = totalTasks > 0 
      ? Math.round((doneTasks / totalTasks) * 100) 
      : 0;

    return {
      totalBoards,
      totalTasks,
      inProgressTasks,
      completionRate,
    };
  } catch (error) {
    console.error('Database Error:', error);
    // Return default stats on error
    return {
      totalBoards: 0,
      totalTasks: 0,
      inProgressTasks: 0,
      completionRate: 0,
    };
  }
}

export async function fetchAllTasksGroupedByBoard() {
  try {
    // Fetch all tasks with their board information
    const tasks = await prisma.task.findMany({
      include: {
        board: true,
      },
      orderBy: [
        { boardId: 'asc' },
        { status: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    // Group tasks by board
    const groupedByBoard = new Map<string | null, { board: any | null; tasks: Task[] }>();

    // First add all boards (even empty ones)
    const boards = await prisma.board.findMany({
      orderBy: { name: 'asc' },
    });

    boards.forEach(board => {
      groupedByBoard.set(board.id, { board, tasks: [] });
    });

    // Add a group for tasks without boards
    groupedByBoard.set(null, { board: null, tasks: [] });

    // Add tasks to their respective groups
    tasks.forEach((task) => {
      const boardId = task.boardId;
      const group = groupedByBoard.get(boardId);
      
      if (group) {
        group.tasks.push(mapPrismaTask(task));
      }
    });

    // Convert to array and filter out empty board groups (keeping "no board" group)
    const result = Array.from(groupedByBoard.values())
      .filter(group => group.board === null || group.tasks.length > 0)
      .sort((a, b) => {
        // Put "no board" tasks at the top
        if (!a.board) return -1;
        if (!b.board) return 1;
        return a.board.name.localeCompare(b.board.name);
      });

    return result;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch tasks grouped by board.');
  }
}