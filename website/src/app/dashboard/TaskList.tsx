"use client";
import { useRef, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Task } from "@/types/Task";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import NewTaskDialog from "./NewTaskDialog";
import TaskItem from "./TaskItem";
import { toast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export const taskCategories = [
  { id: "todo", title: "To Do", color: "bg-red-100 dark:bg-red-900" },
  {
    id: "inprogress",
    title: "In Progress",
    color: "bg-yellow-100 dark:bg-yellow-900",
  },
  { id: "done", title: "Done", color: "bg-green-100 dark:bg-green-900" },
] as const;

type Column = (typeof taskCategories)[number]["id"];

interface TaskListProps {
  initialTasks: Task[];
}

export default function TaskList({ initialTasks }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);
  const { data: session } = useSession();
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [updatingTaskId, setUpdatingTaskId] = useState<number | null>(null);
  const previousTasksRef = useRef<Task[]>(initialTasks);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"title" | "createdAt">("createdAt");
  const filteredAndSortedTasks = tasks
    .filter((task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      } else {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
    });

  const handleAddTask = (newTask: Task) => {
    setTasks([...tasks, newTask]);
  };

  const handleDeleteTask = (taskId: number) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const handleOpenEditDialog = (task: Task) => {
    setTaskToEdit(task);
    setIsNewTaskDialogOpen(true);
  };

  const handleEditTask = (editedTask: Task) => {
    setTasks(
      tasks.map((task) => (task.id === editedTask.id ? editedTask : task))
    );
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const updatedTasks = Array.from(tasks);
    const draggedTask = updatedTasks.find(
      (task) => task.id.toString() === result.draggableId
    );

    if (!draggedTask) return;

    // Store the previous state
    previousTasksRef.current = tasks;

    // Update the task status optimistically
    updatedTasks.splice(updatedTasks.indexOf(draggedTask), 1);
    draggedTask.status = destination.droppableId as Column;
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
    setUpdatingTaskId(draggedTask.id);

    try {
      await updateTaskStatus(draggedTask.id, draggedTask.status);
      // Show success indicator
      setTimeout(() => setUpdatingTaskId(null), 2000);
    } catch (error) {
      // Revert to previous state on error
      setTasks(previousTasksRef.current);
      setUpdatingTaskId(null);
      toast({
        title: "Error",
        description: "Failed to update task status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateTaskStatus = async (taskId: number, newStatus: Column) => {
    if (!session?.user?.token) {
      toast({
        title: "Error",
        description: "You must be logged in to update tasks.",
        variant: "destructive",
      });
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks/${taskId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.user.token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update task status");
      }

      toast({
        title: "Success",
        description: "Task status updated successfully.",
      });
    } catch (error) {
      console.error("Error updating task status:", error);
      toast({
        title: "Error",
        description: "Failed to update task status. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-light">My Tasks</h2>
        <Button onClick={() => setIsNewTaskDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Task
        </Button>
      </div>
      <div className="flex space-x-4 mb-4">
        <Input
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select
          value={sortBy}
          onValueChange={(value: "title" | "createdAt") => setSortBy(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="title">Title</SelectItem>
            <SelectItem value="createdAt">Date Created</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {taskCategories.map((column) => (
            <div
              key={column.id}
              className={`${column.color} shadow-lg rounded-lg p-4`}
            >
              <h2 className="text-lg font-semibold mb-4">{column.title}</h2>
              <Droppable droppableId={column.id}>
                {(provided) => (
                  <ul
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2 min-h-[100px]"
                  >
                    {filteredAndSortedTasks
                      .filter((task) => task.status === column.id)
                      .map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id.toString()}
                          index={index}
                        >
                          {(provided) => (
                            <TaskItem
                              isUpdating={updatingTaskId === task.id}
                              onOpenEditDialog={handleOpenEditDialog}
                              task={task}
                              provided={provided}
                              onEdit={handleEditTask}
                              onDelete={handleDeleteTask}
                            />
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
      <NewTaskDialog
        isOpen={isNewTaskDialogOpen}
        onClose={() => {
          setIsNewTaskDialogOpen(false);
          setTaskToEdit(null);
        }}
        onAddTask={handleAddTask}
        taskToEdit={taskToEdit}
        onEditTask={handleEditTask}
      />
    </>
  );
}
