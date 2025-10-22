import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/api/tasks").then(res => setTasks(res.data));
  }, []);

  const addTask = async () => {
    const res = await axios.post("http://localhost:5000/api/tasks", { title: newTask });
    setTasks([...tasks, res.data]);
    setNewTask("");
  };

  const toggleComplete = async (id, completed) => {
    const res = await axios.put(`http://localhost:5000/api/tasks/${id}`, { completed: !completed, progress: 100 });
    setTasks(tasks.map(t => (t.id === id ? res.data : t)));
  };

  const deleteTask = async id => {
    console.log("Deleting task id:", id);
    await axios.delete(`http://localhost:5000/api/tasks/${id}`);
    setTasks(tasks.filter(t => t.id !== id));
  };

  const updateProgress = async (id, progress) => {
  console.log("Updating Task Progress", id);
  const res = await axios.put(`http://localhost:5000/api/tasks/${id}`, { progress: Number(progress) });
  setTasks(tasks.map(t => (t.id === id ? res.data : t)));
};

  const startTimer = async id => {
    setTasks(tasks.map(task =>
      task.id == id ? { ...task, timerActive: true, startTime: Date.now() }: task
    ));
  };

  const stopTimer = async id => {
    const task = tasks.find(t => t.id == id);
    if (!task.timerActive) return;

    const elapsed = Math.floor((Date.now() - task.startTime) / 1000);
    const updatedTotalTime = (task.totalTime || 0) + elapsed;

    //update backend
    console.log("Updating Task Timer", id);
    try {

      await axios.put(`http://localhost:5000/api/tasks/${id}`, {
      totalTime: updatedTotalTime,
      timerActive: false,
      startTime: null
      });

  setTasks(tasks.map(t => t.id == id
    ? { ...t, totalTime: updatedTotalTime, timerActive: false, startTime: null }: t
  ));
  } catch (error) {
    console.error("Failed to update timer in backend:", error.response?.data || error.message)
  }
    
};

const formatTime = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}h ${m}m ${s}s`;
};


  return (
    <div className="app-container">
      {/* Top Navbar */}
      <nav className="navbar">
        <h2 className="nav-title"> My To-Do App</h2>
      </nav>
    {/* Main Content*/}
    <div className="content">
      <h1 className="header"> To Do List </h1>
      <div className="input-container">
        <input
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          placeholder="Add a task..."
          className="task.input"
        />
        <button onClick={addTask}>Add</button>
      </div>
    </div> 
    {/* Tasks UI */}  
      {<ul>
        {tasks.map(t => (
          <li key={t.id} style={{ marginBottom: "1rem" }}>
            <input
              type="checkbox"
              checked={t.completed}
              onChange={() => toggleComplete(t.id, t.completed)}
            />
          <span style={{ textDecoration: t.completed ? "line-through" : "none" }}>
              {t.title}
          </span>
        <input
          type="number"
          value={t.progress}
          min="0"
          max="100"
          onChange={e => updateProgress(t.id, e.target.value)}
          style={{ width: "60px", marginLeft: "10px" }}
        />%
      <div style={{ background: "#ddd", height: "6px", borderRadius: "3px", marginTop: "4px" }}>
        <div
          style={{
            width: `${t.progress}%`,
            height: "6px",
            background: t.completed ? "green" : "red",
            // borderRadius: "3px",
          }}
        ></div>
      </div>
      <button onClick={() => deleteTask(t.id)}>❌</button>
        
          <div>
        {/* Timer UI */}
              <div style={{ marginTop: "8px" }}>
                {t.timerActive ? (
                  <button
                    onClick={() => stopTimer(t.id)}
                    style={{
                      background: "red",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      padding: "4px 8px",
                      cursor: "pointer",
                    }}
                  >
                    ⏹ Stop
                  </button>
                ) : (
                  <button
                    onClick={() => startTimer(t.id)}
                    style={{
                      background: "green",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      padding: "4px 8px",
                      cursor: "pointer",
                    }}
                  >
                    ▶ Start
                  </button>
                )}
                <span style={{ marginLeft: "10px" }}>
                  Time Spent: {formatTime(t.totalTime || 0)}
              </span>
          </div>
      </div>
        </li>
        ))}
      </ul>}
    </div>
  );
}

export default App;
