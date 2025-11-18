import express from "express";
import cors from "cors";
import pkg from '@prisma/client';

const { PrismaClient } = pkg;
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

let tasks = [];

app.get("/api/tasks", async (req, res) => {
    const tasks = await prisma.task.findMany();  
    res.json(tasks);
});

// app.post("/api/tasks", async (req,res) => {
//   const task = {
//     id: Date.now(),
//     title: req.body.title,
//     completed: false,
//     progress: req.body.progress || 0,
//     totalTime: 0
//   };
//   tasks.push(task);
//   res.status(201).json(task);
// })

app.post("/api/tasks", async (req, res) => {
  const task = await prisma.task.create({
    data: { 
      title: req.body.title,
      completed: false,
      progress: req.body.progress || 0,
      totalTime: 0,
     },
  });
  res.status(201).json(task);
});

app.put("/api/tasks/:id", async (req, res) =>{
    // const task = { id: Date.now(), title: req.body.title, completed: false, totalTime};

    const id = parseInt(req.params.id);

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title: req.body.title,
        completed: req.body.completed,
        progress: req.body.progress,
        totalTime: req.body.totalTime,
        timerActive: req.body.timerActive,
        startTime: req.body.startTime
      },
    });

    res.json(updatedTask);

    // tasks.push(task);
});

// app.put("/api/tasks/:id", async (req, res) => {
//   const id = parseInt(req.params.id);
//   const index = tasks.findIndex(t => t.id === id);
//   if (index !== -1) {
//     tasks[index] = { ...tasks[index], ...req.body };
//     res.json(tasks[index]);
//   } else res.status(404).send("Task not found");
// });

// app.delete("/api/tasks/:id", (req, res) => {
//   const id = parseInt(req.params.id);
//   tasks = tasks.filter(t => t.id !== id);
//   res.status(204).send();
// });

app.delete("/api/tasks/:id", async (req, res) => {
  await prisma.task.delete({ where: { id: parseInt(req.params.id) } });
  res.json({ message: "Task deleted" });
});

app.listen(5000, () => console.log("✅ Server running on http://localhost:5000/api/tasks"));