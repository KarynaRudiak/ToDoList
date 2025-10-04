import { createSlice, nanoid } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";


interface Todo {
    id: string;
    text: string;
    completed: boolean;
};

interface TodosState {
    items: Todo[];
};

const initialState: TodosState = {
    items: []
};

const todosSlice = createSlice({
    name: "todos",
    initialState,
    reducers: {
        addTodo: {
            prepare(text: string) {
                return {
                    payload: {
                        id: nanoid(),
                        text,
                        completed: false,
                    } as Todo,
                };
            },
            reducer(state, action: PayloadAction<Todo>) {
                state.items.unshift(action.payload)
            },
        },
        toggleTodo(state, action:PayloadAction<string>) {
            const todo = state.items.find((t) => t.id === action.payload);
            if (todo) todo.completed = !todo.completed;
        },
        deleteTodo(state, action:PayloadAction<string>) {
            state.items = state.items.filter((t) => t.id !== action.payload)
        },
    },
});

export const { addTodo, toggleTodo, deleteTodo } = todosSlice.actions;
export default todosSlice.reducer