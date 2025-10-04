import { useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import { toggleTodo, deleteTodo, editTodo } from '../../features/todos/todosSlice';
import styles from "./TodoItem.module.css";

interface TodoItemProps {
    id: string;
    text: string;
    completed: boolean;
}

export default function TodoItem({ id, text, completed }: TodoItemProps) {
    const dispatch = useAppDispatch();
    const [isEditing, setIsEditing] = useState(false);
    const [newText, setNewText] = useState(text);

    const handleSave = () => {
        if (newText.trim() !== "") {
            dispatch(editTodo({ id, newText }))
        }

        setIsEditing(false)
    }

    return (
        <div className={`${styles.item} ${isEditing ? styles.editing : ""}`}>
            <input
                type="checkbox"
                checked={completed}
                onChange={() => dispatch(toggleTodo(id))}
            />

            {isEditing ? (
                <input
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    onBlur={handleSave}
                    onKeyDown={(e) => e.key === "Enter" && handleSave()}
                    autoFocus
                    className={styles.editInput}
                />
            ) : (
                <span
                    onDoubleClick={() => setIsEditing(true)}
                    className={completed ? styles.completed : ""}
                    
                >
                    {text}
                </span>
            )}
            
            <button onClick={() => dispatch(deleteTodo(id))}>x</button>
        </div>
    )
}