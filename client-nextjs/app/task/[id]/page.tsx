"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getTasks, updateTask, deleteTask, updateTaskProgress } from "../../../lib/api";
import { Task } from "../../../lib/types";
import { ProgressBar } from "../../../components/ProgressBar";
import { Timer } from "../../../components/Timer";

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTask() {
      const tasks = await getTasks();
      const foundTask = tasks.find(t => t.id === id);
      setTask(foundTask || null);
      setIsLoading(false);
    }
    loadTask();
  }, [id]);

  const handleToggleComplete = async () => {
    if (!task) return;
    const updated = await updateTask(task.id, {
      completed: !task.completed,
      progress: !task.completed ? 100 : 0
    });
    setTask(updated);
  };

  const handleDelete = async () => {
    if (!task) return;
    await deleteTask(task.id);
    router.push("/"); // Navigate back to home
  };

  const handleProgressUpdate = async (newProgress: number) => {
    if (!task) return; 
    await updateTaskProgress(task.id, newProgress);

    setTask({ ...task, progress:newProgress});
  };

  const handleTimerStop = async (elapsedSeconds: number) => {
    if (!task) return;
    const newTotalTime = (task.totalTime || 0) + elapsedSeconds;
    const updated = await updateTask(task.id, {totalTime: newTotalTime});
    setTask(updated)
  };

  if (isLoading) return <div className="text-center py-10">Loading...</div>;
  if (!task) return <div className="text-center py-10">Task not found</div>;

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <button
        onClick={() => router.back()}
        className="mb-6 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
      >
        ← Back
      </button>

      <div className="bg-black rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6">{task.title}</h1>
        
        <div className="space-y-6 mb-8">
          <div>
            <p className="text-gray-600 text-sm">Status</p>
            <p className="text-lg font-semibold">
              {task.completed ? "✅ Completed" : "⏳ In Progress"}
            </p>
          </div>

          <div>
            <p className="text-gray-600 text-sm">Progress</p>
            <p className="text-lg font-semibold">{task.progress || 0}%</p>
            <ProgressBar 
                    progress = {task.progress ?? 0} 
                    onChange = {handleProgressUpdate} />
          </div>

          <div>
            <p className="text-gray-600 text-sm">Total Time Spent</p>
            <p className="text-lg font-semibold">{task.totalTime || 0} seconds</p>
          </div>

          {/* PLACEHOLDER FOR TIMER - You'll add this here */}
          <div className="border-t pt-6">
            <p className="text-gray-600 text-sm mb-4">Session Timer</p>
            <Timer initialTime={task.totalTime || 0} onStop={handleTimerStop} />
          </div>

          {/* PLACEHOLDER FOR NOTES - You'll add this here */}
          <div className="border-t pt-6">
            <p className="text-gray-600 text-sm mb-4">Notes</p>
            <p className="text-gray-400 italic">Note-taking system coming soon...</p>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleToggleComplete}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            {task.completed ? "Mark Incomplete" : "Mark Complete"}
          </button>

          <button
            onClick={handleDelete}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Delete Task
          </button>
        </div>
      </div>
    </div>
  );
}