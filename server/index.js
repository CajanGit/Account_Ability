import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

let tasks = [];

app.get("/api/tasks", (req, res) => {
    res.json(tasks);
});

app.post("/api/tasks", (req,res) => {
  const task = {
    id: Date.now(),
    title: req.body.title,
    completed: false,
    progress: req.body.progress || 0,
    totalTime: 0
  };
  tasks.push(task);
  res.status(201).json(task);
})

app.put("/api/tasks", (req, res) =>{
    const task = { id: Date.now(), title: req.body.title, completed: false, totalTime};
    tasks.push(task);
    res.status(201).json(task);
});

app.put("/api/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = tasks.findIndex(t => t.id === id);
  if (index !== -1) {
    tasks[index] = { ...tasks[index], ...req.body };
    res.json(tasks[index]);
  } else res.status(404).send("Task not found");
});

app.delete("/api/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  tasks = tasks.filter(t => t.id !== id);
  res.status(204).send();
});

app.listen(5000, () => console.log("✅ Server running on http://localhost:5000"));