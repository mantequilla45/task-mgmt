'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/app/ui/button';
import { updateBoard } from '@/app/lib/actions';
import { Board } from '@/app/lib/types';
import { X } from 'lucide-react';

interface EditBoardModalProps {
  board: Board;
  isOpen: boolean;
  onClose: () => void;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <Button
      type="submit"
      variant="primary"
      disabled={pending}
    >
      {pending ? 'Saving...' : 'Save Changes'}
    </Button>
  );
}

export default function EditBoardModal({ board, isOpen, onClose }: EditBoardModalProps) {
  const [formData, setFormData] = useState({
    name: board.name,
    description: board.description || '',
    color: board.color || '#3B82F6',
  });

  const handleSubmit = async (formDataObj: FormData) => {
    formDataObj.append('id', board.id);
    const result = await updateBoard(formDataObj);
    if (result.success) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-zinc-900">Edit Board</h2>
          <button
            onClick={onClose}
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
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-md focus:outline-none focus:border-zinc-400 transition-colors"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-xs font-medium text-zinc-700 mb-1.5">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-md focus:outline-none focus:border-zinc-400 transition-colors"
              rows={3}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="color" className="block text-xs font-medium text-zinc-700 mb-1.5">
              Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                id="color"
                name="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="h-10 w-20 border border-zinc-200 rounded cursor-pointer"
              />
              <span className="text-xs text-zinc-500">{formData.color}</span>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              onClick={onClose}
              variant="secondary"
            >
              Cancel
            </Button>
            <SubmitButton />
          </div>
        </form>
      </div>
    </div>
  );
}