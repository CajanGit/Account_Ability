import { Task } from "./types"; 

export const API_URL = "http://localhost:5000/api/tasks";

export async function getTasks(): Promise<Task[]> {
  const res = await fetch(API_URL);
  return res.json();
}

export async function addTask(title: string): Promise<Task> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  return res.json();
}

export async function updateTask(id: number, data: Partial<Task>): Promise<Task> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteTask(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  return res.json();
}

export async function updateTaskProgress(id: number, progress: number) {
  const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ progress }),
  });

  return res.json();
}
