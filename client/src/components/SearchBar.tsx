import React, { useRef, useEffect } from 'react';
import type { TaskPriority } from '../types/task';
import { IconSearch, IconX } from './Icons';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedPriority: TaskPriority | 'ALL';
  onPriorityChange: (priority: TaskPriority | 'ALL') => void;
}

const PRIORITIES: { label: string; value: TaskPriority | 'ALL'; color: string }[] = [
  { label: 'All', value: 'ALL', color: '#94a3b8' },
  { label: 'High', value: 'HIGH', color: '#f87171' },
  { label: 'Medium', value: 'MEDIUM', color: '#fbbf24' },
  { label: 'Low', value: 'LOW', color: '#34d399' },
];

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedPriority,
  onPriorityChange,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: Press "/" anywhere to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        const isEditingInput = ['INPUT', 'TEXTAREA'].includes(
          (document.activeElement?.tagName || '')
        );
        if (!isEditingInput) {
          e.preventDefault();
          inputRef.current?.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="search-filter-container">
      <div className="search-input-wrapper">
        <span className="search-icon"><IconSearch /></span>
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder="Filter tasks by title or details..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchQuery ? (
          <button
            className="search-clear-btn"
            onClick={() => onSearchChange('')}
            title="Clear search"
          >
            <IconX size={14} />
          </button>
        ) : (
          <span className="search-shortcut-badge">/</span>
        )}
      </div>

      <div className="priority-filters">
        {PRIORITIES.map((p) => {
          const isActive = selectedPriority === p.value;
          return (
            <button
              key={p.value}
              className={`filter-pill ${isActive ? 'filter-pill-active' : ''}`}
              onClick={() => onPriorityChange(p.value)}
              style={isActive ? { borderColor: p.color } : {}}
            >
              <span
                className="filter-dot"
                style={{ backgroundColor: p.color }}
              />
              {p.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
