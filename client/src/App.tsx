import { useState, useEffect, useRef } from 'react';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import type { Todo, CreateTodoRequest } from './types/todo';
import { todoApi } from './services/api';
import './App.css';

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showFabMenu, setShowFabMenu] = useState(false);
  const fabRef = useRef<HTMLDivElement>(null);

  // Fetch todos on mount
  useEffect(() => {
    fetchTodos();
  }, []);

  // Close FAB menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (fabRef.current && !fabRef.current.contains(event.target as Node)) {
        setShowFabMenu(false);
      }
    };

    if (showFabMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFabMenu]);

  const fetchTodos = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedTodos = await todoApi.getAllTodos();
      setTodos(fetchedTodos);
    } catch (err) {
      setError('Failed to load tasks. Please try again later.');
      console.error('Error fetching todos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTodo = async (newTodo: CreateTodoRequest) => {
    try {
      setIsCreating(true);
      setError(null);
      await todoApi.createTodo(newTodo);
      // Refresh the list after creating
      await fetchTodos();
      // Hide the form after successful creation
      setShowForm(false);
    } catch (err) {
      setError('Failed to create task. Please try again.');
      console.error('Error creating todo:', err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      setError(null);
      await todoApi.deleteTodo(id);
      // Remove from local state
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (err) {
      setError('Failed to delete task. Please try again.');
      console.error('Error deleting todo:', err);
    }
  };

  const handleFabMenuToggle = () => {
    setShowFabMenu(!showFabMenu);
  };

  const handleAddTask = () => {
    setShowForm(true);
    setShowFabMenu(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-2">
            Matthew's Todo List
          </h1>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
            <span>{error}</span>
            <button 
              onClick={() => setError(null)}
              className="text-red-700 hover:text-red-900"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Todo Form Modal - Only show when showForm is true */}
        {showForm && (
          <div 
            className="fixed inset-0 bg-gray-400/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowForm(false)}
          >
            <div 
              className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <TodoForm 
                onSubmit={handleCreateTodo} 
                isLoading={isCreating}
                onCancel={() => setShowForm(false)}
              />
            </div>
          </div>
        )}

        {/* Todo List */}
        <TodoList 
          todos={todos} 
          isLoading={isLoading}
          onDelete={handleDeleteTodo}
        />

        {/* Expandable Floating Action Button */}
        {!showForm && (
          <div ref={fabRef} className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Action Menu Items */}
            <div className={`flex items-center gap-3 mb-4 transition-all duration-300 ${showFabMenu ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
              <button
                onClick={handleAddTask}
                className="flex items-center gap-3 bg-white text-gray-700 px-4 py-3 rounded-full shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all duration-200 whitespace-nowrap"
              >
                <span className="text-sm font-medium">Add Task</span>
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
              </button>
            </div>

            {/* Main FAB Button */}
            <button
              onClick={handleFabMenuToggle}
              className={`bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-200 ${showFabMenu ? 'rotate-45' : 'rotate-0'}`}
              aria-label="Toggle action menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
