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
import { toast } from "@/components/ui/use-toast";

interface TaskItemProps {
  task: Task;
  provided: any;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
  onOpenEditDialog: (task: Task) => void;
}

export default function TaskItem({
  task,
  provided,
  onEdit,
  onDelete,
  onOpenEditDialog,
}: TaskItemProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { data: session } = useSession();

  const handleDelete = async () => {
    if (!session?.user?.token) {
      toast({
        title: "Error",
        description: "You must be logged in to delete tasks.",
        variant: "destructive",
      });
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks/${task.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${session.user.token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to delete task");

      onDelete(task.id);
      toast({
        title: "Success",
        description: "Task deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting task:", error);
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <li
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow-md flex items-center justify-between transition-all hover:shadow-lg"
      >
        <span className="font-medium truncate">{task.title}</span>
        <div className="flex space-x-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsDetailsOpen(true)}
          >
            <Info className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onOpenEditDialog(task)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </li>
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{task.title}</DialogTitle>
          </DialogHeader>
          <p className="mt-2">
            {task.description || "No description provided."}
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}
