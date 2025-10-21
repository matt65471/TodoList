import { useState, useEffect, useRef } from 'react';
import type { Todo } from '../types/todo';

interface TodoListProps {
  todos: Todo[];
  isLoading?: boolean;
  onDelete?: (id: string) => void;
  onToggleCompletion?: (id: string) => void;
}

type SortOption = 'newest' | 'oldest' | 'dueDateAsc' | 'dueDateDesc' | 'importanceHigh' | 'importanceLow';

export default function TodoList({ todos, isLoading, onDelete, onToggleCompletion }: TodoListProps) {
  const [sortOptions, setSortOptions] = useState<SortOption[]>(['dueDateAsc']);
  const [tempSortOptions, setTempSortOptions] = useState<SortOption[]>(['dueDateAsc']);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSortDropdown(false);
        // Reset temp options to current applied options
        setTempSortOptions([...sortOptions]);
      }
    };

    if (showSortDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSortDropdown, sortOptions]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getImportanceColor = (importance?: number) => {
    if (!importance) return 'bg-gray-100 text-gray-700';
    if (importance >= 4) return 'bg-red-100 text-red-700';
    if (importance === 3) return 'bg-yellow-100 text-yellow-700';
    return 'bg-green-100 text-green-700';
  };

  const getImportanceLabel = (importance?: number) => {
    if (!importance) return 'Medium';
    if (importance >= 4) return 'High';
    if (importance === 3) return 'Medium';
    return 'Low';
  };

  const getSortLabel = (sortOption: SortOption) => {
    switch (sortOption) {
      case 'newest': return 'Newest First';
      case 'oldest': return 'Oldest First';
      case 'dueDateAsc': return 'Due Date (Earliest)';
      case 'dueDateDesc': return 'Due Date (Latest)';
      case 'importanceHigh': return 'Importance (High to Low)';
      case 'importanceLow': return 'Importance (Low to High)';
      default: return 'Newest First';
    }
  };

  const toggleTempSortOption = (option: SortOption) => {
    setTempSortOptions(prev => {
      if (prev.includes(option)) {
        // Remove the option if it's already selected
        const newOptions = prev.filter(opt => opt !== option);
        // If no options left, default to dueDateAsc
        return newOptions.length > 0 ? newOptions : ['dueDateAsc'];
      } else {
        // Add the option
        return [...prev, option];
      }
    });
  };

  const applySortOptions = () => {
    setSortOptions([...tempSortOptions]);
    setShowSortDropdown(false);
  };

  const cancelSortOptions = () => {
    setTempSortOptions([...sortOptions]);
    setShowSortDropdown(false);
  };

  const sortedTodos = [...todos].sort((a, b) => {
    // Apply multiple sort criteria in order
    for (const sortOption of sortOptions) {
      let result = 0;
      
      switch (sortOption) {
        case 'newest':
          result = new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
          break;
        case 'oldest':
          result = new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
          break;
        case 'dueDateAsc':
          const dateA = new Date(a.dueDate || '9999-12-31').getTime();
          const dateB = new Date(b.dueDate || '9999-12-31').getTime();
          result = dateA - dateB;
          break;
        case 'dueDateDesc':
          const dateADesc = new Date(a.dueDate || '1900-01-01').getTime();
          const dateBDesc = new Date(b.dueDate || '1900-01-01').getTime();
          result = dateBDesc - dateADesc;
          break;
        case 'importanceHigh':
          result = (b.importanceValue || 0) - (a.importanceValue || 0);
          break;
        case 'importanceLow':
          result = (a.importanceValue || 0) - (b.importanceValue || 0);
          break;
      }
      
      // If this sort criteria gives a definitive result, use it
      if (result !== 0) {
        return result;
      }
      // Otherwise, continue to the next sort criteria
    }
    
    return 0;
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Loading tasks...</p>
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900">No tasks yet</h3>
        <p className="mt-1 text-gray-500">Get started by creating a new task above.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Your Tasks</h2>
            <p className="text-sm text-gray-600 mt-1">{todos.length} {todos.length === 1 ? 'task' : 'tasks'} in total</p>
          </div>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-150"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
              Sort
            </button>

            {/* Dropdown Menu */}
            {showSortDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <div className="py-2">
                  {(['newest', 'oldest', 'dueDateAsc', 'dueDateDesc', 'importanceHigh', 'importanceLow'] as SortOption[]).map((option) => (
                    <button
                      key={option}
                      onClick={() => toggleTempSortOption(option)}
                      className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-50 transition duration-150 flex items-center justify-between ${
                        tempSortOptions.includes(option) ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                      }`}
                    >
                      <span>{getSortLabel(option)}</span>
                      {tempSortOptions.includes(option) && (
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
                
                {/* Apply/Cancel Buttons */}
                <div className="border-t border-gray-200 px-3 py-2 flex gap-2">
                  <button
                    onClick={applySortOptions}
                    className="flex-1 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-150"
                  >
                    Apply
                  </button>
                  <button
                    onClick={cancelSortOptions}
                    className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-150"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="divide-y divide-gray-200">
        {sortedTodos.map((todo) => (
          <div
            key={todo._id}
            className="p-6 hover:bg-gray-50 transition duration-150"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                {/* Completion Circle */}
                <button
                  onClick={() => onToggleCompletion?.(todo._id)}
                  className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 hover:scale-110 ${
                    todo.isCompleted 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : 'border-gray-300 hover:border-green-400'
                  }`}
                  title={todo.isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                >
                  {todo.isCompleted && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>

                <div className="flex-1">
                  <h3 className={`text-lg font-semibold mb-2 transition-all duration-200 ${
                    todo.isCompleted 
                      ? 'text-gray-500 line-through' 
                      : 'text-gray-900'
                  }`}>
                    {todo.nameTask}
                  </h3>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getImportanceColor(todo.importanceValue)}`}>
                    {getImportanceLabel(todo.importanceValue)}
                  </span>
                  
                  {todo.taskGroup && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      {todo.taskGroup}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  {todo.dueDate && (
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Due: {formatDate(todo.dueDate)}</span>
                    </div>
                  )}
                  
                  {todo.createdAt && (
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Created: {formatDate(todo.createdAt)}</span>
                    </div>
                  )}
                </div>
                </div>
              </div>

              {onDelete && (
                <button
                  onClick={() => onDelete(todo._id)}
                  className="ml-4 text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition duration-150"
                  title="Delete task"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

