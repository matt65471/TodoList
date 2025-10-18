import axios from 'axios';
import type { Todo, CreateTodoRequest } from '../types/todo';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const todoApi = {
  // Get all todos
  getAllTodos: async (): Promise<Todo[]> => {
    const response = await api.get('/todos');
    return response.data;
  },

  // Create a new todo
  createTodo: async (todo: CreateTodoRequest): Promise<{ success: boolean; id: string }> => {
    const response = await api.post('/todos', todo);
    return response.data;
  },

  // Delete a todo
  deleteTodo: async (id: string): Promise<void> => {
    await api.delete(`/todos/${id}`);
  },

  // Update a todo
  updateTodo: async (id: string, updates: Partial<CreateTodoRequest>): Promise<Todo> => {
    const response = await api.patch(`/todos/${id}`, updates);
    return response.data.data;
  },

  // Toggle completion status of a todo
  toggleCompletion: async (id: string): Promise<Todo> => {
    const response = await api.patch(`/todos/${id}/toggle`);
    return response.data.data;
  },
};
