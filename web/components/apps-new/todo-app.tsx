import { useState, useEffect } from "react";
import { Plus, Trash2, CheckCircle2, Circle } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

const STORAGE_KEY = "frons-todos";

export function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return [];
        }
      }
    }
    return [];
  });
  const [newTodo, setNewTodo] = useState("");

  // Save to localStorage whenever todos change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    }
  }, [todos]);

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([
        ...todos,
        { id: Date.now().toString(), text: newTodo, completed: false },
      ]);
      setNewTodo("");
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div className="p-6 h-full flex flex-col bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl text-gray-800 mb-2">Tasks</h2>
        <div className="text-sm text-gray-600">
          {completedCount} of {todos.length} completed
        </div>
      </div>

      {/* Add Todo */}
      <div className="flex gap-2 mb-6">
        <Input
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && addTodo()}
          placeholder="Add a new task..."
          className="flex-1 bg-white border-blue-200 focus:border-blue-400"
        />
        <Button
          onClick={addTodo}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>

      {/* Todo List */}
      <div className="flex-1 overflow-auto space-y-2">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-100 hover:border-blue-300 transition-colors group"
          >
            <button
              onClick={() => toggleTodo(todo.id)}
              className="flex-shrink-0"
            >
              {todo.completed ? (
                <CheckCircle2 className="w-5 h-5 text-blue-500" />
              ) : (
                <Circle className="w-5 h-5 text-gray-400 group-hover:text-blue-400" />
              )}
            </button>
            <span
              className={`flex-1 ${
                todo.completed
                  ? "text-gray-500 line-through"
                  : "text-gray-800"
              }`}
            >
              {todo.text}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-4 h-4 text-red-500 hover:text-red-600" />
            </button>
          </div>
        ))}
      </div>

      {todos.length === 0 && (
        <div className="flex-1 flex items-center justify-center text-gray-400">
          No tasks yet. Add one to get started!
        </div>
      )}
    </div>
  );
}
