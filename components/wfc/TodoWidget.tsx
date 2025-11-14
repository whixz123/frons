"use client";

import { useState } from "react";
import Widget from "./Widget";

type TodoWidgetProps = {
  onClose: () => void;
};

type Task = {
  id: string;
  text: string;
  status: "todo" | "inprogress" | "done";
};

export default function TodoWidget({ onClose }: TodoWidgetProps) {
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", text: "Review project proposal", status: "todo" },
    { id: "2", text: "Complete design mockups", status: "inprogress" },
    { id: "3", text: "Send weekly report", status: "done" },
  ]);
  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, {
        id: Date.now().toString(),
        text: newTask,
        status: "todo"
      }]);
      setNewTask("");
    }
  };

  const moveTask = (taskId: string, newStatus: Task["status"]) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const getTasksByStatus = (status: Task["status"]) => {
    return tasks.filter(task => task.status === status);
  };

  const renderTaskList = (status: Task["status"], title: string, bgColor: string) => {
    const statusTasks = getTasksByStatus(status);
    
    return (
      <div className={`${bgColor} rounded-xl p-4`}>
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-bold text-amber-900 flex items-center gap-2">
            <span>📌</span>
            <span>{title}</span>
          </h4>
          <span className="text-sm text-amber-700 font-semibold">{statusTasks.length}</span>
        </div>
        
        <div className="space-y-2 min-h-[100px]">
          {statusTasks.length === 0 ? (
            <div className="text-center text-amber-600 italic text-sm py-4">
              Drop tasks here
            </div>
          ) : (
            statusTasks.map(task => (
              <div
                key={task.id}
                className="bg-white p-3 rounded-lg border border-amber-200 shadow-sm"
                draggable
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-amber-900 flex-1">{task.text}</p>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex gap-1 mt-2">
                  {status !== "todo" && (
                    <button
                      onClick={() => moveTask(task.id, status === "inprogress" ? "todo" : "inprogress")}
                      className="text-xs px-2 py-1 bg-amber-100 hover:bg-amber-200 rounded"
                    >
                      ⬅
                    </button>
                  )}
                  {status !== "done" && (
                    <button
                      onClick={() => moveTask(task.id, status === "todo" ? "inprogress" : "done")}
                      className="text-xs px-2 py-1 bg-amber-100 hover:bg-amber-200 rounded"
                    >
                      ➡
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <Widget 
      title="To-Do List" 
      onClose={onClose}
      defaultPosition={{ x: 500, y: 120 }}
      width="500px"
    >
      <div className="p-6 space-y-4">
        {/* Add Task */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addTask()}
            placeholder="Add a new task"
            className="flex-1 px-4 py-2 bg-white border-2 border-amber-200 rounded-lg focus:border-amber-400 focus:outline-none text-amber-900"
          />
          <button
            onClick={addTask}
            className="px-6 py-2 bg-amber-800 text-white rounded-lg hover:bg-amber-700 transition font-bold"
          >
            +
          </button>
        </div>

        {/* Task Columns */}
        <div className="space-y-4">
          {renderTaskList("todo", "To Do", "bg-amber-50")}
          {renderTaskList("inprogress", "In Progress", "bg-orange-50")}
          {renderTaskList("done", "Done", "bg-green-50")}
        </div>

        {/* Stats */}
        <div className="pt-4 border-t border-amber-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-amber-700">Total Tasks:</span>
            <span className="font-bold text-amber-900">{tasks.length}</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-amber-700">Completed:</span>
            <span className="font-bold text-green-700">{getTasksByStatus("done").length}</span>
          </div>
        </div>
      </div>
    </Widget>
  );
}

