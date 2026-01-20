'use server';

// actions.ts - Write operations & mutations using Prisma
// Contains INSERT, UPDATE, DELETE queries
// Handles form submissions and state changes
// Uses revalidatePath() to refresh cached data
// Uses redirect() for navigation after mutations

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { prisma } from './prisma';

// Validation schemas
const CreateBoardSchema = z.object({
  name: z.string().min(1, 'Board name is required').max(100),
  description: z.string().optional(),
  color: z.string().optional(),
});

const UpdateBoardSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  color: z.string().optional(),
});

const CreateTaskSchema = z.object({
  boardId: z.string(),
  title: z.string().min(1, 'Task title is required').max(200),
  description: z.string().optional(),
  status: z.enum(['todo', 'in_progress', 'done']),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  assignedTo: z.string().optional(),
  dueDate: z.string().optional(),
});

const UpdateTaskSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  status: z.enum(['todo', 'in_progress', 'done']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  assignedTo: z.string().optional(),
  dueDate: z.string().optional(),
});

// Helper function to convert status string to Prisma enum
function toPrismaStatus(status: string): 'TODO' | 'IN_PROGRESS' | 'DONE' {
  switch (status) {
    case 'todo': return 'TODO';
    case 'in_progress': return 'IN_PROGRESS';
    case 'done': return 'DONE';
    default: return 'TODO';
  }
}

// Helper function to convert priority string to Prisma enum
function toPrismaPriority(priority?: string): 'LOW' | 'MEDIUM' | 'HIGH' | undefined {
  if (!priority) return undefined;
  switch (priority) {
    case 'low': return 'LOW';
    case 'medium': return 'MEDIUM';
    case 'high': return 'HIGH';
    default: return 'MEDIUM';
  }
}

// BOARD ACTIONS

export async function createBoard(formData: FormData) {
  const validatedFields = CreateBoardSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description') || undefined,
    color: formData.get('color') || undefined,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to create board.',
      success: false,
    };
  }

  const { name, description, color } = validatedFields.data;

  try {
    const newBoard = await prisma.board.create({
      data: {
        name,
        description,
        color,
      },
    });

    revalidatePath('/dashboard');
    return { success: true, board: newBoard };
  } catch (error) {
    console.error('Database Error:', error);
    return {
      message: 'Database Error: Failed to create board.',
      success: false,
    };
  }
}

export async function updateBoard(formData: FormData) {
  const validatedFields = UpdateBoardSchema.safeParse({
    id: formData.get('id'),
    name: formData.get('name') || undefined,
    description: formData.get('description') || undefined,
    color: formData.get('color') || undefined,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to update board.',
      success: false,
    };
  }

  const { id, ...updates } = validatedFields.data;

  try {
    await prisma.board.update({
      where: { id },
      data: updates,
    });

    revalidatePath('/dashboard');
    revalidatePath(`/dashboard/board/${id}`);
    return { success: true };
  } catch (error) {
    console.error('Database Error:', error);
    return {
      message: 'Database Error: Failed to update board.',
      success: false,
    };
  }
}

export async function deleteBoard(formData: FormData) {
  const id = formData.get('id') as string;
  const taskHandling = formData.get('taskHandling') as 'orphan' | 'transfer' | 'delete';
  const targetBoardId = formData.get('targetBoardId') as string | null;

  try {
    // Handle tasks based on selected option
    if (taskHandling === 'transfer' && targetBoardId) {
      // Transfer all tasks to another board
      await prisma.task.updateMany({
        where: { boardId: id },
        data: { boardId: targetBoardId },
      });
    } else if (taskHandling === 'delete') {
      // Delete all tasks in this board
      await prisma.task.deleteMany({
        where: { boardId: id },
      });
    }
    // If taskHandling === 'orphan', tasks will automatically become orphaned
    // when the board is deleted due to SetNull on delete

    // Delete the board
    await prisma.board.delete({
      where: { id },
    });

    revalidatePath('/dashboard');
  } catch (error) {
    console.error('Database Error:', error);
    return {
      message: 'Database Error: Failed to delete board.',
      success: false,
    };
  }

  redirect('/dashboard');
}

// TASK ACTIONS

export async function createTask(formData: FormData) {
  const validatedFields = CreateTaskSchema.safeParse({
    boardId: formData.get('boardId'),
    title: formData.get('title'),
    description: formData.get('description') || undefined,
    status: formData.get('status') || 'todo',
    priority: formData.get('priority') || undefined,
    assignedTo: formData.get('assignedTo') || undefined,
    dueDate: formData.get('dueDate') || undefined,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to create task.',
      success: false,
    };
  }

  const { boardId, title, description, status, priority, assignedTo, dueDate } = validatedFields.data;

  try {
    const newTask = await prisma.task.create({
      data: {
        boardId,
        title,
        description,
        status: toPrismaStatus(status),
        priority: toPrismaPriority(priority),
        assignedTo,
        dueDate: dueDate ? new Date(dueDate) : undefined,
      },
    });

    revalidatePath(`/dashboard/board/${boardId}`);
    revalidatePath('/dashboard');
    return { success: true, task: newTask };
  } catch (error) {
    console.error('Database Error:', error);
    return {
      message: 'Database Error: Failed to create task.',
      success: false,
    };
  }
}

export async function updateTask(formData: FormData) {
  const validatedFields = UpdateTaskSchema.safeParse({
    id: formData.get('id'),
    title: formData.get('title') || undefined,
    description: formData.get('description') || undefined,
    status: formData.get('status') || undefined,
    priority: formData.get('priority') || undefined,
    assignedTo: formData.get('assignedTo') || undefined,
    dueDate: formData.get('dueDate') || undefined,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to update task.',
      success: false,
    };
  }

  const { id, status, priority, dueDate, ...otherUpdates } = validatedFields.data;

  try {
    // Get the task to find its boardId for revalidation
    const task = await prisma.task.findUnique({
      where: { id },
      select: { boardId: true },
    });

    if (!task) {
      return { message: 'Task not found.', success: false };
    }

    // Prepare update data
    const updateData: any = { ...otherUpdates };
    if (status) updateData.status = toPrismaStatus(status);
    if (priority) updateData.priority = toPrismaPriority(priority);
    if (dueDate) updateData.dueDate = new Date(dueDate);

    await prisma.task.update({
      where: { id },
      data: updateData,
    });

    revalidatePath(`/dashboard/board/${task.boardId}`);
    return { success: true };
  } catch (error) {
    console.error('Database Error:', error);
    return {
      message: 'Database Error: Failed to update task.',
      success: false,
    };
  }
}

export async function updateTaskStatus(taskId: string, status: 'todo' | 'in_progress' | 'done') {
  try {
    // Get the task to find its boardId for revalidation
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      select: { boardId: true },
    });

    if (!task) {
      return { message: 'Task not found.', success: false };
    }

    await prisma.task.update({
      where: { id: taskId },
      data: {
        status: toPrismaStatus(status),
      },
    });

    revalidatePath(`/dashboard/board/${task.boardId}`);
    return { success: true };
  } catch (error) {
    console.error('Database Error:', error);
    return {
      message: 'Database Error: Failed to update task status.',
      success: false,
    };
  }
}

export async function assignTaskToBoard(taskId: string, boardId: string) {
  try {
    await prisma.task.update({
      where: { id: taskId },
      data: { boardId },
    });

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/board/orphaned-tasks');
    revalidatePath(`/dashboard/board/${boardId}`);
    
    return { success: true };
  } catch (error) {
    console.error('Database Error:', error);
    return {
      message: 'Database Error: Failed to assign task to board.',
      success: false,
    };
  }
}

export async function deleteTask(id: string) {
  try {
    // Get the task to find its boardId for revalidation
    const task = await prisma.task.findUnique({
      where: { id },
      select: { boardId: true },
    });

    if (!task) {
      return { message: 'Task not found.', success: false };
    }

    await prisma.task.delete({
      where: { id },
    });

    revalidatePath(`/dashboard/board/${task.boardId}`);
    return { success: true };
  } catch (error) {
    console.error('Database Error:', error);
    return {
      message: 'Database Error: Failed to delete task.',
      success: false,
    };
  }
}