'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import clsx from 'clsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const itemsPerPage = Number(searchParams.get('limit')) || 10;

  const createPageURL = (pageNumber: number | string, limit?: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    if (limit) {
      params.set('limit', limit.toString());
    }
    return `${pathname}?${params.toString()}`;
  };

  const createLimitURL = (limit: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('limit', limit.toString());
    params.set('page', '1'); // Reset to page 1 when changing items per page
    return `${pathname}?${params.toString()}`;
  };

  // Generate page numbers to display
  const generatePageNumbers = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= 7) {
      // Show all pages if 7 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push('...');
      }
      
      // Show pages around current page
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-xs text-zinc-500">Items per page:</span>
        <div className="flex gap-1">
          {[10, 25, 50].map((limit) => {
            const isSelected = itemsPerPage === limit;
            return (
              <Link
                key={limit}
                href={createLimitURL(limit)}
                className={`px-2.5 py-1 text-xs rounded-md transition-all font-medium border ${
                  isSelected
                    ? 'bg-zinc-900 text-white! border-zinc-900 shadow-sm hover:bg-zinc-800'
                    : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-400 hover:text-zinc-900'
                }`}
              >
                {limit}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Link
          href={createPageURL(Math.max(1, currentPage - 1))}
          className={clsx(
            'flex h-8 w-8 items-center justify-center rounded-md transition-colors',
            {
              'pointer-events-none text-zinc-300': currentPage <= 1,
              'hover:bg-zinc-100 text-zinc-600': currentPage > 1,
            }
          )}
          aria-disabled={currentPage <= 1}
        >
          <ChevronLeft className="w-4 h-4" />
        </Link>

        <div className="flex gap-1">
          {pageNumbers.map((page, index) => {
            if (page === '...') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="flex h-8 w-8 items-center justify-center text-zinc-400 text-xs"
                >
                  ...
                </span>
              );
            }

            const pageNumber = page as number;
            const isCurrentPage = currentPage === pageNumber;
            return (
              <Link
                key={pageNumber}
                href={createPageURL(pageNumber)}
                className={`flex h-8 w-8 items-center justify-center rounded-md text-xs font-medium transition-all ${
                  isCurrentPage
                    ? 'bg-zinc-900 text-white!'
                    : 'text-zinc-600 hover:bg-zinc-100'
                }`}
              >
                {pageNumber}
              </Link>
            );
          })}
        </div>

        <Link
          href={createPageURL(Math.min(totalPages, currentPage + 1))}
          className={clsx(
            'flex h-8 w-8 items-center justify-center rounded-md transition-colors',
            {
              'pointer-events-none text-zinc-300': currentPage >= totalPages,
              'hover:bg-zinc-100 text-zinc-600': currentPage < totalPages,
            }
          )}
          aria-disabled={currentPage >= totalPages}
        >
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="text-xs text-zinc-500">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
}