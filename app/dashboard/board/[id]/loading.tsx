import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { ArrowLeft, Plus, Search, MoreVertical } from 'lucide-react';

export default function Loading() {
  return (
    <main>
      <div className="mb-6">
        {/* Keep static Back button */}
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="mb-4 -ml-2 flex items-center gap-1.5 cursor-pointer">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Boards
          </Button>
        </Link>
        
        {/* Board header skeleton - only the dynamic parts */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-3 h-3 rounded-full bg-zinc-200 animate-pulse"></div>
              <div className="h-7 w-48 bg-zinc-200 rounded animate-pulse"></div>
            </div>
            <div className="h-4 w-64 bg-zinc-200 rounded animate-pulse mt-2"></div>
          </div>

          {/* Keep static Search, Add Task, and Settings buttons (disabled during loading) */}
          <div className="flex items-center gap-2">
            <button 
              disabled
              className="h-9 w-9 rounded-md border border-zinc-200 bg-white flex items-center justify-center text-zinc-400 cursor-default"
            >
              <Search className="h-3.5 w-3.5" />
            </button>
            <button 
              disabled
              className="h-9 px-3 rounded-md bg-zinc-300 text-zinc-500 flex items-center gap-1.5 text-xs font-medium cursor-default"
            >
              <Plus className="h-3 w-3" />
              Add Task
            </button>
            <button 
              disabled
              className="h-9 w-9 rounded-md border border-zinc-200 bg-white flex items-center justify-center text-zinc-400 cursor-default"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Task columns with static headers */}
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { title: 'To Do', borderColor: 'border-zinc-300', dotColor: 'bg-zinc-400' },
          { title: 'In Progress', borderColor: 'border-blue-400', dotColor: 'bg-blue-400' },
          { title: 'Done', borderColor: 'border-emerald-400', dotColor: 'bg-emerald-400' }
        ].map((column, colIndex) => (
          <div key={colIndex} className="flex flex-col">
            <div className={`border-t-2 ${column.borderColor} bg-white rounded-t-md px-3 py-2.5 border-x border-b border-zinc-200`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${column.dotColor}`}></div>
                  <h2 className="font-medium text-sm text-zinc-900">{column.title}</h2>
                </div>
                <span className="text-xs text-zinc-500 font-medium">...</span>
              </div>
            </div>
            
            <div className="bg-zinc-50/50 rounded-b-md border-x border-b border-zinc-200 p-3 min-h-125">
              <div className="space-y-2">
                {[...Array(3)].map((_, taskIndex) => (
                  <div key={taskIndex} className="bg-white rounded-md p-3 border border-zinc-200">
                    <div className="animate-pulse space-y-2.5">
                      <div className="h-4 bg-zinc-200 rounded w-3/4"></div>
                      <div className="h-3 bg-zinc-200 rounded w-full"></div>
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-12 bg-zinc-200 rounded"></div>
                        <div className="h-3 w-16 bg-zinc-200 rounded"></div>
                      </div>
                      <div className="flex gap-2 pt-1">
                        <div className="h-6 w-20 bg-zinc-200 rounded"></div>
                        <div className="h-6 w-14 bg-zinc-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}