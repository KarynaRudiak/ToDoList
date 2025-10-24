import { createSlice, nanoid } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { loadTodos } from "../../utils/localStorage";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  tags?: string[];
  pinned?: boolean;
  dueAt?: string | null;
}

interface TodosState {
  items: Todo[];
}

const initialState: TodosState = {
  items: loadTodos(),
};

const extractTags = (text: string): string[] => {
  const re = /#([\p{L}\d_-]+)/gu;
  const set = new Set<string>();
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) set.add(m[1].toLowerCase());
  return [...set];
};

const stripTags = (text: string): string => {
  return text
    .replace(/(^|\s)#[\p{L}\d_-]+/gu, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
};

type AddTodoInput = string | { text: string; dueAt?: string | null };

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    addTodo: {
      prepare(input: AddTodoInput) {
        const rawText = typeof input === "string" ? input : input.text;
        const dueAt = typeof input === "string" ? null : input.dueAt ?? null;
        const tags = extractTags(rawText);
        const text = stripTags(rawText);
        return {
          payload: {
            id: nanoid(),
            text,
            completed: false,
            tags,
            pinned: false,
            dueAt,
          } as Todo,
        };
      },
      reducer(state, action: PayloadAction<Todo>) {
        state.items.unshift(action.payload);
      },
    },
    toggleTodo(state, action: PayloadAction<string>) {
      const todo = state.items.find((t) => t.id === action.payload);
      if (todo) todo.completed = !todo.completed;
    },
    deleteTodo(state, action: PayloadAction<string>) {
      state.items = state.items.filter((t) => t.id !== action.payload);
    },
    editTodo(state, action: PayloadAction<{ id: string; newText: string }>) {
      const { id, newText } = action.payload;
      const t = state.items.find((x) => x.id === id);
      if (t) {
        t.tags = extractTags(newText);
        t.text = stripTags(newText);
      }
    },
    togglePin(state, action: PayloadAction<string>) {
      const t = state.items.find((x) => x.id === action.payload);
      if (t) t.pinned = !t.pinned;
    },
    setDueDate(
      state,
      action: PayloadAction<{ id: string; dueAt: string | null }>
    ) {
      const t = state.items.find((x) => x.id === action.payload.id);
      if (t) t.dueAt = action.payload.dueAt;
    },
  },
});

export const { addTodo, toggleTodo, deleteTodo, editTodo, togglePin, setDueDate } =
  todosSlice.actions;
export default todosSlice.reducer;
