"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Zap,
  Activity,
  Terminal,
  Folder,
  CheckSquare,
  SlidersHorizontal,
  Trash2,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { AppId, AppDefinition } from "./types";

interface DockProps {
  apps: AppDefinition[];
  openApps: AppId[];
  activeApp: AppId | null;
  onAppClick: (id: AppId) => void;
}

const getAppIcon = (id: AppId) => {
  switch (id) {
    case "flow":
      return <Zap className="size-6 text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" />;
    case "telemetry":
      return <Activity className="size-6 text-emerald-300 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]" />;
    case "copilot":
      return <Terminal className="size-6 text-violet-300 drop-shadow-[0_0_8px_rgba(167,139,250,0.6)]" />;
    case "files":
      return <Folder className="size-6 text-blue-300 drop-shadow-[0_0_8px_rgba(96,165,250,0.6)]" />;
    case "tasks":
      return <CheckSquare className="size-6 text-indigo-300 drop-shadow-[0_0_8px_rgba(129,140,248,0.6)]" />;
    case "settings":
      return <SlidersHorizontal className="size-6 text-pink-300 drop-shadow-[0_0_8px_rgba(244,114,182,0.6)]" />;
    case "shield":
      return <ShieldCheck className="size-6 text-emerald-300 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]" />;
  }
};

const getAppGradient = (id: AppId) => {
  switch (id) {
    case "flow":
      return "from-amber-600/30 to-amber-950/60 border-amber-500/40";
    case "telemetry":
      return "from-emerald-600/30 to-emerald-950/60 border-emerald-500/40";
    case "copilot":
      return "from-violet-600/30 to-violet-950/60 border-violet-500/40";
    case "files":
      return "from-blue-600/30 to-blue-950/60 border-blue-500/40";
    case "tasks":
      return "from-indigo-600/30 to-indigo-950/60 border-indigo-500/40";
    case "settings":
      return "from-pink-600/30 to-pink-950/60 border-pink-500/40";
    case "shield":
      return "from-emerald-600/30 to-emerald-950/60 border-emerald-500/40";
  }
};

export function Dock({ apps, openApps, activeApp, onAppClick }: DockProps) {
  const [hoveredApp, setHoveredApp] = useState<string | null>(null);
  const [trashCleared, setTrashCleared] = useState(false);

  const handleClearTrash = () => {
    setTrashCleared(true);
    setTimeout(() => setTrashCleared(false), 2000);
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 select-none">
      <div className="flex items-center gap-2 px-3 py-2.5 rounded-2xl bg-zinc-950/60 border border-zinc-700/50 backdrop-blur-2xl shadow-2xl shadow-black/80 ring-1 ring-white/10">
        {apps.map((app) => {
          const isOpen = openApps.includes(app.id);
          const isActive = activeApp === app.id;
          const isHovered = hoveredApp === app.id;

          return (
            <div key={app.id} className="relative flex flex-col items-center">
              {/* Tooltip */}
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -top-10 px-2.5 py-1 rounded-lg bg-zinc-900/90 border border-zinc-700/80 text-[11px] font-medium text-zinc-100 whitespace-nowrap shadow-xl backdrop-blur-md pointer-events-none"
                >
                  {app.title}
                </motion.div>
              )}

              {/* Icon Button */}
              <motion.button
                whileHover={{ scale: 1.22, y: -4 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                onMouseEnter={() => setHoveredApp(app.id)}
                onMouseLeave={() => setHoveredApp(null)}
                onClick={() => onAppClick(app.id)}
                className={`size-12 rounded-xl flex items-center justify-center bg-gradient-to-b ${getAppGradient(
                  app.id
                )} border transition-all shadow-lg backdrop-blur-md relative overflow-hidden`}
              >
                {getAppIcon(app.id)}
                {app.badge && (
                  <span className="absolute top-1 right-1 size-2 rounded-full bg-violet-400 animate-ping" />
                )}
              </motion.button>

              {/* Active / Open Dot indicator */}
              <div className="h-1.5 flex items-center justify-center mt-1">
                {isOpen && (
                  <span
                    className={`size-1 rounded-full transition-all ${
                      isActive ? "bg-white shadow-[0_0_6px_#fff]" : "bg-zinc-500"
                    }`}
                  />
                )}
              </div>
            </div>
          );
        })}

        {/* Divider */}
        <div className="h-8 w-[1px] bg-zinc-800/80 mx-1" />

        {/* Trash */}
        <div className="relative flex flex-col items-center">
          {hoveredApp === "trash" && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute -top-10 px-2.5 py-1 rounded-lg bg-zinc-900/90 border border-zinc-700/80 text-[11px] font-medium text-zinc-100 whitespace-nowrap shadow-xl backdrop-blur-md pointer-events-none"
            >
              {trashCleared ? "Trash Emptied!" : "Trash Bin"}
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.18, y: -3 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={() => setHoveredApp("trash")}
            onMouseLeave={() => setHoveredApp(null)}
            onClick={handleClearTrash}
            className="size-12 rounded-xl flex items-center justify-center bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 transition-all text-zinc-400 hover:text-zinc-200 shadow-md"
            title="Trash"
          >
            <Trash2 className="size-5" />
          </motion.button>
          <div className="h-1.5 mt-1" />
        </div>
      </div>
    </div>
  );
}
