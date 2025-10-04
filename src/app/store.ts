import { configureStore } from "@reduxjs/toolkit";
import todosReducer from '../features/todos/todosSlice';
import { saveTodos } from "../utils/localStorage";

export const store = configureStore({
    reducer: {
        todos: todosReducer,
    },
});

store.subscribe(() => {
    const state = store.getState();
    saveTodos(state.todos.items);
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;