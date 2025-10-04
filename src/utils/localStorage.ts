export type TodoItem = {
    id: string;
    text: string;
    completed: boolean;
}

const STORAGE_KEY = 'todos';

export function loadTodos(): TodoItem[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if(!raw) return [];
        const parsed = JSON.parse(raw);

        if(Array.isArray(parsed)) return parsed as TodoItem[];
        return [];
    } catch {
        return [];
    }
}

export function saveTodos(todos: TodoItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch {
    
  }
}