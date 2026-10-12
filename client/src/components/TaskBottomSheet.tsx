import React from 'react';
import type { Task, TaskStatus } from '../types/task';
import { IconX, IconCheck, IconTrash, IconEdit } from './Icons';

interface TaskBottomSheetProps {
  task: Task | null;
  onClose: () => void;
  onStatusChange: (id: string, nextStatus: TaskStatus) => void;
  onEditTask: (task: Task) => void;
  onDelete: (id: string) => void;
}

const COLUMNS: { status: TaskStatus; label: string; color: string }[] = [
  { status: 'TODO', label: 'To Do', color: '#60a5fa' },
  { status: 'IN_PROGRESS', label: 'In Progress', color: '#fbbf24' },
  { status: 'DONE', label: 'Completed', color: '#34d399' },
];

export const TaskBottomSheet: React.FC<TaskBottomSheetProps> = ({
  task,
  onClose,
  onStatusChange,
  onEditTask,
  onDelete,
}) => {
  if (!task) return null;

  const handleMove = (newStatus: TaskStatus) => {
    onStatusChange(task.id, newStatus);
    onClose();
  };

  const handleEdit = () => {
    onClose();
    onEditTask(task);
  };

  const handleDelete = () => {
    onDelete(task.id);
    onClose();
  };

  return (
    <div className="bottom-sheet-backdrop" onClick={onClose}>
      <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="bottom-sheet-handle" />

        <div className="bottom-sheet-header">
          <div>
            <span className={`priority-badge priority-${task.priority.toLowerCase()}`}>
              {task.priority}
            </span>
            <h3 className="bottom-sheet-title">{task.title}</h3>
          </div>
          <button className="btn-close" onClick={onClose} aria-label="Close"><IconX /></button>
        </div>

        {task.description && (
          <p className="bottom-sheet-desc">{task.description}</p>
        )}

        <div className="bottom-sheet-section">
          <label className="section-label">Move To Column</label>
          <div className="move-options-grid">
            {COLUMNS.map((col) => {
              const isCurrent = task.status === col.status;
              return (
                <button
                  key={col.status}
                  className={`move-option-btn ${isCurrent ? 'current-column' : ''}`}
                  onClick={() => handleMove(col.status)}
                  disabled={isCurrent}
                >
                  <span className="dot" style={{ backgroundColor: col.color }} />
                  {col.label} {isCurrent && <IconCheck />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="bottom-sheet-actions">
          <button className="btn-edit-full" onClick={handleEdit}>
            <IconEdit /> Edit Task Details
          </button>
          <button className="btn-danger-full" onClick={handleDelete}>
            <IconTrash /> Delete Task
          </button>
        </div>
      </div>
    </div>
  );
};
