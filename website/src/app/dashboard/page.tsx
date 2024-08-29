import { redirect } from "next/navigation";
import UserInfo from "./UserInfo";
import TaskList from "./TaskList";
import { auth } from "@/auth";
import { Task } from "@/types/Task";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

async function getTasks(token: string): Promise<Task[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return res.json();
}

export default async function Dashboard() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/login");
  }

  let tasks: Task[] = [];
  try {
    tasks = await getTasks(session.user?.token);
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
  }

  return (
    <div className="container mx-auto">
      <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin" />}>
        <TaskList initialTasks={tasks} />
      </Suspense>
    </div>
  );
}
