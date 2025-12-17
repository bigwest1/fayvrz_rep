"use client";

type Props = {
  current: "TODO" | "DOING" | "DONE";
  taskId: string;
  action: (formData: FormData) => void | Promise<void>;
};

const options: ("TODO" | "DOING" | "DONE")[] = ["TODO", "DOING", "DONE"];

export function TaskStatusToggle({ current, taskId, action }: Props) {
  return (
    <div className="flex gap-2">
      {options.map((opt) => (
        <form key={opt} action={action}>
          <input type="hidden" name="taskId" value={taskId} />
          <input type="hidden" name="status" value={opt} />
          <button
            type="submit"
            className={[
              "rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
              current === opt
                ? "border-[color:var(--color-text)] bg-[color:var(--color-text)] text-[color:var(--color-surface)]"
                : "border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-[color:var(--color-text)] hover:border-[color:var(--color-border-strong)]",
            ].join(" ")}
          >
            {opt.toLowerCase()}
          </button>
        </form>
      ))}
    </div>
  );
}
