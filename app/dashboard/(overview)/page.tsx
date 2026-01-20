import { Suspense } from 'react';
import Link from 'next/link';
import BoardCard from '@/app/ui/boards/board-card';
import ExpandableSearch from '@/app/ui/expandable-search';
import CreateBoardButton from '@/app/ui/boards/create-board-button';
import Pagination from '@/app/ui/pagination';
import { fetchFilteredBoards, fetchDashboardStats } from '@/app/lib/data';
import { Board } from '@/app/lib/types';

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
    limit?: string;
  }>;
}) {
  const search = await searchParams;
  const query = search?.query || '';
  const currentPage = Number(search?.page) || 1;
  const itemsPerPage = Number(search?.limit) || 10;
  
  const [{ boards, totalPages, totalCount, orphanedTasksCount }, stats] = await Promise.all([
    fetchFilteredBoards(query, currentPage, itemsPerPage),
    fetchDashboardStats()
  ]);

  return (
    <main className="flex flex-col h-full">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900 font-heading">Boards</h1>
        <div className="flex items-center gap-2">
          <ExpandableSearch placeholder="Search boards..." />
          <CreateBoardButton />
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="rounded-md bg-white p-3 border border-zinc-200">
          <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Boards</p>
          <p className="text-xl font-semibold text-zinc-900 font-heading">{stats.totalBoards}</p>
        </div>
        <div className="rounded-md bg-white p-3 border border-zinc-200">
          <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Tasks</p>
          <p className="text-xl font-semibold text-zinc-900 font-heading">{stats.totalTasks}</p>
        </div>
        <div className="rounded-md bg-white p-3 border border-zinc-200">
          <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">In Progress</p>
          <p className="text-xl font-semibold text-zinc-900 font-heading">{stats.inProgressTasks}</p>
        </div>
        <div className="rounded-md bg-white p-3 border border-zinc-200">
          <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Complete</p>
          <p className="text-xl font-semibold text-zinc-900 font-heading">{stats.completionRate}%</p>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-xs text-zinc-500 font-medium">
          Showing {boards.length} of {totalCount} boards
        </p>
      </div>

      <Suspense key={query + currentPage} fallback={<BoardsSkeleton />}>
        <div className="flex flex-col flex-1">
          {boards.length > 0 || orphanedTasksCount > 0 ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 flex-1 auto-rows-min content-start">
                {orphanedTasksCount > 0 && !query && (
                  <Link href="/dashboard/board/orphaned-tasks">
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 min-h-35 hover:bg-amber-100 transition-colors cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-amber-500 rounded-full mt-1.5"></div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h2 className="font-medium text-base text-zinc-900">Tasks without Board</h2>
                            <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                          </div>
                          <p className="text-xs text-zinc-600 line-clamp-2 mt-1">
                            {orphanedTasksCount} task{orphanedTasksCount !== 1 ? 's' : ''} without an assigned board
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mt-4">
                        <span className="text-[10px] text-amber-700 font-medium">
                          {orphanedTasksCount} task{orphanedTasksCount !== 1 ? 's' : ''}
                        </span>
                        <div className="w-1 h-1 bg-amber-400 rounded-full"></div>
                        <span className="text-[10px] text-amber-700">
                          Click to view
                        </span>
                      </div>
                    </div>
                  </Link>
                )}
                {boards.map((board: Board) => (
                  <BoardCard key={board.id} board={board} />
                ))}
              </div>
              <div className="mt-auto pt-6">
                <Pagination totalPages={totalPages} />
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <svg
                className="mx-auto h-10 w-10 text-zinc-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                />
              </svg>
              <h3 className="mt-3 text-sm font-medium text-zinc-900">
                {query ? 'No boards found' : 'No boards'}
              </h3>
              <p className="mt-1 text-xs text-zinc-500">
                {query 
                  ? 'Try adjusting your search terms.' 
                  : 'Get started by creating a new board.'}
              </p>
            </div>
          )}
        </div>
      </Suspense>
    </main>
  );
}

function BoardsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="rounded-lg border border-zinc-200 bg-white p-5 min-h-35">
          <div className="animate-pulse">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-2 h-2 bg-zinc-200 rounded-full mt-1.5"></div>
              <div className="flex-1">
                <div className="h-5 bg-zinc-200 rounded w-32 mb-2"></div>
                <div className="h-3 bg-zinc-200 rounded w-full mb-1"></div>
                <div className="h-3 bg-zinc-200 rounded w-3/4"></div>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-auto">
              <div className="h-3 bg-zinc-200 rounded w-16"></div>
              <div className="w-1 h-1 bg-zinc-300 rounded-full"></div>
              <div className="h-3 bg-zinc-200 rounded w-20"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}