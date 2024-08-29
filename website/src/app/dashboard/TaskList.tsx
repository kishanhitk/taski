"use client";
import { useState } from "react";

const columns = [
  { id: "todo", title: "To Do" },
  { id: "inprogress", title: "In Progress" },
  { id: "done", title: "Done" },
];

export default function TaskList({ initialTasks }) {
  const [tasks, setTasks] = useState(initialTasks);

  return (
    <div className="flex space-x-4">
      {columns.map((column) => (
        <div key={column.id} className="bg-white/10 p-4 rounded-lg w-1/3">
          <h2 className="text-lg font-semibold mb-4">{column.title}</h2>
          <ul className="space-y-2 min-h-[100px]">
            {tasks
              .filter((task) => task.status === column.id)
              .map((task) => (
                <li key={task.id} className="bg-white/20 p-2 rounded shadow">
                  {task.title}
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
