import React from 'react';
import type { Task, TaskStatus } from '../types/task';
import { IconChevronLeft, IconChevronRight, IconTrash, IconEdit } from './Icons';

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, nextStatus: TaskStatus) => void;
  onSelectTask: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDragStart?: (e: React.DragEvent, id: string) => void;
}

const STATUS_ORDER: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE'];

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onDelete,
  onStatusChange,
  onSelectTask,
  onEditTask,
  onDragStart,
}) => {
  const currentIndex = STATUS_ORDER.indexOf(task.status);
  const canMoveLeft = currentIndex > 0;
  const canMoveRight = currentIndex < STATUS_ORDER.length - 1;

  const handleMoveLeft = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (canMoveLeft) {
      onStatusChange(task.id, STATUS_ORDER[currentIndex - 1]);
    }
  };

  const handleMoveRight = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (canMoveRight) {
      onStatusChange(task.id, STATUS_ORDER[currentIndex + 1]);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEditTask(task);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(task.id);
  };

  const formattedDate = new Date(task.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });

  const shortId = `TSK-${task.id.slice(0, 4).toUpperCase()}`;

  return (
    <div
      className="task-card"
      draggable
      onDragStart={(e) => onDragStart && onDragStart(e, task.id)}
      onClick={() => onSelectTask(task)}
    >
      <div className="task-card-header">
        <div className="task-identifiers">
          <span className="task-id-badge">{shortId}</span>
          <span className={`priority-badge priority-${task.priority.toLowerCase()}`}>
            <span className="priority-indicator" />
            {task.priority}
          </span>
        </div>
        <span className="task-date">{formattedDate}</span>
      </div>

      <h3 className="task-title">{task.title}</h3>
      {task.description && <p className="task-desc">{task.description}</p>}

      <div className="task-card-footer">
        <div className="move-buttons">
          <button
            className="btn-icon-sm"
            onClick={handleMoveLeft}
            disabled={!canMoveLeft}
            title={canMoveLeft ? `Move to ${STATUS_ORDER[currentIndex - 1]}` : 'First column'}
            aria-label="Move left"
          >
            <IconChevronLeft />
          </button>
          <button
            className="btn-icon-sm"
            onClick={handleMoveRight}
            disabled={!canMoveRight}
            title={canMoveRight ? `Move to ${STATUS_ORDER[currentIndex + 1]}` : 'Last column'}
            aria-label="Move right"
          >
            <IconChevronRight />
          </button>
        </div>

        <div className="card-actions-right">
          <button
            className="btn-action-icon btn-edit"
            onClick={handleEdit}
            title="Edit task"
            aria-label="Edit task"
          >
            <IconEdit />
          </button>
          <button
            className="btn-action-icon btn-delete"
            onClick={handleDelete}
            title="Delete task"
            aria-label="Delete task"
          >
            <IconTrash />
          </button>
        </div>
      </div>
    </div>
  );
};
