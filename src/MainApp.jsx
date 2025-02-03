import React, { useState, useEffect } from "react";
import "./MainApp.css";

function Header({ hijriDate, toggleDarkMode }) {
  return (
    <header className="header">
      <h1>Islamic Productivity Suite</h1>
      <p id="hijri-date">Hijri Date: {hijriDate}</p>
      <div className="controls">
        <button onClick={toggleDarkMode}>
          <i className="fas fa-moon"></i> Toggle Dark Mode
        </button>
      </div>
    </header>
  );
}

// TaskForm Component: used to add new tasks
function TaskForm({ onAddTask }) {
  const [text, setText] = useState("");
  const [category, setCategory] = useState("Salah");
  const [priority, setPriority] = useState("low");
  const [dueDate, setDueDate] = useState("");
  const [subtasks, setSubtasks] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const newTask = {
      id: Date.now(),
      text,
      category,
      priority,
      dueDate,
      subtasks: subtasks
        ? subtasks.split(",").map((s) => ({ text: s.trim(), completed: false }))
        : [],
      completed: false,
      createdAt: new Date().toISOString(),
    };
    onAddTask(newTask);
    setText("");
    setDueDate("");
    setSubtasks("");
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="New task"
          required
        />
      </div>
      <div className="form-group">
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="Salah">Salah (Prayer)</option>
          <option value="Quran Reading">Quran Reading</option>
          <option value="Fasting">Fasting</option>
          <option value="Charity">Charity (Sadaqah)</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
        </select>
      </div>
      <div className="form-group">
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <div className="form-group">
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          value={subtasks}
          onChange={(e) => setSubtasks(e.target.value)}
          placeholder="Subtasks (comma separated)"
        />
      </div>
      <button type="submit" className="btn">
        Add Task
      </button>
    </form>
  );
}

// TaskItem Component: displays a single task item
function TaskItem({ task, onToggle, onEdit, onDelete, onToggleSubtask }) {
  const calculateProgress = (task) => {
    if (!task.subtasks || task.subtasks.length === 0)
      return task.completed ? 100 : 0;
    const done = task.subtasks.filter((s) => s.completed).length;
    return Math.round((done / task.subtasks.length) * 100);
  };

  return (
    <div className={`task-item ${task.completed ? "completed" : ""}`}>
      <div className="task-header">
        <div>
          <h3>{task.text}</h3>
          <span className="tag">{task.category}</span>
          {task.dueDate && (
            <span className="due-date">
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
        <div className={`task-priority priority-${task.priority}`}></div>
      </div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${calculateProgress(task)}%` }}
        ></div>
      </div>
      {task.subtasks && task.subtasks.length > 0 && (
        <details className="subtasks">
          <summary>Click to reveal more information</summary>
          {task.subtasks.map((sub, index) => (
            <div className="subtask" key={index}>
              <input
                type="checkbox"
                checked={sub.completed}
                onChange={() => onToggleSubtask(task.id, index)}
              />
              <span>{sub.text}</span>
            </div>
          ))}
        </details>
      )}
      <div className="task-actions">
        <button className="btn" onClick={() => onToggle(task.id)}>
          {task.completed ? "Undo" : "Complete"}
        </button>
        <button className="btn" onClick={() => onEdit(task.id)}>
          Edit
        </button>
        <button
          className="btn"
          style={{ background: "var(--danger)" }}
          onClick={() => onDelete(task.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

// TaskList Component: renders a list of tasks with filters and search
function TaskList({
  tasks,
  searchText,
  filterCategory,
  filterPriority,
  onToggle,
  onEdit,
  onDelete,
  onToggleSubtask,
}) {
  const filtered = tasks.filter((task) => {
    const matchesCategory =
      filterCategory === "all" || task.category === filterCategory;
    const matchesPriority =
      filterPriority === "all" || task.priority === filterPriority;
    const matchesSearch = task.text
      .toLowerCase()
      .includes(searchText.toLowerCase());
    return matchesCategory && matchesPriority && matchesSearch;
  });
  return (
    <div className="task-list">
      {filtered.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleSubtask={onToggleSubtask}
        />
      ))}
    </div>
  );
}

// EditModal Component: modal to edit a task
function EditModal({ task, onSave, onClose }) {
  const [text, setText] = useState(task ? task.text : "");
  const [category, setCategory] = useState(task ? task.category : "Salah");
  const [priority, setPriority] = useState(task ? task.priority : "low");
  const [dueDate, setDueDate] = useState(task ? task.dueDate : "");
  const [subtasks, setSubtasks] = useState(
    task ? task.subtasks.map((s) => s.text).join(", ") : ""
  );

  useEffect(() => {
    if (task) {
      setText(task.text);
      setCategory(task.category);
      setPriority(task.priority);
      setDueDate(task.dueDate);
      setSubtasks(task.subtasks.map((s) => s.text).join(", "));
    }
  }, [task]);

  const handleSave = () => {
    const updatedTask = {
      ...task,
      text,
      category,
      priority,
      dueDate,
      subtasks: subtasks
        ? subtasks.split(",").map((s) => ({ text: s.trim(), completed: false }))
        : [],
    };
    onSave(updatedTask);
  };

  if (!task) return null;

  return (
    <div className="modal" style={{ display: "block" }}>
      <div className="modal-content">
        <span className="modal-close" onClick={onClose}>
          &times;
        </span>
        <h2>Edit Task</h2>
        <div className="form-group">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Task title"
            required
          />
        </div>
        <div className="form-group">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Salah">Salah (Prayer)</option>
            <option value="Quran Reading">Quran Reading</option>
            <option value="Fasting">Fasting</option>
            <option value="Charity">Charity (Sadaqah)</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
          </select>
        </div>
        <div className="form-group">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
        </div>
        <div className="form-group">
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            value={subtasks}
            onChange={(e) => setSubtasks(e.target.value)}
            placeholder="Subtasks (comma separated)"
          />
        </div>
        <button className="btn" onClick={handleSave}>
          Save Changes
        </button>
      </div>
    </div>
  );
}

// Statistics Component
function Statistics({ tasks }) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  return (
    <div className="statistics">
      <h2>Statistics</h2>
      <p>Total Tasks: {total}</p>
      <p>Completed Tasks: {completed}</p>
    </div>
  );
}

// DataManagement Component: handles export and import of tasks
function DataManagement({ tasks, setTasks }) {
  const exportData = () => {
    const dataStr = JSON.stringify(tasks, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tasks.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedTasks = JSON.parse(event.target.result);
        setTasks(importedTasks);
      } catch (err) {
        alert("Invalid file format.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="data-management">
      <button className="btn" onClick={exportData}>
        Export Data
      </button>
      {/* <input type="file" onChange={importData} /> */}
    </div>
  );
}

// DailyInspiration Component: displays a random Quranic verse and inspirational quote
function DailyInspiration() {
  const [quranVerse, setQuranVerse] = useState("Loading Quranic verse...");
  const [dailyQuote, setDailyQuote] = useState("");

  useEffect(() => {
    async function fetchQuranVerse() {
      try {
        const response = await fetch(
          "https://api.alquran.cloud/v1/quran/en.asad"
        );
        const data = await response.json();
        if (data && data.data && data.data.surahs) {
          const surahs = data.data.surahs;
          const ayahs = [];
          surahs.forEach((surah) => {
            if (surah.ayahs && Array.isArray(surah.ayahs)) {
              surah.ayahs.forEach((ayah) => {
                ayahs.push({
                  text: ayah.text,
                  surahName: surah.englishName,
                  numberInSurah: ayah.numberInSurah,
                });
              });
            }
          });
          if (ayahs.length > 0) {
            const randomAyah = ayahs[Math.floor(Math.random() * ayahs.length)];
            setQuranVerse(
              `"${randomAyah.text}" - Quran ${randomAyah.surahName} Ayah ${randomAyah.numberInSurah}`
            );
          } else {
            setQuranVerse("No ayahs found.");
          }
        } else {
          setQuranVerse("No data found.");
        }
      } catch (error) {
        console.error("Error fetching Quran verse:", error);
        setQuranVerse("Error loading verse.");
      }
    }
    fetchQuranVerse();

    const quotes = [
      `"Indeed, with hardship comes ease." (Quran 94:6)`,
      `"So remember Me; I will remember you." (Quran 2:152)`,
      `"And whoever puts their trust in Allah, He will suffice them." (Quran 65:3)`,
    ];
    setDailyQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  return (
    <div className="daily-inspiration">
      <h2>Daily Inspiration</h2>
      <div className="quran-verse">{quranVerse}</div>
      <div id="dailyQuote">{dailyQuote}</div>
    </div>
  );
}

// Main App Component
function MainApp() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [searchText, setSearchText] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [editTask, setEditTask] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  // Save tasks to local storage on changes
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Task actions
  const addTask = (task) => {
    setTasks([...tasks, task]);
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const openEditModal = (id) => {
    const task = tasks.find((t) => t.id === id);
    setEditTask(task);
  };

  const saveEdit = (updatedTask) => {
    setTasks(
      tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
    setEditTask(null);
  };

  const toggleSubtask = (taskId, subIndex) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          const updatedSubtasks = [...task.subtasks];
          updatedSubtasks[subIndex].completed =
            !updatedSubtasks[subIndex].completed;
          return { ...task, subtasks: updatedSubtasks };
        }
        return task;
      })
    );
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Helper function for simulated Hijri date
  const getHijriDate = () => {
    const today = new Date();
    const hijriYear = today.getFullYear() - 580;
    return `${today.getDate()}/${today.getMonth() + 1}/${hijriYear} H`;
  };

  return (
    <div className={`container ${darkMode ? "dark" : ""}`}>
      <Header hijriDate={getHijriDate()} toggleDarkMode={toggleDarkMode} />
      <TaskForm onAddTask={addTask} />

      <div className="filters">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="Salah">Salah</option>
          <option value="Quran Reading">Quran Reading</option>
          <option value="Fasting">Fasting</option>
          <option value="Charity">Charity</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
        </select>
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
        >
          <option value="all">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      <TaskList
        tasks={tasks}
        searchText={searchText}
        filterCategory={filterCategory}
        filterPriority={filterPriority}
        onToggle={toggleTask}
        onEdit={openEditModal}
        onDelete={deleteTask}
        onToggleSubtask={toggleSubtask}
      />

      {editTask && (
        <EditModal
          task={editTask}
          onSave={saveEdit}
          onClose={() => setEditTask(null)}
        />
      )}
      <RightColumn />

      <Statistics tasks={tasks} />
      <DataManagement tasks={tasks} setTasks={setTasks} />
    </div>
  );
}

// --- Dhikr Counter Component ---
function DhikrCounter() {
  const [counts, setCounts] = useState(() => {
    const saved = localStorage.getItem("dhikrCounts");
    return saved ? JSON.parse(saved) : { subhanallah: 0 };
  });

  const updateDhikr = (type) => {
    const newCounts = { ...counts, [type]: (counts[type] || 0) + 1 };
    setCounts(newCounts);
    localStorage.setItem("dhikrCounts", JSON.stringify(newCounts));
  };

  return (
    <div className="dhikr-counter">
      <div className="dhikr-box">
        <h3>SubhanAllah</h3>
        <div className="count">{counts.subhanallah || 0}</div>
        <div className="progress-bar">
          <div
            className="progress"
            style={{
              width: Math.min((counts.subhanallah / 100) * 100, 100) + "%",
            }}
          ></div>
        </div>
        <button onClick={() => updateDhikr("subhanallah")}>+1</button>
      </div>
      {/* Add more dhikr boxes if needed */}
    </div>
  );
}

function PrayerTimes() {
  const [times, setTimes] = useState(null);

  useEffect(() => {
    async function fetchPrayerTimes() {
      try {
        const response = await fetch(
          "http://api.aladhan.com/v1/timingsByCity?city=London&country=UK&method=2"
        );
        const data = await response.json();
        setTimes(data.data.timings);
      } catch (error) {
        console.error("Error fetching prayer times:", error);
      }
    }
    fetchPrayerTimes();
  }, []);

  return (
    <div className="prayer-times">
      <h2>Prayer Times</h2>
      <table id="prayerTimesTable">
        <thead>
          <tr>
            <th>Fajr</th>
            <th>Dhuhr</th>
            <th>Asr</th>
            <th>Maghrib</th>
            <th>Isha</th>
          </tr>
        </thead>
        <tbody>
          {times ? (
            <tr>
              <td>{times.Fajr}</td>
              <td>{times.Dhuhr}</td>
              <td>{times.Asr}</td>
              <td>{times.Maghrib}</td>
              <td>{times.Isha}</td>
            </tr>
          ) : (
            <tr>
              <td colSpan="5">Loading...</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
// --- Right Column Component ---
function RightColumn() {
  return (
    <div className="right-column">
      <PrayerTimes />
      <DhikrCounter />
      <DailyInspiration />
    </div>
  );
}

export default MainApp;
