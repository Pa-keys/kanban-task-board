import React, { useState, useEffect, useMemo } from 'react';
import type { Task, TaskStatus, TaskPriority, CreateTaskDTO, UpdateTaskDTO } from './types/task';
import { taskApi } from './services/api';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { KanbanBoard } from './components/KanbanBoard';
import { TaskModal } from './components/TaskModal';
import { TaskBottomSheet } from './components/TaskBottomSheet';
import { IconAlert } from './components/Icons';

export const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State: tracks whether modal is open and which task is being edited (null = create new)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPriority, setSelectedPriority] = useState<TaskPriority | 'ALL'>('ALL');

  // Drag-and-Drop state
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);

  // Mobile Bottom Sheet state
  const [sheetTask, setSheetTask] = useState<Task | null>(null);

  // 1. Fetch initial tasks from backend API
  const loadTasks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await taskApi.getTasks();
      setTasks(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred while fetching tasks');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  // 2. Keyboard shortcut: Press "N" to quickly create a new task
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isEditingInput = ['INPUT', 'TEXTAREA'].includes(
        (document.activeElement?.tagName || '')
      );
      if (!isEditingInput && (e.key === 'n' || e.key === 'N')) {
        e.preventDefault();
        setEditingTask(null);
        setIsModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 3. Open modal in Create mode
  const handleOpenCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  // 4. Open modal in Edit mode
  const handleOpenEditModal = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  // 5. Submit handler for Modal (handles both Create and Edit)
  const handleModalSubmit = async (dto: CreateTaskDTO | UpdateTaskDTO) => {
    if (editingTask) {
      // Edit existing task
      // Optimistic update: instantly reflect changes on board
      setTasks((prev) =>
        prev.map((t) => (t.id === editingTask.id ? { ...t, ...dto, updatedAt: new Date().toISOString() } : t))
      );
      try {
        const updated = await taskApi.updateTask(editingTask.id, dto);
        setTasks((prev) => prev.map((t) => (t.id === editingTask.id ? updated : t)));
      } catch (err: unknown) {
        setError('Failed to save task edits to server');
        loadTasks();
      }
    } else {
      // Create new task
      const newTask = await taskApi.createTask(dto as CreateTaskDTO);
      setTasks((prevTasks) => [...prevTasks, newTask]);
    }
  };

  // 6. Move task status handler (Optimistic UI Update)
  const handleStatusChange = async (id: string, nextStatus: TaskStatus) => {
    try {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: nextStatus } : t))
      );
      await taskApi.updateTask(id, { status: nextStatus });
    } catch (err: unknown) {
      setError('Failed to persist task status change to server');
      loadTasks();
    }
  };

  // 7. Delete task handler (Optimistic UI Update)
  const handleDeleteTask = async (id: string) => {
    try {
      setTasks((prev) => prev.filter((t) => t.id !== id));
      await taskApi.deleteTask(id);
    } catch (err: unknown) {
      setError('Failed to delete task from server');
      loadTasks();
    }
  };

  // 8. Drag-and-Drop Handlers
  const handleDragStartTask = (e: React.DragEvent, id: string) => {
    setDraggingTaskId(id);
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDropTask = async (targetStatus: TaskStatus) => {
    if (!draggingTaskId) return;
    const task = tasks.find((t) => t.id === draggingTaskId);
    if (task && task.status !== targetStatus) {
      handleStatusChange(draggingTaskId, targetStatus);
    }
    setDraggingTaskId(null);
  };

  // 9. Card click handler: on desktop (>=820px) open edit modal directly; on mobile (<820px) open bottom sheet drawer
  const handleCardClick = (task: Task) => {
    if (window.innerWidth < 820) {
      setSheetTask(task);
    } else {
      handleOpenEditModal(task);
    }
  };

  // 10. Filtered tasks using useMemo for performance
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchesSearch =
        searchQuery === '' ||
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPriority =
        selectedPriority === 'ALL' || t.priority === selectedPriority;

      return matchesSearch && matchesPriority;
    });
  }, [tasks, searchQuery, selectedPriority]);

  return (
    <div className="app-container">
      {/* Ambient aurora: decorative blurred light blobs, hidden from screen readers */}
      <div className="aurora" aria-hidden="true">
        <span className="blob blob-1" />
        <span className="blob blob-2" />
        <span className="blob blob-3" />
      </div>

      <Header
        onOpenCreateModal={handleOpenCreateModal}
        taskCount={tasks.length}
        doneCount={tasks.filter((t) => t.status === 'DONE').length}
      />

      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedPriority={selectedPriority}
        onPriorityChange={setSelectedPriority}
      />

      {error && (
        <div className="banner-error">
          <span className="banner-msg"><IconAlert size={16} /> {error}</span>
          <button className="btn-retry" onClick={loadTasks}>
            Retry
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="loading-state">
          <div className="spinner" />
          <p>Connecting to SQLite & syncing tasks...</p>
        </div>
      ) : (
        <KanbanBoard
          tasks={filteredTasks}
          onDelete={handleDeleteTask}
          onStatusChange={handleStatusChange}
          onSelectTask={handleCardClick}
          onEditTask={handleOpenEditModal}
          onDragStartTask={handleDragStartTask}
          onDropTask={handleDropTask}
        />
      )}

      <TaskModal
        isOpen={isModalOpen}
        initialTask={editingTask}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleModalSubmit}
      />

      <TaskBottomSheet
        task={sheetTask}
        onClose={() => setSheetTask(null)}
        onStatusChange={handleStatusChange}
        onEditTask={handleOpenEditModal}
        onDelete={handleDeleteTask}
      />
    </div>
  );
};

export default App;
