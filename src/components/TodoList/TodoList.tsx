import { useAppSelector } from "../../app/hooks";
import TodoItem from "../TodoItem/TodoItem";
import styles from "./TodoList.module.css";

export default function TodoList() {
    const todos = useAppSelector((state) => state.todos.items);

    return (
        <div className={styles.list}>
            {todos.length === 0 ? (
                <p className={styles.empty}>No Tasks yet</p>
            ) : (
                todos.map((todo) => (
                    <TodoItem
                    key={todo.id}
                    id={todo.id}
                    text={todo.text}
                    completed={todo.completed}
                    />
                ))
            )}
        </div>
    )
}