import { useRef, useState, useEffect } from "react";
import { useAppDispatch } from "../../app/hooks";
import {
  toggleTodo,
  deleteTodo,
  editTodo,
  setDueDate,
} from "../../features/todos/todosSlice";
import { EditIcon, TrashIcon } from "../Icons/Icons";
import styles from "./TodoItem.module.css";

interface TodoItemProps {
  id: string;
  text: string;
  completed: boolean;
  onDeleted?: (todo: { id: string; text: string; completed: boolean }) => void;

  tags?: string[];
  onTagClick?: (tag: string) => void;

  pinned?: boolean;
  onTogglePin?: () => void;

  dueAt?: string | null;
}

function getDueStatus(dueAt: string | null) {
  if (!dueAt) return { label: "", className: "neutral", title: "" };
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(dueAt + "T00:00:00");
  const diffDays = Math.round((d.getTime() - today.getTime()) / 86400000);

  if (diffDays < 0)
    return {
      label: "Overdue",
      className: "overdue",
      title: `Was ${Math.abs(diffDays)}d ago`,
    };
  if (diffDays === 0)
    return { label: "Today", className: "today", title: "Due today" };
  if (diffDays === 1)
    return { label: "Tomorrow", className: "soon", title: "Due tomorrow" };
  return {
    label: `In ${diffDays}d`,
    className: "soon",
    title: `Due in ${diffDays} days`,
  };
}

export default function TodoItem({
  id,
  text,
  completed,
  onDeleted,
  tags = [],
  onTagClick,
  pinned = false,
  onTogglePin,
  dueAt = null,
}: TodoItemProps) {
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(text);
  const [removing, setRemoving] = useState(false);
  const [isFading, setIsFading] = useState(false);

  const dateRef = useRef<HTMLInputElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const status = getDueStatus(dueAt);

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

  const openDatePicker = () => {
    const el = dateRef.current;
    if (!el) return;
    setPickerOpen(true);
    el.focus();
    el.showPicker?.();
  };

  useEffect(() => {
    if (!pickerOpen) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        dateRef.current?.blur();
        setPickerOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        dateRef.current?.blur();
        setPickerOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [pickerOpen]);

  const onDateChange = (value: string) => {
    dispatch(setDueDate({ id, dueAt: value || null }));
    setPickerOpen(false);
  };

  return (
    <div
      ref={rootRef}
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

      <div className={styles.rightSide}>
        {dueAt && (
          <button
            type="button"
            className={`${styles.dueBadge} ${styles[status.className]}`}
            title={status.title}
            onClick={openDatePicker}
          >
            {status.label}
          </button>
        )}

        <button
          type="button"
          className={styles.iconBtn}
          title={dueAt ? "Change date" : "Set date"}
          onMouseDown={(e) => e.preventDefault()}
          onClick={openDatePicker}
          aria-label="Set date"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ display: "block" }}
          >
            <rect x="3.5" y="4.5" width="17" height="16" rx="2.5" />
            <path d="M7 3.5v3M17 3.5v3M3.5 9.5h17" />
            <circle cx="8.5" cy="13" r="0.9" />
            <circle cx="12" cy="13" r="0.9" />
            <circle cx="15.5" cy="13" r="0.9" />
            <circle cx="8.5" cy="16.5" r="0.9" />
            <circle cx="12" cy="16.5" r="0.9" />
            <circle cx="15.5" cy="16.5" r="0.9" />
          </svg>
        </button>

        <input
          ref={dateRef}
          type="date"
          value={dueAt ?? ""}
          onChange={(e) => onDateChange(e.target.value)}
          onBlur={() => setPickerOpen(false)}
          className={styles.hiddenDate}
          aria-label="Due date"
        />

        <button
          type="button"
          onClick={onTogglePin}
          className={`${styles.iconBtn} ${pinned ? styles.pinned : ""}`}
          aria-label={pinned ? "Unpin task" : "Pin task"}
          title={pinned ? "Unpin" : "Pin"}
        >
          {pinned ? "★" : "☆"}
        </button>

        <button onClick={handleDelete} className={styles.iconBtn} title="Delete">
          <TrashIcon/>
        </button>
      </div>
    </div>
  );
}
