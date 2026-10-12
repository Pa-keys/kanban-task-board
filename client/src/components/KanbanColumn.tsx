import React, { useState } from 'react';
import type { Task, TaskStatus } from '../types/task';
import { TaskCard } from './TaskCard';

interface KanbanColumnProps {
  title: string;
  status: TaskStatus;
  accentColor: string;
  tasks: Task[];
  onDelete: (id: string) => void;
  onStatusChange: (id: string, nextStatus: TaskStatus) => void;
  onSelectTask: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDragStartTask: (e: React.DragEvent, id: string) => void;
  onDropTask: (targetStatus: TaskStatus) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  title,
  status,
  accentColor,
  tasks,
  onDelete,
  onStatusChange,
  onSelectTask,
  onEditTask,
  onDragStartTask,
  onDropTask,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    onDropTask(status);
  };

  return (
    <div
      className={`kanban-column ${isDragOver ? 'column-drag-over' : ''}`}
      data-status={status}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="column-header" style={{ borderTopColor: accentColor }}>
        <div className="column-title-group">
          <span className="column-dot" style={{ backgroundColor: accentColor }} />
          <h2 className="column-title">{title}</h2>
        </div>
        <span className="column-count">{tasks.length}</span>
      </div>

      <div className="column-body">
        {tasks.length === 0 ? (
          <div className="column-empty">
            <p>No tasks</p>
            <span className="empty-hint">Drop a card here</span>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
              onSelectTask={onSelectTask}
              onEditTask={onEditTask}
              onDragStart={onDragStartTask}
            />
          ))
        )}
      </div>
    </div>
  );
};
