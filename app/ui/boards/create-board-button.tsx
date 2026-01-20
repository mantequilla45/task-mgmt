'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/app/ui/button';
import { createBoard } from '@/app/lib/actions';
import { Plus, X } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <Button
      type="submit"
      variant="primary"
      disabled={pending}
    >
      {pending ? 'Creating...' : 'Create Board'}
    </Button>
  );
}

export default function CreateBoardButton() {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    const result = await createBoard(formData);
    if (result.success) {
      setIsOpen(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)} 
        className="h-9 px-3 rounded-md bg-zinc-900 text-white flex items-center gap-1.5 hover:bg-zinc-800 transition-colors text-xs font-medium cursor-pointer"
      >
        <Plus className="h-3 w-3" />
        Add Board
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-zinc-900">Create New Board</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form action={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-xs font-medium text-zinc-700 mb-1.5">
                  Board Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-md focus:outline-none focus:border-zinc-400 transition-colors"
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="description" className="block text-xs font-medium text-zinc-700 mb-1.5">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-md focus:outline-none focus:border-zinc-400 transition-colors"
                  rows={3}
                />
              </div>
              <div className="flex gap-3 justify-end">
                <Button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  variant="secondary"
                >
                  Cancel
                </Button>
                <SubmitButton />
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}