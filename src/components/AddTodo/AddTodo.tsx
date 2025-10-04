import { useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import { addTodo } from "../../features/todos/todosSlice";

import styles from "./AddTodo.module.css";

export default function AddTodo() {
    const [text, setText] = useState("");

    const dispatch = useAppDispatch();

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const value = text.trim();
        if (!value) return;

        dispatch(addTodo(value));

        setText("");
    };

    return (
        <form onSubmit={onSubmit} className={styles.form}>
            <input
                type="text"
                placeholder="Add your task"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className={styles.input}
            />
            <button type="submit" className={styles.button}>Add</button>
        </form>
    )
};