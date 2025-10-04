import { useAppDispatch } from "../../app/hooks";
import { toggleTodo, deleteTodo } from '../../features/todos/todosSlice';
import styles from "./TodoItem.module.css";

interface TodoItemProps {
    id: string;
    text: string;
    completed: boolean;
}

export default function TodoItem({ id, text, completed }: TodoItemProps) {
    const dispatch = useAppDispatch();

    return (
        <div className={styles.item}>
            <input 
            type="checkbox" 
            checked={completed}
            onChange={() => dispatch(toggleTodo(id))}
            />
            <span className={completed ? styles.completed : ""}>{text}</span>
            <button onClick={() => dispatch(deleteTodo(id))}>x</button>
        </div>
    )
}