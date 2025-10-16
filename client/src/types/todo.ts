export interface Todo {
  _id: string;
  nameTask: string;
  importanceValue?: number;
  taskGroup?: string;
  dueDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTodoRequest {
  nameTask: string;
  importanceValue?: number;
  taskGroup?: string;
  dueDate?: string;
}

