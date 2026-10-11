"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Zap,
  Activity,
  Terminal,
  Folder,
  CheckSquare,
  SlidersHorizontal,
  Shield,
  ArrowRight,
  Lock,
  Sparkles,
  Command,
} from "lucide-react";
import { AppId } from "./types";
import { useOSStore } from "@/lib/store/useOSStore";

interface CommandItem {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  category: "Apps" | "Actions" | "Preferences";
  action: () => void;
}

export function CommandPalette() {
  const {
    isCommandPaletteOpen,
    setCommandPaletteOpen,
    openApp,
    setIsLocked,
    setWallpaper,
  } = useOSStore();

  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global Ctrl+K / Cmd+K shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
      }
      if (e.key === "Escape" && isCommandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCommandPaletteOpen, setCommandPaletteOpen]);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery("");
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const commands: CommandItem[] = [
    {
      id: "app-flow",
      title: "Open Aspire Flow Canvas",
      subtitle: "Visual node graph & autonomous AI pipeline",
      icon: Zap,
      category: "Apps",
      action: () => {
        openApp("flow");
        setCommandPaletteOpen(false);
      },
    },
    {
      id: "app-shield",
      title: "Open Aspire Shield",
      subtitle: "Security health posture & least-privilege checks",
      icon: Shield,
      category: "Apps",
      action: () => {
        openApp("shield");
        setCommandPaletteOpen(false);
      },
    },
    {
      id: "app-telemetry",
      title: "Open System Telemetry",
      subtitle: "Real-time CPU/RAM waveform and edge metrics",
      icon: Activity,
      category: "Apps",
      action: () => {
        openApp("telemetry");
        setCommandPaletteOpen(false);
      },
    },
    {
      id: "app-copilot",
      title: "Open Neural Copilot & Terminal",
      subtitle: "Interactive zsh shell and AI assistant",
      icon: Terminal,
      category: "Apps",
      action: () => {
        openApp("copilot");
        setCommandPaletteOpen(false);
      },
    },
    {
      id: "app-tasks",
      title: "Open Sprint Task Matrix",
      subtitle: "Manage engineering objectives and roadmap",
      icon: CheckSquare,
      category: "Apps",
      action: () => {
        openApp("tasks");
        setCommandPaletteOpen(false);
      },
    },
    {
      id: "app-files",
      title: "Open Cloud Storage & Files",
      subtitle: "Virtual assets and dataset vault",
      icon: Folder,
      category: "Apps",
      action: () => {
        openApp("files");
        setCommandPaletteOpen(false);
      },
    },
    {
      id: "action-lock",
      title: "Lock AspireOS Desktop",
      subtitle: "Secure session and activate lock display",
      icon: Lock,
      category: "Actions",
      action: () => {
        setIsLocked(true);
        setCommandPaletteOpen(false);
      },
    },
    {
      id: "action-neon",
      title: "Theme: Switch to Neon Horizon",
      subtitle: "Apply cyberpunk atmospheric desktop wallpaper",
      icon: SlidersHorizontal,
      category: "Preferences",
      action: () => {
        setWallpaper("cyberpunk");
        setCommandPaletteOpen(false);
      },
    },
    {
      id: "action-aurora",
      title: "Theme: Switch to Aurora Borealis",
      subtitle: "Apply deep emerald celestial desktop wallpaper",
      icon: SlidersHorizontal,
      category: "Preferences",
      action: () => {
        setWallpaper("aurora");
        setCommandPaletteOpen(false);
      },
    },
  ];

  const filtered = commands.filter(
    (c) =>
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.subtitle.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === "Enter" && filtered[selectedIndex]) {
      e.preventDefault();
      filtered[selectedIndex].action();
    }
  };

  return (
    <div
      onClick={() => setCommandPaletteOpen(false)}
      className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-md flex items-start justify-center pt-24 p-4 animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl rounded-2xl bg-zinc-950/95 border border-zinc-700/80 shadow-2xl overflow-hidden flex flex-col backdrop-blur-2xl"
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800 bg-zinc-900/40">
          <Search className="size-4 text-violet-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search applications (e.g. 'Flow', 'Shield', 'Lock')..."
            className="flex-1 bg-transparent border-none outline-none text-zinc-100 text-xs placeholder:text-zinc-500 font-sans"
          />
          <kbd className="text-[10px] bg-zinc-800 text-zinc-400 border border-zinc-700 px-1.5 py-0.5 rounded font-mono">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-72 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-zinc-500">
              No matching commands found for &quot;{query}&quot;.
            </div>
          ) : (
            filtered.map((cmd, idx) => {
              const isSelected = selectedIndex === idx;
              const Icon = cmd.icon;
              return (
                <div
                  key={cmd.id}
                  onClick={cmd.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? "bg-violet-600/20 border border-violet-500/40 text-zinc-100"
                      : "text-zinc-300 hover:bg-zinc-900 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`size-7 rounded-lg flex items-center justify-center ${
                        isSelected ? "bg-violet-600 text-white" : "bg-zinc-900 text-zinc-400"
                      }`}
                    >
                      <Icon className="size-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium">{cmd.title}</p>
                      <p className="text-[10px] text-zinc-500">{cmd.subtitle}</p>
                    </div>
                  </div>

                  {isSelected && <ArrowRight className="size-3.5 text-violet-400" />}
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 border-t border-zinc-900 bg-zinc-900/60 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
          <span>Navigate with ↑ ↓ • Press Enter to run</span>
          <span>Aspire Command Intelligence</span>
        </div>
      </div>
    </div>
  );
}
