import { useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { addTodo } from "../../features/todos/todosSlice";

import styles from "./AddTodo.module.css";

export default function AddTodo() {
  const dispatch = useAppDispatch();
  const todos = useAppSelector((s) => s.todos.items);

  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<string>("");

  const extractTags = (text: string): string[] => {
    const re = /#([A-Za-zА-Яа-яЁёІіЇїЄє0-9_-]+)/g;
    const set = new Set<string>();
    let m: RegExpExecArray | null;
    while ((m = re.exec(text))) set.add(m[1].toLowerCase());
    return [...set];
  };

  const allTags = useMemo(() => {
    const s = new Set<string>();
    for (const t of todos) {
      const tags = Array.isArray(t.tags) ? t.tags : extractTags(t.text); // ← без any
      for (const tag of tags) s.add(tag.toLowerCase());
    }
    return [...s].sort();
  }, [todos]);

  const TAG_RE = /(^|\s)#([A-Za-zА-Яа-яЁёІіЇїЄє0-9_-]*)\s?$/;
  const match = text.match(TAG_RE);
  const fragment = (match?.[2] ?? "").toLowerCase();

  const suggestions = useMemo(() => {
    if (!match) return [];
    if (fragment === "") return allTags.slice(0, 6);
    return allTags.filter((t) => t.startsWith(fragment)).slice(0, 6);
  }, [match, fragment, allTags]);

  const onChange = (v: string) => {
    setText(v);
    setOpen(!!v.match(TAG_RE));
  };

  const apply = (tag: string) => {
    if (!match) return;
    const before = text.slice(0, match.index!);
    const sep = match[1];
    const after = text.slice((match.index ?? 0) + match[0].length);
    setText(`${before}${sep}#${tag} ${after}`);
    setOpen(false);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    dispatch(addTodo({ text: value, dueAt: date || null }));
    setText("");
    setDate("");
    setOpen(false);
  };

  return (
    <form onSubmit={onSubmit} className={styles.form} autoComplete="off">
      <div className={styles.inputWrap}>
        <input
          type="text"
          placeholder="Add your task (use #tags)"
          value={text}
          onChange={(e) => onChange(e.target.value)}
          className={styles.input}
        />

        {open && suggestions.length > 0 && (
          <div className={styles.suggestBox}>
            {suggestions.map((tag) => (
              <button
                key={tag}
                type="button"
                className={styles.suggestItem}
                onMouseDown={(ev) => {
                  ev.preventDefault();
                  apply(tag);
                }}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className={styles.dateInput}
        aria-label="Due date"
      />

      <button type="submit" className={styles.button}>
        Add
      </button>
    </form>
  );
}
