import { useState, useCallback } from 'react';
import type { Task } from '../types';
import { INITIAL_TASKS } from '../constants/data';

interface UseTasksResult {
  tasks: Task[];
  toggleTask: (id: string) => void;
  addTask: (title: string) => void;
}

export function useTasks(): UseTasksResult {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);

  const toggleTask = useCallback((id: string) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)));
  }, []);

  const addTask = useCallback((title: string) => {
    const id = 'n' + Math.random().toString(36).slice(2, 7);
    setTasks(prev => [...prev, { id, title, overdue: false, source: 'one-off', completed: false }]);
  }, []);

  return { tasks, toggleTask, addTask };
}
