"use client";

import React from "react";

export type Props = {
  task: Task;
  onToggleComplete: (task: Task) => void;
  onDelete: (id: number) => void;
  onUpdateProgress: (id: number, progress: number) => void;
};

export type Task = {
    id: number;
    title: string;
    completed: boolean;
    progress?: number;
    totalTime?: number;
    timerActive?: boolean;
    startTime?: number | null;
}

function ProgressBar({ progress, onChange }: { progress: number; onChange: (p: number) => void; }){

  const barColor = progress === 100 ? "bg-green-500" : "bg-blue-500";

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.round((x / rect.width) * 100);

    onChange(Math.max(0, Math.min(100, percentage)));

  }

  return (
    <div className="w-full bg-gray-300 rounded-full h-4 overflow-hidden" onClick={handleClick}>
      <div
        className={`${barColor} h-4 rounded-full transition-all duration-300`} style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
}

export default function TaskItem({ task, onToggleComplete, onDelete, onUpdateProgress }: Props) {
  return (
    <li className="flex flex-col gap-2 px-4 py-3 bg-gray-100 rounded-lg">
      <div className="flex justify-between items-center">
        <span className={task.completed ? "line-through text-gray-500" : "text-gray-900"}>
          {task.title} - {task.progress} %
        </span>

        <div className="flex gap-2">
          <button
            onClick={() => onToggleComplete(task)}
            className="px-3 py-1 bg-green-600 text-white rounded-lg"
          >
            {task.completed ? "Undo" : "Complete"}
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="px-3 py-1 bg-red-600 text-white rounded-lg"
          >
            Delete
          </button>
        </div>
      </div>

      {/*Interactive Progress bar */}
      <ProgressBar 
        progress = {task.progress ?? 0} 
        onChange = {(newPercent) => onUpdateProgress(task.id, newPercent)} />
    </li>
  );
}