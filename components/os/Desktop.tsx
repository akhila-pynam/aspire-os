"use client";

import React, { useState, useEffect } from "react";
import { TopBar } from "./TopBar";
import { Dock } from "./Dock";
import { WindowFrame } from "./WindowFrame";
import { LockScreen } from "./LockScreen";
import { CommandPalette } from "./CommandPalette";
import { FlowApp } from "./apps/FlowApp";
import { TelemetryApp } from "./apps/TelemetryApp";
import { CopilotApp } from "./apps/CopilotApp";
import { FilesApp } from "./apps/FilesApp";
import { TasksApp } from "./apps/TasksApp";
import { SettingsApp } from "./apps/SettingsApp";
import { ShieldApp } from "./apps/ShieldApp";
import {
  AppId,
  AppDefinition,
} from "./types";
import {
  Zap,
  Activity,
  Terminal,
  Folder,
  CheckSquare,
  SlidersHorizontal,
  Sparkles,
  Cpu,
  ShieldCheck,
  Shield,
} from "lucide-react";
import { useOSStore } from "@/lib/store/useOSStore";

const appDefinitions: AppDefinition[] = [
  {
    id: "flow",
    title: "Aspire Flow Canvas",
    iconName: "Zap",
    description: "Visual AI node graph & autonomous pipeline builder",
    defaultWidth: 920,
    defaultHeight: 580,
    category: "workflow",
    badge: "v2.4",
  },
  {
    id: "shield",
    title: "Aspire Shield Guard",
    iconName: "Shield",
    description: "Security posture audit, least-privilege checks & SSRF barrier",
    defaultWidth: 800,
    defaultHeight: 560,
    category: "security",
    badge: "SEC",
  },
  {
    id: "telemetry",
    title: "System Telemetry",
    iconName: "Activity",
    description: "Real-time host CPU/RAM waveform analytics & edge metrics",
    defaultWidth: 840,
    defaultHeight: 560,
    category: "system",
  },
  {
    id: "copilot",
    title: "Neural Copilot & Shell",
    iconName: "Terminal",
    description: "Intelligent interactive terminal & agent assistant",
    defaultWidth: 760,
    defaultHeight: 520,
    category: "ai",
  },
  {
    id: "files",
    title: "Cloud Storage & Assets",
    iconName: "Folder",
    description: "Workspace virtual asset and dataset explorer",
    defaultWidth: 780,
    defaultHeight: 500,
    category: "productivity",
  },
  {
    id: "tasks",
    title: "Sprint Task Matrix",
    iconName: "CheckSquare",
    description: "Interactive project goals, backlogs & sprint kanban",
    defaultWidth: 740,
    defaultHeight: 520,
    category: "productivity",
  },
  {
    id: "settings",
    title: "System Preferences",
    iconName: "SlidersHorizontal",
    description: "Atmosphere wallpapers, themes & hardware diagnostics",
    defaultWidth: 680,
    defaultHeight: 540,
    category: "system",
  },
];

export function Desktop() {
  const {
    windows,
    activeApp,
    wallpaper,
    accentColor,
    isLocked,
    openApp,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
    setWallpaper,
    setAccentColor,
    setIsLocked,
    setCommandPaletteOpen,
  } = useOSStore();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-screen w-screen bg-[#07090e] flex flex-col items-center justify-center text-zinc-100 select-none">
        <div className="size-16 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 p-0.5 shadow-2xl shadow-violet-900/50 mb-4 animate-pulse">
          <div className="size-full rounded-2xl bg-zinc-950 flex items-center justify-center">
            <span className="text-xl font-bold text-violet-400">⚡</span>
          </div>
        </div>
        <h1 className="text-lg font-semibold tracking-wide text-zinc-100">AspireOS</h1>
        <p className="text-xs text-zinc-500 font-mono mt-1">Booting Persistent Store...</p>
      </div>
    );
  }

  // Compute wallpaper styling
  const getWallpaperClasses = () => {
    switch (wallpaper) {
      case "aurora":
        return "bg-gradient-to-br from-[#06101e] via-[#091b29] to-[#120e24]";
      case "cyberpunk":
        return "bg-gradient-to-br from-[#160628] via-[#0b0c15] to-[#250d1e]";
      case "sunset":
        return "bg-gradient-to-br from-[#1e0d06] via-[#1a0a1e] to-[#0a0c16]";
      case "quantum":
        return "bg-gradient-to-br from-[#04141d] via-[#080d1a] to-[#0e1626]";
      case "obsidian":
        return "bg-gradient-to-br from-[#0a0a0c] via-[#111114] to-[#050506]";
      default:
        return "bg-gradient-to-br from-[#06101e] via-[#091b29] to-[#120e24]";
    }
  };

  const openAppIds = Object.keys(windows).filter(
    (key) => windows[key as AppId]?.isOpen && !windows[key as AppId]?.isMinimized
  ) as AppId[];

  const activeAppTitle = activeApp && windows[activeApp] ? windows[activeApp].title : "AspireOS Finder";

  return (
    <div className={`h-screen w-screen relative overflow-hidden select-none flex flex-col font-sans ${getWallpaperClasses()}`}>
      {/* Dynamic Ambient Glow Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 size-[500px] rounded-full bg-violet-600/15 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 size-[450px] rounded-full bg-cyan-600/10 blur-[130px]" />
        <div className="absolute -bottom-40 left-1/3 size-[550px] rounded-full bg-emerald-600/10 blur-[140px]" />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      {/* Top Menu Bar */}
      <TopBar
        activeAppTitle={activeAppTitle}
        activeAppId={activeApp}
        onCloseActiveApp={() => {
          if (activeApp) closeWindow(activeApp);
        }}
        onLockScreen={() => setIsLocked(true)}
        onOpenApp={openApp}
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
      />

      {/* Desktop Workspace Canvas */}
      <div className="flex-1 w-full relative p-4 overflow-hidden">
        {/* Desktop Shortcut Icons (Left column) */}
        <div className="absolute top-6 left-6 grid grid-cols-1 gap-5 z-0">
          {appDefinitions.map((app) => (
            <div
              key={app.id}
              onClick={() => openApp(app.id)}
              className="group flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-white/5 cursor-pointer transition-all w-20 text-center"
            >
              <div className="size-12 rounded-2xl bg-zinc-900/60 border border-zinc-700/40 backdrop-blur-md flex items-center justify-center group-hover:scale-105 group-hover:border-zinc-500/60 shadow-lg shadow-black/40 transition-all">
                {app.id === "flow" && <Zap className="size-6 text-amber-400" />}
                {app.id === "shield" && <Shield className="size-6 text-emerald-400" />}
                {app.id === "telemetry" && <Activity className="size-6 text-emerald-400" />}
                {app.id === "copilot" && <Terminal className="size-6 text-violet-400" />}
                {app.id === "files" && <Folder className="size-6 text-blue-400" />}
                {app.id === "tasks" && <CheckSquare className="size-6 text-indigo-400" />}
                {app.id === "settings" && <SlidersHorizontal className="size-6 text-pink-400" />}
              </div>
              <span className="text-[11px] font-medium text-zinc-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] leading-tight">
                {app.title.split(" ")[0]}
              </span>
            </div>
          ))}
        </div>

        {/* Ambient Desktop Widgets (Right corner) */}
        <div className="absolute top-6 right-6 hidden lg:flex flex-col gap-3 w-64 z-0 pointer-events-auto">
          {/* System Status Widget */}
          <div
            onClick={() => openApp("telemetry")}
            className="p-3.5 rounded-2xl bg-zinc-950/40 border border-zinc-800/60 backdrop-blur-xl shadow-xl hover:border-zinc-700/60 cursor-pointer transition-all"
          >
            <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
              <span className="flex items-center gap-1.5 font-medium text-zinc-200">
                <Cpu className="size-3.5 text-violet-400" /> System Engine
              </span>
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <div className="space-y-1.5 text-[11px] text-zinc-400">
              <div className="flex justify-between">
                <span>Core Telemetry</span>
                <span className="text-zinc-200 font-mono">Verified Live</span>
              </div>
              <div className="flex justify-between">
                <span>Aspire Shield</span>
                <span className="text-emerald-400 font-mono">Protected</span>
              </div>
              <div className="flex justify-between">
                <span>State Storage</span>
                <span className="text-violet-400 font-mono">Persisted</span>
              </div>
            </div>
          </div>

          {/* Quick Launcher Tile */}
          <div
            onClick={() => setCommandPaletteOpen(true)}
            className="p-3.5 rounded-2xl bg-gradient-to-br from-violet-950/40 via-zinc-950/50 to-indigo-950/40 border border-violet-500/30 backdrop-blur-xl shadow-xl hover:border-violet-400/50 cursor-pointer transition-all"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="size-4 text-violet-400" />
              <span className="text-xs font-semibold text-zinc-100">Command Intelligence</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-snug">
              Press <kbd className="bg-zinc-800 px-1 py-0.5 rounded text-zinc-300 font-mono text-[10px]">Ctrl+K</kbd> to launch applications, run workflows, or switch layouts.
            </p>
          </div>
        </div>

        {/* Application Windows */}
        {windows.flow?.isOpen && (
          <WindowFrame
            window={windows.flow}
            onClose={() => closeWindow("flow")}
            onMinimize={() => minimizeWindow("flow")}
            onMaximize={() => maximizeWindow("flow")}
            onFocus={() => focusWindow("flow")}
          >
            <FlowApp />
          </WindowFrame>
        )}

        {windows.shield?.isOpen && (
          <WindowFrame
            window={windows.shield}
            onClose={() => closeWindow("shield")}
            onMinimize={() => minimizeWindow("shield")}
            onMaximize={() => maximizeWindow("shield")}
            onFocus={() => focusWindow("shield")}
          >
            <ShieldApp />
          </WindowFrame>
        )}

        {windows.telemetry?.isOpen && (
          <WindowFrame
            window={windows.telemetry}
            onClose={() => closeWindow("telemetry")}
            onMinimize={() => minimizeWindow("telemetry")}
            onMaximize={() => maximizeWindow("telemetry")}
            onFocus={() => focusWindow("telemetry")}
          >
            <TelemetryApp />
          </WindowFrame>
        )}

        {windows.copilot?.isOpen && (
          <WindowFrame
            window={windows.copilot}
            onClose={() => closeWindow("copilot")}
            onMinimize={() => minimizeWindow("copilot")}
            onMaximize={() => maximizeWindow("copilot")}
            onFocus={() => focusWindow("copilot")}
          >
            <CopilotApp />
          </WindowFrame>
        )}

        {windows.files?.isOpen && (
          <WindowFrame
            window={windows.files}
            onClose={() => closeWindow("files")}
            onMinimize={() => minimizeWindow("files")}
            onMaximize={() => maximizeWindow("files")}
            onFocus={() => focusWindow("files")}
          >
            <FilesApp />
          </WindowFrame>
        )}

        {windows.tasks?.isOpen && (
          <WindowFrame
            window={windows.tasks}
            onClose={() => closeWindow("tasks")}
            onMinimize={() => minimizeWindow("tasks")}
            onMaximize={() => maximizeWindow("tasks")}
            onFocus={() => focusWindow("tasks")}
          >
            <TasksApp />
          </WindowFrame>
        )}

        {windows.settings?.isOpen && (
          <WindowFrame
            window={windows.settings}
            onClose={() => closeWindow("settings")}
            onMinimize={() => minimizeWindow("settings")}
            onMaximize={() => maximizeWindow("settings")}
            onFocus={() => focusWindow("settings")}
          >
            <SettingsApp
              currentWallpaper={wallpaper}
              onWallpaperChange={setWallpaper}
              accentColor={accentColor}
              onAccentChange={setAccentColor}
            />
          </WindowFrame>
        )}
      </div>

      {/* Floating Bottom Dock */}
      <Dock
        apps={appDefinitions}
        openApps={openAppIds}
        activeApp={activeApp}
        onAppClick={openApp}
      />

      {/* Universal Command Palette (Ctrl+K) */}
      <CommandPalette />

      {/* Lock Screen Overlay */}
      {isLocked && <LockScreen onUnlock={() => setIsLocked(false)} />}
    </div>
  );
}
