import React, { useState } from 'react';
import type { Task, TaskStatus } from '../types/task';
import { KanbanColumn } from './KanbanColumn';

interface KanbanBoardProps {
  tasks: Task[];
  onDelete: (id: string) => void;
  onStatusChange: (id: string, nextStatus: TaskStatus) => void;
  onSelectTask: (task: Task) => void;
  onDragStartTask: (e: React.DragEvent, id: string) => void;
  onDropTask: (targetStatus: TaskStatus) => void;
}

const COLUMNS: { title: string; status: TaskStatus; color: string }[] = [
  { title: 'To Do', status: 'TODO', color: '#60a5fa' },
  { title: 'In Progress', status: 'IN_PROGRESS', color: '#fbbf24' },
  { title: 'Completed', status: 'DONE', color: '#34d399' },
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  onDelete,
  onStatusChange,
  onSelectTask,
  onDragStartTask,
  onDropTask,
}) => {
  // Active column tab for mobile screens
  const [activeMobileStatus, setActiveMobileStatus] = useState<TaskStatus>('TODO');

  return (
    <div className="board-wrapper">
      {/* Mobile Sticky Segmented Tab Bar */}
      <div className="mobile-segmented-tabs">
        {COLUMNS.map((col) => {
          const count = tasks.filter((t) => t.status === col.status).length;
          const isActive = activeMobileStatus === col.status;
          return (
            <button
              key={col.status}
              className={`segmented-tab ${isActive ? 'segmented-tab-active' : ''}`}
              onClick={() => setActiveMobileStatus(col.status)}
              style={isActive ? { borderBottomColor: col.color } : {}}
            >
              <span className="tab-title">{col.title}</span>
              <span className="tab-badge">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Kanban Board Grid (Desktop: 3 columns, Mobile: Active Tab only) */}
      <main className="kanban-board">
        {COLUMNS.map((col) => {
          const columnTasks = tasks.filter((t) => t.status === col.status);
          const isMobileVisible = activeMobileStatus === col.status;

          return (
            <div
              key={col.status}
              className={`column-wrapper ${isMobileVisible ? 'mobile-visible' : 'mobile-hidden'}`}
            >
              <KanbanColumn
                title={col.title}
                status={col.status}
                accentColor={col.color}
                tasks={columnTasks}
                onDelete={onDelete}
                onStatusChange={onStatusChange}
                onSelectTask={onSelectTask}
                onDragStartTask={onDragStartTask}
                onDropTask={onDropTask}
              />
            </div>
          );
        })}
      </main>
    </div>
  );
};
