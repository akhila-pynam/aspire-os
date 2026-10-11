"use client";

import React from "react";
import { Monitor, Palette, Volume2, Shield, Info, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WallpaperId } from "../types";

interface SettingsAppProps {
  currentWallpaper: WallpaperId;
  onWallpaperChange: (id: WallpaperId) => void;
  accentColor: string;
  onAccentChange: (accent: string) => void;
}

const wallpapers: { id: WallpaperId; name: string; preview: string }[] = [
  {
    id: "aurora",
    name: "Aurora Borealis",
    preview: "from-emerald-950 via-slate-950 to-violet-950",
  },
  {
    id: "cyberpunk",
    name: "Neon Horizon",
    preview: "from-purple-950 via-zinc-950 to-pink-950",
  },
  {
    id: "sunset",
    name: "Solar Gradient",
    preview: "from-amber-950 via-rose-950 to-zinc-950",
  },
  {
    id: "quantum",
    name: "Quantum Deep",
    preview: "from-cyan-950 via-slate-950 to-blue-950",
  },
  {
    id: "obsidian",
    name: "Obsidian Slate",
    preview: "from-zinc-950 via-neutral-900 to-black",
  },
];

const accents = [
  { name: "Violet", class: "bg-violet-500", glow: "border-violet-500" },
  { name: "Cyan", class: "bg-cyan-400", glow: "border-cyan-400" },
  { name: "Emerald", class: "bg-emerald-400", glow: "border-emerald-400" },
  { name: "Amber", class: "bg-amber-400", glow: "border-amber-400" },
  { name: "Rose", class: "bg-rose-500", glow: "border-rose-500" },
];

export function SettingsApp({
  currentWallpaper,
  onWallpaperChange,
  accentColor,
  onAccentChange,
}: SettingsAppProps) {
  return (
    <div className="h-full w-full flex bg-zinc-950 text-zinc-100 overflow-y-auto select-none p-5">
      <div className="max-w-2xl mx-auto w-full space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <Palette className="size-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-zinc-100">AspireOS Preferences</h2>
              <p className="text-[11px] text-zinc-400">System appearance, audio environment & runtime telemetry</p>
            </div>
          </div>
          <Badge variant="outline" className="text-[10px] bg-zinc-900 border-zinc-700 text-zinc-300">
            Build 2026.10
          </Badge>
        </div>

        {/* Wallpaper Picker */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-zinc-300 flex items-center gap-2">
            <Monitor className="size-3.5 text-violet-400" /> Desktop Atmosphere & Wallpaper
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {wallpapers.map((wp) => {
              const isSelected = currentWallpaper === wp.id;
              return (
                <div
                  key={wp.id}
                  onClick={() => onWallpaperChange(wp.id)}
                  className={`cursor-pointer rounded-xl p-2.5 border transition-all ${
                    isSelected
                      ? "border-violet-500 bg-violet-950/20 shadow-lg shadow-violet-950/40"
                      : "border-zinc-800 hover:border-zinc-700 bg-zinc-900/40"
                  }`}
                >
                  <div
                    className={`h-16 w-full rounded-lg bg-gradient-to-br ${wp.preview} border border-zinc-800/80 mb-2 relative overflow-hidden flex items-center justify-center`}
                  >
                    {isSelected && (
                      <div className="size-5 rounded-full bg-violet-500 text-white flex items-center justify-center shadow-md">
                        <Check className="size-3 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <p className="text-[11px] font-medium text-zinc-200 text-center">{wp.name}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Accent Color */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-semibold text-zinc-300 flex items-center gap-2">
            <Sparkles className="size-3.5 text-cyan-400" /> Accent Highlight Color
          </h3>
          <div className="flex items-center gap-3">
            {accents.map((acc) => (
              <button
                key={acc.name}
                onClick={() => onAccentChange(acc.name.toLowerCase())}
                className={`size-8 rounded-full ${acc.class} flex items-center justify-center transition-transform hover:scale-110 ${
                  accentColor === acc.name.toLowerCase() ? "ring-2 ring-white ring-offset-2 ring-offset-zinc-950" : ""
                }`}
                title={acc.name}
              >
                {accentColor === acc.name.toLowerCase() && (
                  <Check className="size-4 text-black stroke-[3]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* System Specifications Card */}
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-2">
          <h3 className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
            <Info className="size-3.5 text-emerald-400" /> Hardware & Software Matrix
          </h3>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-400 pt-1">
            <div className="p-2 rounded-lg bg-zinc-950/60 border border-zinc-800">
              <span className="text-zinc-500">Framework:</span> Next.js 16.2 App Router
            </div>
            <div className="p-2 rounded-lg bg-zinc-950/60 border border-zinc-800">
              <span className="text-zinc-500">Engine:</span> Bun JS Hyper-optimized
            </div>
            <div className="p-2 rounded-lg bg-zinc-950/60 border border-zinc-800">
              <span className="text-zinc-500">CSS Core:</span> Tailwind CSS v4 Engine
            </div>
            <div className="p-2 rounded-lg bg-zinc-950/60 border border-zinc-800">
              <span className="text-zinc-500">Graph Subsystem:</span> ReactFlow v11 Canvas
            </div>
            <div className="p-2 rounded-lg bg-zinc-950/60 border border-zinc-800">
              <span className="text-zinc-500">Motion Layer:</span> Framer Motion Spring Engine
            </div>
            <div className="p-2 rounded-lg bg-zinc-950/60 border border-zinc-800">
              <span className="text-zinc-500">Cloud Storage:</span> Supabase & Firebase Ready
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
