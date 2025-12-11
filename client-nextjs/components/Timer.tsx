"use client";

import React, { useState, useEffect } from "react";

export type TimerProps = {
  initialTime?: number; // Total seconds already spent
  onStop: (elapsedSeconds: number) => void; // Called when user stops timer
};

export function Timer({ initialTime = 0, onStop }: TimerProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // This effect runs whenever isRunning changes
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      // Every second, increment the elapsed time
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }

    // Cleanup: clear the interval when component unmounts or isRunning changes
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  // Format seconds to readable format (e.g., "5m 23s")
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
    // Call the parent's onStop function with how much time elapsed
    onStop(elapsedSeconds);
  };

  const handleReset = () => {
    setIsRunning(false);
    setElapsedSeconds(0);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-gray-50 rounded-lg">
      <div className="text-5xl font-bold font-mono text-blue-600">
        {formatTime(elapsedSeconds)}
      </div>

      <div className="flex gap-3">
        {!isRunning ? (
          <button
            onClick={handleStart}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
          >
            Start
          </button>
        ) : (
          <button
            onClick={handleStop}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
          >
            Stop
          </button>
        )}

        <button
          onClick={handleReset}
          className="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 font-semibold"
        >
          Reset
        </button>
      </div>

      {/* Display total time spent (initial time + any previous sessions) */}
      <div className="text-sm text-gray-600">
        Total time on task: {formatTime(initialTime + elapsedSeconds)}
      </div>
    </div>
  );
}