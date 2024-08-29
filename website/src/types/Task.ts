export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: "todo" | "inprogress" | "done";
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  dueDate: Date | null;
}
