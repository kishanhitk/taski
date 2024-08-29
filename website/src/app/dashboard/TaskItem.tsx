"use client";
import { useState } from "react";
import { Task } from "@/types/Task";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Pencil, Trash2, Info } from "lucide-react";
import { useSession } from "next-auth/react";

interface TaskItemProps {
  task: Task;
  provided: any;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
}

export default function TaskItem({
  task,
  provided,
  onEdit,
  onDelete,
}: TaskItemProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { data: session } = useSession();

  const handleDelete = async () => {
    if (!session?.user?.token) return;

    try {
      const res = await fetch(`http://127.0.0.1:3000/api/tasks/${task.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.user.token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete task");

      onDelete(task.id);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <>
      <li
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className="bg-white/20 p-2 rounded shadow flex items-center justify-between"
      >
        <span>{task.title}</span>
        <div className="space-x-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsDetailsOpen(true)}
          >
            <Info className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              /* Implement edit functionality */
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </li>
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{task.title}</DialogTitle>
          </DialogHeader>
          <p>{task.description}</p>
        </DialogContent>
      </Dialog>
    </>
  );
}
