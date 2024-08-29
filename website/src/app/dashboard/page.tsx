import { redirect } from "next/navigation";
import UserInfo from "./UserInfo";
import TaskList from "./TaskList";
import { auth } from "@/auth";
import { Task } from "@/types/Task";

async function getTasks(token: string): Promise<Task[]> {
  const res = await fetch("http://127.0.0.1:3000/api/tasks", {
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

  const tasks = await getTasks(session.user?.token);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Task Board</h1>
        <UserInfo email={session.user.email} />
      </div>
      <TaskList initialTasks={tasks} />
    </div>
  );
}
