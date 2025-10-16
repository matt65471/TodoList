import { useState } from 'react';
import type { CreateTodoRequest } from '../types/todo';

interface TodoFormProps {
  onSubmit: (todo: CreateTodoRequest) => void;
  isLoading?: boolean;
}

export default function TodoForm({ onSubmit, isLoading }: TodoFormProps) {
  const [nameTask, setNameTask] = useState('');
  const [importanceValue, setImportanceValue] = useState<number>(3);
  const [taskGroup, setTaskGroup] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nameTask.trim()) {
      return;
    }

    const newTodo: CreateTodoRequest = {
      nameTask: nameTask.trim(),
      importanceValue: importanceValue,
      taskGroup: taskGroup.trim() || undefined,
      dueDate: dueDate || undefined,
    };

    onSubmit(newTodo);
    
    // Reset form
    setNameTask('');
    setImportanceValue(3);
    setTaskGroup('');
    setDueDate('');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Create New Task</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nameTask" className="block text-sm font-medium text-gray-700 mb-1">
            Task Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="nameTask"
            value={nameTask}
            onChange={(e) => setNameTask(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            placeholder="Enter your task..."
            required
            disabled={isLoading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="importanceValue" className="block text-sm font-medium text-gray-700 mb-1">
              Importance (1-5)
            </label>
            <select
              id="importanceValue"
              value={importanceValue}
              onChange={(e) => setImportanceValue(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              disabled={isLoading}
            >
              <option value={1}>1 - Low</option>
              <option value={2}>2</option>
              <option value={3}>3 - Medium</option>
              <option value={4}>4</option>
              <option value={5}>5 - High</option>
            </select>
          </div>

          <div>
            <label htmlFor="taskGroup" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <input
              type="text"
              id="taskGroup"
              value={taskGroup}
              onChange={(e) => setTaskGroup(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="e.g., Work, Personal"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              disabled={isLoading}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !nameTask.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
        >
          {isLoading ? 'Creating...' : 'Add Task'}
        </button>
      </form>
    </div>
  );
}

