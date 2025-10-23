import { useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import {
  toggleTodo,
  deleteTodo,
  editTodo,
} from "../../features/todos/todosSlice";
import styles from "./TodoItem.module.css";

interface TodoItemProps {
  id: string;
  text: string;
  completed: boolean;
  onDeleted?: (todo: { id: string; text: string; completed: boolean }) => void;

  tags?: string[];
  onTagClick?: (tag: string) => void;
}

export default function TodoItem({
  id,
  text,
  completed,
  onDeleted,
  tags = [],
  onTagClick,
}: TodoItemProps) {
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(text);
  const [removing, setRemoving] = useState(false);
  const [isFading, setIsFading] = useState(false);

  const handleSave = () => {
    if (newText.trim() !== "") {
      dispatch(editTodo({ id, newText }));
    }
    setIsEditing(false);
  };

  const handleToggle = () => {
    setIsFading(true);
    setTimeout(() => {
      dispatch(toggleTodo(id));
      setIsFading(false);
    }, 180);
  };

  const handleDelete = () => {
    setRemoving(true);
    setTimeout(() => {
      dispatch(deleteTodo(id));
      onDeleted?.({ id, text, completed });
    }, 180);
  };

  return (
    <div
      className={`${styles.item} 
                ${removing ? styles.fadeOut : ""} 
                ${isFading ? styles.fadeOut : styles.fadeIn}`}
    >
      <input type="checkbox" checked={completed} onChange={handleToggle} />

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

      {tags.length > 0 && (
        <div className={styles.tagsRow}>
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              className={styles.tagChip}
              onClick={() => onTagClick?.(tag)}
              title={`#${tag}`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      <button onClick={handleDelete}>x</button>
    </div>
  );
}
