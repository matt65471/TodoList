import { useState, useEffect } from 'react';
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

  // Fetch todos on mount
  useEffect(() => {
    fetchTodos();
  }, []);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-2">
            Todo List
          </h1>
          <p className="text-gray-600">Organize your tasks efficiently</p>
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

        {/* Todo Form */}
        <TodoForm onSubmit={handleCreateTodo} isLoading={isCreating} />

        {/* Todo List */}
        <TodoList 
          todos={todos} 
          isLoading={isLoading}
          onDelete={handleDeleteTodo}
        />
      </div>
    </div>
  );
}

export default App;
