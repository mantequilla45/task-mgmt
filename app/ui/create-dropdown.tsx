'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, FolderPlus, ListPlus } from 'lucide-react';

export default function CreateDropdown({ boardId }: { boardId?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isOnBoardPage = pathname.includes('/dashboard/board/');

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1.5 rounded-md bg-zinc-900 text-white flex items-center gap-1.5 hover:bg-zinc-800 transition-colors text-xs font-medium"
      >
        Create
        <ChevronDown className="w-3 h-3" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-40 rounded-md bg-white border border-zinc-200 shadow-lg z-10">
          <div className="py-1">
            <Link
              href="/dashboard/boards/new"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-700 hover:bg-zinc-50 transition-colors"
            >
              <FolderPlus className="w-3.5 h-3.5" />
              New Board
            </Link>
            {boardId ? (
              <Link
                href={`/dashboard/board/${boardId}/tasks/new`}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-700 hover:bg-zinc-50 transition-colors"
              >
                <ListPlus className="w-3.5 h-3.5" />
                New Task
              </Link>
            ) : (
              <button
                onClick={() => {
                  setIsOpen(false);
                  alert('Please select a board first to create a task');
                }}
                className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-400 hover:bg-zinc-50 transition-colors w-full text-left"
              >
                <ListPlus className="w-3.5 h-3.5" />
                New Task
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}