import { notFound } from 'next/navigation';
import Link from 'next/link';
import { fetchBoardById, fetchFilteredTasks, fetchFilteredBoards } from '@/app/lib/data';
import TaskBoard from '@/app/ui/tasks/task-board';
import ExpandableSearch from '@/app/ui/expandable-search';
import CreateTaskButton from '@/app/ui/tasks/create-task-button';
import BoardSettingsDropdown from '@/app/ui/boards/board-settings-dropdown';
import { Button } from '@/app/ui/button';
import { ArrowLeft } from 'lucide-react';

export default async function BoardDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{
    query?: string;
  }>;
}) {
  const { id } = await params;
  const search = await searchParams;
  const query = search?.query || '';
  
  const [board, tasks, { boards: allBoards }] = await Promise.all([
    fetchBoardById(id),
    fetchFilteredTasks(id, query),
    fetchFilteredBoards('', 1, 100) // Get all boards for the transfer option
  ]);

  if (!board) {
    notFound();
  }

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

          {/* Search Bar and Actions */}
          <div className="flex items-center gap-2">
            <ExpandableSearch placeholder="Search tasks..." />
            <CreateTaskButton boardId={id} />
            <BoardSettingsDropdown 
              boardId={id} 
              boardName={board.name} 
              board={board} 
              taskCount={tasks.length}
              allBoards={allBoards}
            />
          </div>
        </div>
      </div>

      <TaskBoard initialTasks={tasks} boardId={id} />
    </main>
  );
}