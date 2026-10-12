import React, { useState, useEffect } from 'react';
import type { CreateTaskDTO, TaskPriority, TaskStatus } from '../types/task';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dto: CreateTaskDTO) => Promise<void>;
}

export const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('TODO');
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDescription('');
      setStatus('TODO');
      setPriority('MEDIUM');
      setValidationError('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setValidationError('Task title is required');
      return;
    }

    try {
      setIsSubmitting(true);
      setValidationError('');
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
      });
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setValidationError(err.message);
      } else {
        setValidationError('Failed to save task');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Task</h2>
          <button className="btn-close" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        {validationError && <div className="alert-error">{validationError}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="task-title">Title *</label>
            <input
              id="task-title"
              type="text"
              placeholder="e.g. Design authentication workflow"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="task-desc">Description</label>
            <textarea
              id="task-desc"
              rows={3}
              placeholder="Add relevant notes, details, or acceptance criteria..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="task-status">Status</label>
              <select
                id="task-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Completed</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="task-priority">Priority</label>
              <select
                id="task-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
