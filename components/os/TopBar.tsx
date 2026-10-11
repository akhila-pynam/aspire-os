"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Wifi,
  BatteryCharging,
  Bell,
  Volume2,
  VolumeX,
  Lock,
  RefreshCw,
  X,
  Command,
} from "lucide-react";
import { NotificationItem, AppId } from "./types";

interface TopBarProps {
  activeAppTitle: string;
  activeAppId: AppId | null;
  onCloseActiveApp: () => void;
  onLockScreen: () => void;
  onOpenApp: (id: AppId) => void;
  onOpenCommandPalette?: () => void;
}

const mockNotifications: NotificationItem[] = [
  {
    id: "1",
    title: "AI Flow Deployed",
    message: "Visual Pipeline 'Webhook -> Gemini' successfully verified.",
    time: "2m ago",
    app: "Aspire Flow",
    read: false,
    type: "success",
  },
  {
    id: "2",
    title: "Supabase Vector Sync",
    message: "1,536 embeddings indexed with 0.89 cosine distance.",
    time: "10m ago",
    app: "Cloud Storage",
    read: false,
    type: "info",
  },
  {
    id: "3",
    title: "Low Latency Alert",
    message: "Global edge latency recorded at 14ms (Optimal).",
    time: "25m ago",
    app: "Telemetry",
    read: true,
    type: "success",
  },
];

export function TopBar({
  activeAppTitle,
  activeAppId,
  onCloseActiveApp,
  onLockScreen,
  onOpenApp,
  onOpenCommandPalette,
}: TopBarProps) {
  const [time, setTime] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [showSystemMenu, setShowSystemMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
      setDate(
        now.toLocaleDateString([], {
          weekday: "short",
          month: "short",
          day: "numeric",
        })
      );
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="h-10 w-full bg-zinc-950/70 backdrop-blur-xl border-b border-zinc-800/80 px-3 flex items-center justify-between text-zinc-300 text-xs select-none z-50 relative">
      {/* Left: Aspire OS Logo & Menus */}
      <div className="flex items-center gap-3">
        {/* System Menu Trigger */}
        <div className="relative">
          <button
            onClick={() => setShowSystemMenu(!showSystemMenu)}
            className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-zinc-800/70 transition-colors"
          >
            <div className="size-5 rounded-md bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white shadow-md">
              <Sparkles className="size-3" />
            </div>
            <span className="font-bold text-zinc-100 tracking-wider">AspireOS</span>
          </button>

          {/* System Dropdown */}
          {showSystemMenu && (
            <div className="absolute top-8 left-0 w-56 rounded-xl bg-zinc-900/95 border border-zinc-800/90 shadow-2xl p-1.5 backdrop-blur-2xl z-50 text-xs">
              <div className="px-3 py-2 border-b border-zinc-800/80 mb-1">
                <p className="font-semibold text-zinc-100">AspireOS Pro</p>
                <p className="text-[10px] text-zinc-500">v2026.10 Autonomous Edition</p>
              </div>
              <button
                onClick={() => {
                  setShowSystemMenu(false);
                  onOpenApp("settings");
                }}
                className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-zinc-800 text-zinc-300 flex items-center justify-between"
              >
                <span>System Preferences...</span>
              </button>
              <button
                onClick={() => {
                  setShowSystemMenu(false);
                  onOpenApp("telemetry");
                }}
                className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-zinc-800 text-zinc-300 flex items-center justify-between"
              >
                <span>Activity Monitor</span>
              </button>
              <div className="my-1 border-t border-zinc-800/80" />
              <button
                onClick={() => {
                  setShowSystemMenu(false);
                  onLockScreen();
                }}
                className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-zinc-800 text-zinc-300 flex items-center gap-2"
              >
                <Lock className="size-3 text-zinc-400" />
                <span>Lock Screen</span>
              </button>
              <button
                onClick={() => {
                  window.location.reload();
                }}
                className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-rose-950/40 text-rose-300 flex items-center gap-2"
              >
                <RefreshCw className="size-3 text-rose-400" />
                <span>Restart Session</span>
              </button>
            </div>
          )}
        </div>

        {/* Current Active App Indicator & Quick Exit Button */}
        <div className="hidden sm:flex items-center gap-2.5 border-l border-zinc-800/80 pl-3">
          <span className="font-semibold text-zinc-200">{activeAppTitle}</span>

          {activeAppId && (
            <button
              onClick={onCloseActiveApp}
              className="px-2 py-0.5 rounded-md bg-rose-500/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 text-[11px] font-medium flex items-center gap-1 transition-all shadow-sm"
              title="Close and exit the active application window"
            >
              <X className="size-3 stroke-[2.5]" />
              <span>Exit App</span>
            </button>
          )}

          <span className="text-zinc-600">•</span>
          <span className="text-zinc-400 hover:text-zinc-200 cursor-pointer">File</span>
          <span className="text-zinc-400 hover:text-zinc-200 cursor-pointer">Edit</span>
          <span className="text-zinc-400 hover:text-zinc-200 cursor-pointer">View</span>
          <span className="text-zinc-400 hover:text-zinc-200 cursor-pointer">Window</span>
        </div>
      </div>

      {/* Center: Dynamic Island & Command Palette Button */}
      <div className="hidden md:flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800/80 shadow-inner">
          <span className="size-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-[11px] font-mono text-zinc-300">
            Neural Mesh: <span className="text-emerald-400 font-semibold">Active</span>
          </span>
          <span className="text-zinc-700">|</span>
          <span className="text-[11px] text-zinc-400">Aspire Shield Protected</span>
        </div>

        {onOpenCommandPalette && (
          <button
            onClick={onOpenCommandPalette}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900/70 hover:bg-zinc-800 text-zinc-300 border border-zinc-800/80 text-[11px] transition-all hover:border-violet-500/50 shadow-inner"
            title="Open Aspire Command Intelligence (Ctrl+K / Cmd+K)"
          >
            <Command className="size-3 text-violet-400" />
            <span>Search / Commands</span>
            <kbd className="text-[9px] bg-zinc-800 text-zinc-400 px-1 py-0.2 rounded border border-zinc-700 font-mono">
              Ctrl+K
            </kbd>
          </button>
        )}
      </div>

      {/* Right: Controls, Notifications & Live Clock */}
      <div className="flex items-center gap-3">
        {/* Audio Toggle */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="p-1 rounded-md hover:bg-zinc-800/70 text-zinc-400 hover:text-zinc-200 transition-colors"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX className="size-3.5 text-zinc-500" /> : <Volume2 className="size-3.5" />}
        </button>

        {/* Wifi Status */}
        <div className="flex items-center gap-1 text-emerald-400" title="Connected: 1000 Mbps">
          <Wifi className="size-3.5" />
        </div>

        {/* Battery */}
        <div className="flex items-center gap-1 text-zinc-300" title="Battery: 100% Charging">
          <BatteryCharging className="size-3.5 text-emerald-400" />
          <span className="text-[10px] font-mono">100%</span>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-1 rounded-md hover:bg-zinc-800/70 text-zinc-300 relative transition-colors"
          >
            <Bell className="size-3.5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-rose-500 animate-pulse" />
            )}
          </button>

          {/* Notifications Flyout */}
          {showNotifications && (
            <div className="absolute top-8 right-0 w-80 rounded-2xl bg-zinc-900/95 border border-zinc-800/90 shadow-2xl p-3 backdrop-blur-2xl z-50 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <span className="font-semibold text-zinc-100">Notifications</span>
                <button
                  onClick={markAllRead}
                  className="text-[10px] text-violet-400 hover:text-violet-300"
                >
                  Mark all read
                </button>
              </div>

              <div className="mt-2 space-y-2 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-2.5 rounded-xl border transition-colors ${
                      n.read ? "bg-zinc-950/40 border-zinc-900 text-zinc-400" : "bg-zinc-800/50 border-zinc-700/60 text-zinc-200"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-zinc-400 mb-1">
                      <span className="font-semibold text-violet-400">{n.app}</span>
                      <span>{n.time}</span>
                    </div>
                    <p className="font-medium text-xs text-zinc-200">{n.title}</p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Digital Clock & Date */}
        <div className="flex items-center gap-1.5 pl-2 border-l border-zinc-800 font-medium">
          <span className="text-zinc-400 hidden lg:inline">{date}</span>
          <span className="text-zinc-100 font-mono">{time}</span>
        </div>
      </div>
    </div>
  );
}
