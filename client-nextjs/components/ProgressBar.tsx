"use client";

import React from "react";
import Link from "next/link";


export function ProgressBar({ progress, onChange }: { progress: number; onChange: (p: number) => void; }){

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