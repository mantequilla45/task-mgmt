'use client';

import { useState, useRef, useEffect } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { Search, X } from 'lucide-react';

export default function ExpandableSearch({ placeholder }: { placeholder: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        const currentValue = inputRef.current?.value;
        if (!currentValue) {
          setIsExpanded(false);
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const currentQuery = searchParams.get('query')?.toString() || '';

  useEffect(() => {
    if (currentQuery) {
      setIsExpanded(true);
    }
  }, [currentQuery]);

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <button
          onClick={() => setIsExpanded(true)}
          className={`h-9 w-9 rounded-md border bg-white border-zinc-200 flex items-center justify-center hover:border-zinc-400 transition-all ${
            isExpanded ? 'opacity-0 pointer-events-none' : ''
          }`}
        >
          <Search className="w-4 h-4 text-zinc-400" />
        </button>
        
        <div className={`absolute right-0 top-0 transition-all duration-200 ease-out ${
          isExpanded ? 'w-64 opacity-100' : 'w-9 opacity-0 pointer-events-none'
        }`}>
          <input
            ref={inputRef}
            className="w-full rounded-md border border-zinc-200 py-2 pl-10 pr-3 text-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400 transition-colors bg-white"
            placeholder={placeholder}
            onChange={(e) => {
              handleSearch(e.target.value);
            }}
            defaultValue={currentQuery}
          />
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          {currentQuery && (
            <button
              onClick={() => {
                handleSearch('');
                setIsExpanded(false);
                if (inputRef.current) {
                  inputRef.current.value = '';
                }
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}