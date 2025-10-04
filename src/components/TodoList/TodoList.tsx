import { useState } from "react";
import { useAppSelector } from "../../app/hooks";
import TodoItem from "../TodoItem/TodoItem";
import styles from "./TodoList.module.css";

export default function TodoList() {
  const todos = useAppSelector((state) => state.todos.items);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  return (
    <div className={styles.container}>
      <div className={styles.filters}>
        <button
          className={filter === "all" ? styles.active : ""}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={filter === "active" ? styles.active : ""}
          onClick={() => setFilter("active")}
        >
          Active
        </button>
        <button
          className={filter === "completed" ? styles.active : ""}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
      </div>

      <div className={styles.list} key={filter}>
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
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
