import React from 'react';
import { IconLayout, IconPlus } from './Icons';

interface HeaderProps {
  onOpenCreateModal: () => void;
  taskCount: number;
  doneCount: number;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCreateModal, taskCount, doneCount }) => {
  // Guard against division by zero when the board is empty
  const percent = taskCount === 0 ? 0 : Math.round((doneCount / taskCount) * 100);

  return (
    <header className="header glass">
      <div className="header-top">
        <div className="header-left">
          <div className="logo-badge">
            <IconLayout size={20} />
          </div>
          <div>
            <h1 className="header-title">Kanban Board</h1>
            <p className="header-subtitle">
              {taskCount} {taskCount === 1 ? 'task' : 'tasks'} · {doneCount} completed
            </p>
          </div>
        </div>
        <button className="btn btn-primary" onClick={onOpenCreateModal}>
          <IconPlus size={16} />
          <span className="btn-label">New Task</span>
          <kbd className="kbd">N</kbd>
        </button>
      </div>

      <div className="progress" aria-label={`${percent}% of tasks completed`}>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${percent}%` }} />
        </div>
        <span className="progress-label">{percent}%</span>
      </div>
    </header>
  );
};
