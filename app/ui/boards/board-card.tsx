import Link from 'next/link';
import { Board } from '@/app/lib/types';

export default function BoardCard({ board }: { board: Board }) {
  return (
    <Link href={`/dashboard/board/${board.id}`}>
      <div className="group rounded-lg border border-zinc-200 bg-white p-5 transition-all hover:border-zinc-300 hover:shadow-sm cursor-pointer min-h-[140px] flex flex-col">
        <div className="flex items-start justify-between flex-1">
          <div className="flex-1 flex flex-col h-full">
            <div className="flex items-start gap-3 mb-3">
              <div 
                className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
                style={{ backgroundColor: board.color || '#a1a1aa' }}
              />
              <div className="flex-1">
                <h3 className="text-base font-medium text-zinc-900 line-clamp-1 mb-1">
                  {board.name}
                </h3>
                {board.description && (
                  <p className="text-xs text-zinc-500 line-clamp-2">
                    {board.description}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs text-zinc-400 mt-auto">
              <span className="flex items-center gap-1">
                <span className="font-medium text-zinc-600">{board.taskCount || 0}</span> tasks
              </span>
              <span className="text-zinc-300">•</span>
              <span>
                {new Date(board.updatedAt).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}