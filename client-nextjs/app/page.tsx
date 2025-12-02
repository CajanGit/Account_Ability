"use client";

import { useEffect, useState } from "react";
import { getTasks, addTask, updateTask, deleteTask } from "../lib/api"
import TaskItem, { Task } from "../components/TaskItem";
import { updateTaskProgress } from "../lib/api";

export default function Home() {
  const [tasks,  setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");

  // Loads tasks on page load
  useEffect(() => {
    load();
  }, []);

  async function load() {
    const data = await getTasks();
    setTasks(data);
  }

  async function handleAdd() {
    if (!input.trim()) return;
    await addTask(input);
    setInput("");
    load();
  }

  async function toggleComplete(task: Task) {
    const isCompleted = !task.completed;
    const newProgress = isCompleted ? 100 : 0;
    await updateTask(task.id, { completed: isCompleted, progress: newProgress });
    load();
  }

  async function handleDelete(id: number) {
    await deleteTask(id);
    load();
  }

  async function handleProgressUpdate(id: number, progress: number) {
  await updateTaskProgress(id, progress);
  load(); // refresh tasks from server
}

  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-4xl font-bold mb-6 text-center">Task Manager</h1>

      <div className="flex gap-2 mb-6">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg"
          placeholder="Add a new task..."
        />
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Add
        </button>
      </div>

      <ul className="space-y-4">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggleComplete={toggleComplete}
            onDelete={handleDelete}
            onUpdateProgress={handleProgressUpdate}
          />
        ))}
      </ul>
    </div>
  );
}
