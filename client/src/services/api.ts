import type { Todo, CreateTodoRequest } from '../types/todo';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export const todoApi = {
  // Get all todos
  getAllTodos: async (): Promise<Todo[]> => {
    const response = await fetch(`${API_BASE_URL}/todos`);
    if (!response.ok) {
      throw new Error('Failed to fetch todos');
    }
    return response.json();
  },

  // Create a new todo
  createTodo: async (todo: CreateTodoRequest): Promise<{ success: boolean; id: string }> => {
    const response = await fetch(`${API_BASE_URL}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todo),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create todo');
    }
    
    return response.json();
  },

  // Delete a todo
  deleteTodo: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete todo');
    }
  },

  // Update a todo
  updateTodo: async (id: string, updates: Partial<CreateTodoRequest>): Promise<Todo> => {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update todo');
    }
    
    const data = await response.json();
    return data.data;
  },
};

