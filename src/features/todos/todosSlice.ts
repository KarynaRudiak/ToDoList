import { createSlice, nanoid } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { loadTodos } from "../../utils/localStorage";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  tags?: string[];
}

interface TodosState {
  items: Todo[];
}

const initialState: TodosState = {
  items: loadTodos(),
};

const extractTags = (text: string): string[] => {
  const re = /#([A-Za-zА-Яа-яЁёІіЇїЄє0-9_-]+)/g;
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

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    addTodo: {
      prepare(input: string) {
        const tags = extractTags(input);
        const text = stripTags(input);
        return {
          payload: {
            id: nanoid(),
            text,
            completed: false,
            tags,
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
  },
});

export const { addTodo, toggleTodo, deleteTodo, editTodo } = todosSlice.actions;
export default todosSlice.reducer;
