'use client';

import { useState, useRef, useEffect } from 'react';
import { MoreVertical, Edit, Trash2, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import EditBoardModal from './edit-board-modal';
import DeleteBoardModal from './delete-board-modal';
import { Board } from '@/app/lib/types';

interface BoardSettingsDropdownProps {
  boardId: string;
  boardName: string;
  board: Board;
  taskCount?: number;
  allBoards?: Board[];
}

export default function BoardSettingsDropdown({ boardId, boardName, board, taskCount = 0, allBoards = [] }: BoardSettingsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="h-9 w-9 rounded-md border border-zinc-200 bg-white flex items-center justify-center hover:bg-zinc-50 transition-colors cursor-pointer"
          title="Board settings"
        >
          <MoreVertical className="h-4 w-4 text-zinc-600" />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-md bg-white shadow-lg border border-zinc-200 py-1 z-10">
            <button
              onClick={() => {
                setIsEditModalOpen(true);
                setIsOpen(false);
              }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer"
            >
              <Edit className="h-3.5 w-3.5" />
              Edit Board
            </button>
          
          <button
            onClick={() => {
              setIsDeleteModalOpen(true);
              setIsOpen(false);
            }}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete Board
          </button>
          
          <div className="border-t border-zinc-100 my-1"></div>
          
          <button
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-zinc-400 cursor-default"
            disabled
          >
            <Info className="h-3.5 w-3.5" />
            More Details
            <span className="ml-auto text-xs text-zinc-400">Soon</span>
          </button>
        </div>
      )}
    </div>
    
    <EditBoardModal 
      board={board}
      isOpen={isEditModalOpen}
      onClose={() => setIsEditModalOpen(false)}
    />
    
    <DeleteBoardModal
      board={{ ...board, taskCount }}
      isOpen={isDeleteModalOpen}
      onClose={() => setIsDeleteModalOpen(false)}
      allBoards={allBoards}
    />
    </>
  );
}