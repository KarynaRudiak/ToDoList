import { useEffect, useMemo, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import TodoItem from "../TodoItem/TodoItem";
import { addTodo } from "../../features/todos/todosSlice";

import styles from "./TodoList.module.css";

export default function TodoList() {
  const todos = useAppSelector((state) => state.todos.items);
  const dispatch = useAppDispatch();

  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const [lastDeleted, setLastDeleted] = useState<{
    id: string;
    text: string;
    completed: boolean;
  } | null>(null);

  const filteredTodos = useMemo(() => {
    const base = todos.filter((todo) => {
      if (filter === "active") return !todo.completed;
      if (filter === "completed") return todo.completed;
      return true;
    });
    return selectedTag
      ? base.filter((t) => (t.tags ?? []).includes(selectedTag))
      : base;
  }, [todos, filter, selectedTag]);

  const activeCount = todos.reduce((acc, t) => acc + (t.completed ? 0 : 1), 0);
  const completedCount = todos.length - activeCount;

  useEffect(() => {
    if (!lastDeleted) return;
    const timer = setTimeout(() => setLastDeleted(null), 5000);
    return () => clearTimeout(timer);
  }, [lastDeleted]);

  return (
    <div className={styles.container}>
      <div className={styles.filters}>
        <button
          className={`${styles.filterBtn} ${
            filter === "all" ? styles.active : ""
          }`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={`${styles.filterBtn} ${
            filter === "active" ? styles.active : ""
          }`}
          onClick={() => setFilter("active")}
        >
          Active
        </button>
        <button
          className={`${styles.filterBtn} ${
            filter === "completed" ? styles.active : ""
          }`}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
      </div>

      <div className={styles.counter}>
        {activeCount} Active · {completedCount} Completed
      </div>

      {selectedTag && (
        <div className={styles.selectedTag}>
          Filtered by: <strong>#{selectedTag}</strong>
          <button
            className={styles.clearTagBtn}
            onClick={() => setSelectedTag(null)}
          >
            Clear
          </button>
        </div>
      )}

      <div className={styles.list} key={`${filter}-${selectedTag ?? "all"}`}>
        {filteredTodos.length === 0 ? (
          <p className={styles.empty}>No tasks found</p>
        ) : (
          filteredTodos.map((todo, index) => (
            <div
              key={todo.id}
              className={styles.appear}
              style={{ animationDelay: `${index * 40}ms` }}
            >
              <TodoItem
                id={todo.id}
                text={todo.text}
                completed={todo.completed}
                onDeleted={(t) => setLastDeleted(t)}

                tags={todo.tags ?? []}                   
                onTagClick={(tag) => setSelectedTag(tag)}
              />
            </div>
          ))
        )}
      </div>

      {lastDeleted && (
        <div className={styles.undoToast}>
          <span>Task deleted</span>
          <button
            className={styles.undoBtn}
            onClick={() => {
              dispatch(addTodo(lastDeleted.text));
              setLastDeleted(null);
            }}
          >
            Undo
          </button>
        </div>
      )}
    </div>
  );
}
