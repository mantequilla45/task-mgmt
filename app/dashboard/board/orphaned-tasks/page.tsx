import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { prisma } from '@/app/lib/prisma';
import TaskList from '@/app/ui/tasks/task-list';

export default async function OrphanedTasksPage() {
  let tasks: any[] = [];
  try {
    tasks = await prisma.task.findMany({
      where: { boardId: null },
      orderBy: [
        { status: 'asc' },
        { createdAt: 'desc' },
      ],
    });
  } catch (error) {
    // If query fails due to null handling, try alternative approach
    const allTasks = await prisma.task.findMany({
      orderBy: [
        { status: 'asc' },
        { createdAt: 'desc' },
      ],
    });
    tasks = allTasks.filter(task => !task.boardId);
  }

  const mappedTasks = tasks.map(task => ({
    id: task.id,
    title: task.title,
    description: task.description || undefined,
    status: task.status.toLowerCase() as 'todo' | 'in_progress' | 'done',
    priority: task.priority?.toLowerCase() as 'low' | 'medium' | 'high' | undefined,
    dueDate: task.dueDate?.toISOString(),
    assignedTo: task.assignedTo || undefined,
    boardId: null,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  }));

  return (
    <main>
      <div className="mb-6">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="mb-4 -ml-2 flex items-center gap-1.5 cursor-pointer">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Boards
          </Button>
        </Link>
        
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <h1 className="text-2xl font-semibold text-zinc-900 font-heading">Tasks without Board</h1>
              <AlertCircle className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-sm text-zinc-600 mt-2">
              These tasks don't belong to any board. Assign them to a board or delete them.
            </p>
          </div>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-zinc-200">
          <AlertCircle className="mx-auto h-10 w-10 text-amber-400 mb-4" />
          <h3 className="text-sm font-medium text-zinc-900">No orphaned tasks</h3>
          <p className="mt-1 text-xs text-zinc-500">
            All tasks are properly assigned to boards.
          </p>
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="mt-4 cursor-pointer">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex flex-col">
            <div className="border-t-2 border-zinc-300 bg-white rounded-t-md px-3 py-2.5 border-x border-b border-zinc-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-zinc-400"></div>
                  <h2 className="font-medium text-sm text-zinc-900">To Do</h2>
                </div>
                <span className="text-xs text-zinc-500 font-medium">
                  {mappedTasks.filter(t => t.status === 'todo').length}
                </span>
              </div>
            </div>
            <div className="bg-zinc-50/50 rounded-b-md border-x border-b border-zinc-200 p-3 min-h-125">
              <TaskList 
                tasks={mappedTasks.filter(t => t.status === 'todo')} 
                boardId={null}
              />
            </div>
          </div>

          <div className="flex flex-col">
            <div className="border-t-2 border-blue-400 bg-white rounded-t-md px-3 py-2.5 border-x border-b border-zinc-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  <h2 className="font-medium text-sm text-zinc-900">In Progress</h2>
                </div>
                <span className="text-xs text-zinc-500 font-medium">
                  {mappedTasks.filter(t => t.status === 'in_progress').length}
                </span>
              </div>
            </div>
            <div className="bg-zinc-50/50 rounded-b-md border-x border-b border-zinc-200 p-3 min-h-125">
              <TaskList 
                tasks={mappedTasks.filter(t => t.status === 'in_progress')} 
                boardId={null}
              />
            </div>
          </div>

          <div className="flex flex-col">
            <div className="border-t-2 border-emerald-400 bg-white rounded-t-md px-3 py-2.5 border-x border-b border-zinc-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                  <h2 className="font-medium text-sm text-zinc-900">Done</h2>
                </div>
                <span className="text-xs text-zinc-500 font-medium">
                  {mappedTasks.filter(t => t.status === 'done').length}
                </span>
              </div>
            </div>
            <div className="bg-zinc-50/50 rounded-b-md border-x border-b border-zinc-200 p-3 min-h-125">
              <TaskList 
                tasks={mappedTasks.filter(t => t.status === 'done')} 
                boardId={null}
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}