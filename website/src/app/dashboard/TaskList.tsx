"use client";
import { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Task } from "@/types/Task";
import { useSession } from "next-auth/react";

const columns = [
  { id: "todo", title: "To Do" },
  { id: "inprogress", title: "In Progress" },
  { id: "done", title: "Done" },
] as const;

type Column = (typeof columns)[number]["id"];

interface TaskListProps {
  initialTasks: Task[];
}

export default function TaskList({ initialTasks }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const { data: session } = useSession();

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const updatedTasks = Array.from(tasks);

    const draggedTask = updatedTasks.find(
      (task) => task.id.toString() === result.draggableId
    );

    if (!draggedTask) return;

    updatedTasks.splice(updatedTasks.indexOf(draggedTask), 1);

    draggedTask.status = destination.droppableId as Column;

    updateTaskStatus(draggedTask.id, draggedTask.status);

    const destinationTasks = updatedTasks.filter(
      (task) => task.status === destination.droppableId
    );
    const insertIndex = updatedTasks.indexOf(
      destinationTasks[destination.index] || null
    );

    updatedTasks.splice(
      insertIndex !== -1 ? insertIndex : updatedTasks.length,
      0,
      draggedTask
    );

    setTasks(updatedTasks);
  };

  const updateTaskStatus = async (taskId: number, newStatus: Column) => {
    if (!session?.user?.token) return;

    try {
      const res = await fetch(`http://127.0.0.1:3000/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error("Failed to update task status");
      }
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex space-x-4">
        {columns.map((column) => (
          <div key={column.id} className="bg-white/10 p-4 rounded-lg w-1/3">
            <h2 className="text-lg font-semibold mb-4">{column.title}</h2>
            <Droppable droppableId={column.id}>
              {(provided) => (
                <ul
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2 min-h-[100px]"
                >
                  {tasks
                    .filter((task) => task.status === column.id)
                    .map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-white/20 p-2 rounded shadow"
                          >
                            {task.title}
                          </li>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
