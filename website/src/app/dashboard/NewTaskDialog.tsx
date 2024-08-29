"use client";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";
import { Task } from "@/types/Task";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { taskCategories } from "./TaskList";
import { toast } from "@/components/ui/use-toast";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface NewTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: Task) => void;
  taskToEdit?: Task | null;
  onEditTask?: (task: Task) => void;
}

export default function NewTaskDialog({
  isOpen,
  onClose,
  onAddTask,
  taskToEdit,
  onEditTask,
}: NewTaskDialogProps) {
  const [title, setTitle] = useState(taskToEdit?.title || "");
  const [description, setDescription] = useState(taskToEdit?.description || "");
  const [status, setStatus] = useState<"todo" | "inprogress" | "done">(
    taskToEdit?.status || "todo"
  );
  const [dueDate, setDueDate] = useState<Date | undefined>(
    taskToEdit?.dueDate ? new Date(taskToEdit.dueDate) : undefined
  );

  const { data: session } = useSession();

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description ?? "");
      setStatus(taskToEdit.status);
      setDueDate(taskToEdit.dueDate ? new Date(taskToEdit.dueDate) : undefined);
    }
  }, [taskToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.token) {
      toast({
        title: "Error",
        description: "You must be logged in to perform this action.",
        variant: "destructive",
      });
      return;
    }

    const taskData = {
      title,
      description,
      status: status ?? "todo",
      dueDate: dueDate?.toISOString() ?? null,
    };

    try {
      let res;
      if (taskToEdit) {
        res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks/${taskToEdit.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.user.token}`,
            },
            body: JSON.stringify(taskData),
          }
        );
      } else {
        res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.user.token}`,
          },
          body: JSON.stringify(taskData),
        });
      }

      if (!res.ok) {
        throw new Error(
          taskToEdit ? "Failed to update task" : "Failed to create task"
        );
      }

      const task: Task = await res.json();
      taskToEdit ? onEditTask?.(task) : onAddTask(task);
      onClose();
      setTitle("");
      setDescription("");
      setStatus("todo");
      toast({
        title: "Success",
        description: taskToEdit
          ? "Task updated successfully."
          : "Task created successfully.",
      });
    } catch (error) {
      console.error(
        taskToEdit ? "Error updating task:" : "Error creating task:",
        error
      );
      toast({
        title: "Error",
        description: taskToEdit
          ? "Failed to update task. Please try again."
          : "Failed to create task. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{taskToEdit ? "Edit Task" : "Add New Task"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <Select
              value={status}
              onValueChange={(e) =>
                setStatus(e as "todo" | "inprogress" | "done")
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {taskCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={`w-full justify-start text-left font-normal ${
                    !dueDate && "text-muted-foreground"
                  }`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? (
                    format(dueDate, "PPP")
                  ) : (
                    <span>Pick a due date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Textarea
              placeholder="Task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <DialogFooter className="mt-6">
            <Button type="submit">{taskToEdit ? "Update" : "Add"} Task</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
