import { notFound } from 'next/navigation';
import Link from 'next/link';
import { fetchBoardById, fetchFilteredTasks, fetchFilteredBoards } from '@/app/lib/data';
import BoardContent from '@/app/ui/tasks/board-content';
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
    <main className="h-screen flex flex-col">
      <div className="flex-shrink-0 pb-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="mb-4 -ml-2 flex items-center gap-1.5 cursor-pointer">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Boards
          </Button>
        </Link>
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <BoardContent 
          board={board}
          initialTasks={tasks}
          allBoards={allBoards}
        />
      </div>
    </main>
  );
}