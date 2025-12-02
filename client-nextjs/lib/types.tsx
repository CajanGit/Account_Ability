export type Task = {
  id: number;
  title: string;
  completed: boolean;
  progress?: number;
  totalTime?: number;
  timerActive?: boolean;
  startTime?: number | null;
};
