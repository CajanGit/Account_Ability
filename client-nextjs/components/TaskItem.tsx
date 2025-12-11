"use client";

import React from "react";
import Link from "next/link";
import { ProgressBar } from "./ProgressBar"

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

export default function TaskItem({ task, onToggleComplete, onDelete, onUpdateProgress }: Props) {
  return (
    <li className="flex flex-col gap-2 px-4 py-3 bg-gray-100 rounded-lg">
      <div className="flex justify-between items-center">
        <Link href={`/task/${task.id}`} className="flex-1 hover:text-blue-600 cursor-pointer">
          <span className={task.completed ? "line-through text-gray-500" : "text-gray-900"}>
            {task.title} - {task.progress} %
          </span>
        </Link>

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