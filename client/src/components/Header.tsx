import React from 'react';

interface HeaderProps {
  onOpenCreateModal: () => void;
  taskCount: number;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCreateModal, taskCount }) => {
  return (
    <header className="header">
      <div className="header-left">
        <div className="logo-badge">📋</div>
        <div>
          <h1 className="header-title">Kanban Task Board</h1>
          <p className="header-subtitle">
            Full-Stack Mentorship Project • {taskCount} total {taskCount === 1 ? 'task' : 'tasks'}
          </p>
        </div>
      </div>
      <button className="btn btn-primary" onClick={onOpenCreateModal}>
        <span className="btn-icon">+</span> New Task
      </button>
    </header>
  );
};
