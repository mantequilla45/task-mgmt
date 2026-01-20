'use client';

import { useState, useEffect } from 'react';
import { X, AlertTriangle, Trash2, ArrowRight, Package } from 'lucide-react';
import { Board } from '@/app/lib/types';
import { deleteBoard } from '@/app/lib/actions';
import { useRouter } from 'next/navigation';

interface DeleteBoardModalProps {
  board: Board & { taskCount?: number };
  isOpen: boolean;
  onClose: () => void;
  allBoards?: Board[];
}

export default function DeleteBoardModal({ 
  board, 
  isOpen, 
  onClose,
  allBoards = []
}: DeleteBoardModalProps) {
  const [deleteOption, setDeleteOption] = useState<'orphan' | 'transfer' | 'delete'>('orphan');
  const [targetBoardId, setTargetBoardId] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const otherBoards = allBoards.filter(b => b.id !== board.id);
  const hasOtherBoards = otherBoards.length > 0;

  useEffect(() => {
    if (isOpen && otherBoards.length > 0) {
      setTargetBoardId(otherBoards[0].id);
    }
  }, [isOpen, otherBoards]);

  if (!isOpen) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    
    const formData = new FormData();
    formData.append('id', board.id);
    formData.append('taskHandling', deleteOption);
    if (deleteOption === 'transfer' && targetBoardId) {
      formData.append('targetBoardId', targetBoardId);
    }

    try {
      await deleteBoard(formData);
      router.push('/dashboard');
      router.refresh();
      onClose();
    } catch (error) {
      console.error('Failed to delete board:', error);
      setIsDeleting(false);
    }
  };

  const taskCount = board.taskCount || 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Delete Board</h2>
                <p className="text-sm text-gray-500">
                  Delete "{board.name}"
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {taskCount > 0 ? (
            <>
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800">
                  This board contains <span className="font-semibold">{taskCount} task{taskCount !== 1 ? 's' : ''}</span>.
                  What would you like to do with {taskCount === 1 ? 'it' : 'them'}?
                </p>
              </div>

              <div className="space-y-2 mb-6">
                <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="deleteOption"
                    value="orphan"
                    checked={deleteOption === 'orphan'}
                    onChange={(e) => setDeleteOption(e.target.value as 'orphan' | 'transfer' | 'delete')}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-amber-500" />
                      <span className="font-medium text-sm">Keep tasks without board</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Tasks will be moved to "Tasks without Board" and can be reassigned later
                    </p>
                  </div>
                </label>

                {hasOtherBoards && (
                  <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="deleteOption"
                      value="transfer"
                      checked={deleteOption === 'transfer'}
                      onChange={(e) => setDeleteOption(e.target.value as 'orphan' | 'transfer' | 'delete')}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <ArrowRight className="w-4 h-4 text-blue-500" />
                        <span className="font-medium text-sm">Transfer to another board</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 mb-2">
                        Move all tasks to a different board
                      </p>
                      {deleteOption === 'transfer' && (
                        <select
                          value={targetBoardId}
                          onChange={(e) => setTargetBoardId(e.target.value)}
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {otherBoards.map(b => (
                            <option key={b.id} value={b.id}>
                              {b.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </label>
                )}

                <label className="flex items-start gap-3 p-3 border border-red-200 rounded-lg hover:bg-red-50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="deleteOption"
                    value="delete"
                    checked={deleteOption === 'delete'}
                    onChange={(e) => setDeleteOption(e.target.value as 'orphan' | 'transfer' | 'delete')}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Trash2 className="w-4 h-4 text-red-500" />
                      <span className="font-medium text-sm">Delete tasks too</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Permanently delete all {taskCount} task{taskCount !== 1 ? 's' : ''} in this board
                    </p>
                  </div>
                </label>
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-600 mb-6">
              This board is empty and can be safely deleted.
            </p>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting || (deleteOption === 'transfer' && !targetBoardId)}
              className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isDeleting ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Delete Board
                </>
              )}
            </button>
          </div>
      </div>
    </div>
  );
}