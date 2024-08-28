"use client";
import { useState, useEffect } from "react";

export default function TaskList({ initialTasks }) {
  const [tasks, setTasks] = useState(initialTasks);

  // Add more functionality here, like adding/editing/deleting tasks

  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>{task.title}</li>
      ))}
    </ul>
  );
}
