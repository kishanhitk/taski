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
import { Pencil, Trash2, Info, Check, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "@/components/ui/use-toast";
import { formatDistance } from "date-fns";

interface TaskItemProps {
  task: Task;
  provided: any;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
  onOpenEditDialog: (task: Task) => void;
  isUpdating: boolean;
}

export default function TaskItem({
  task,
  provided,
  onEdit,
  onDelete,
  onOpenEditDialog,
  isUpdating,
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
        className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow-md flex items-center justify-between transition-all hover:shadow-lg relative"
      >
        <div>
          <p className="font-medium truncate">{task.title}</p>
          {task.dueDate ? (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Due in{" "}
              {formatDistance(new Date(task.dueDate), new Date(), {
                addSuffix: true,
              })}
            </p>
          ) : null}
        </div>
        <div className="flex space-x-1">
          {isUpdating ? (
            <div className="absolute inset-0 bg-black bg-opacity-[0.03] flex items-center justify-center rounded-lg">
              <Loader2 className="h-6 w-6 animate-spin text-black/10" />
            </div>
          ) : null}

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
