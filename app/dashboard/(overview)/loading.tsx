import ExpandableSearch from '@/app/ui/expandable-search';
import { Plus } from 'lucide-react';

export default function Loading() {
  return (
    <main className="flex flex-col h-full">
      {/* Static Boards heading with search and add button */}
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900 font-heading">Boards</h1>
        <div className="flex items-center gap-2">
          <ExpandableSearch placeholder="Search boards..." />
          <button 
            className="h-9 px-3 rounded-md bg-zinc-900 text-white flex items-center gap-1.5 hover:bg-zinc-800 transition-colors text-xs font-medium opacity-50 cursor-not-allowed"
            disabled
          >
            <Plus className="h-3 w-3" />
            Add Board
          </button>
        </div>
      </div>

      {/* Dashboard Stats Skeleton */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-md bg-white p-3 border border-zinc-200">
            <div className="animate-pulse">
              <div className="h-3 bg-zinc-200 rounded w-16 mb-1"></div>
              <div className="h-6 bg-zinc-200 rounded w-8"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Count Skeleton */}
      <div className="mb-6">
        <div className="h-3 w-32 bg-zinc-200 rounded animate-pulse"></div>
      </div>
      
      {/* Board Cards Skeleton */}
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
    </main>
  );
}