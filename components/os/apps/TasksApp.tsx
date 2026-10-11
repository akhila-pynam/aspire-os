"use client";

import React, { useState } from "react";
import { CheckSquare, Square, Plus, Trash2, Calendar, Flag, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useOSStore } from "@/lib/store/useOSStore";
import { TaskItem } from "../types";

export function TasksApp() {
  const { tasks, addTask, toggleTask, deleteTask } = useOSStore();
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<TaskItem["category"]>("Security");
  const [selectedPriority, setSelectedPriority] = useState<TaskItem["priority"]>("High");

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent = Math.round((completedCount / Math.max(1, tasks.length)) * 100) || 0;

  const handleCreateTask = () => {
    if (!newTaskTitle.trim()) return;
    addTask({
      title: newTaskTitle.trim(),
      category: selectedCategory,
      priority: selectedPriority,
      completed: false,
    });
    setNewTaskTitle("");
  };

  return (
    <div className="h-full w-full flex flex-col bg-zinc-950 text-zinc-100 overflow-y-auto select-none p-5">
      {/* Header & Progress */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-zinc-800 gap-3">
        <div>
          <h2 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
            Aspire Task Matrix & Sprint Planner
            <Badge variant="outline" className="border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-[10px]">
              Zustand Persisted
            </Badge>
          </h2>
          <p className="text-[11px] text-zinc-400">
            {completedCount} of {tasks.length} objectives accomplished ({progressPercent}%) • Auto-saved across browser sessions
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-48">
          <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Add Task Input */}
      <div className="my-4 p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/80 flex flex-wrap items-center gap-2">
        <Input
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreateTask()}
          placeholder="Add new engineering objective or security action..."
          className="flex-1 min-w-[200px] h-8 text-xs bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-500"
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value as any)}
          className="h-8 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-300 px-2 outline-none"
        >
          <option value="Security">Security</option>
          <option value="AI Pipeline">AI Pipeline</option>
          <option value="Architecture">Architecture</option>
          <option value="Frontend">Frontend</option>
        </select>

        <select
          value={selectedPriority}
          onChange={(e) => setSelectedPriority(e.target.value as any)}
          className="h-8 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-300 px-2 outline-none"
        >
          <option value="Urgent">Urgent</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
        </select>

        <Button
          size="xs"
          onClick={handleCreateTask}
          className="bg-violet-600 hover:bg-violet-500 text-white gap-1 text-[11px]"
        >
          <Plus className="size-3" /> Add Objective
        </Button>
      </div>

      {/* Task List */}
      <div className="space-y-2 flex-1">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
              task.completed
                ? "bg-zinc-900/20 border-zinc-900 text-zinc-500"
                : "bg-zinc-900/60 border-zinc-800/80 hover:border-zinc-700/80 text-zinc-200"
            }`}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0 pr-4">
              <button
                onClick={() => toggleTask(task.id)}
                className="text-violet-400 hover:text-violet-300 transition-colors"
              >
                {task.completed ? (
                  <CheckSquare className="size-4 text-emerald-400" />
                ) : (
                  <Square className="size-4 text-zinc-600 hover:text-zinc-400" />
                )}
              </button>
              <span
                className={`text-xs truncate ${
                  task.completed ? "line-through text-zinc-500" : "font-medium text-zinc-200"
                }`}
              >
                {task.title}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Badge
                variant="outline"
                className={`text-[10px] ${
                  task.priority === "Urgent"
                    ? "border-rose-500/30 text-rose-300 bg-rose-950/20"
                    : task.priority === "High"
                    ? "border-amber-500/30 text-amber-300 bg-amber-950/20"
                    : "border-blue-500/30 text-blue-300 bg-blue-950/20"
                }`}
              >
                {task.priority}
              </Badge>
              <span className="text-[10px] text-zinc-500 font-mono hidden sm:inline">
                {task.category}
              </span>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-zinc-600 hover:text-rose-400 p-1 transition-colors"
                title="Delete task"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
