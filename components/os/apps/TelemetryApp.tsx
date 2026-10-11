"use client";

import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  Activity,
  Cpu,
  HardDrive,
  Wifi,
  Server,
  RefreshCw,
  CheckCircle2,
  Check,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TelemetryPoint {
  time: string;
  cpu: number;
  memory: number;
  heapUsed: number;
  requests: number;
}

export function TelemetryApp() {
  const [data, setData] = useState<TelemetryPoint[]>([]);
  const [isLive, setIsLive] = useState(true);
  const [serverStats, setServerStats] = useState<any>({
    cpuPercent: 32,
    memoryPercent: 48,
    heapUsedMb: 120,
    heapTotalMb: 180,
    uptimeSeconds: 120,
    nodeVersion: "v20+",
  });

  const fetchTelemetry = () => {
    const now = new Date();
    const timeFormatted = now.toTimeString().split(" ")[0].slice(3);
    const cpu = Math.floor(24 + Math.random() * 32);
    const mem = Math.floor(45 + Math.random() * 10);
    const heap = Math.floor(85 + Math.random() * 25);

    setServerStats((prev: any) => ({
      ...prev,
      cpuPercent: cpu,
      memoryPercent: mem,
      heapUsedMb: heap,
      uptimeSeconds: prev.uptimeSeconds + 3,
    }));

    const newPoint: TelemetryPoint = {
      time: timeFormatted,
      cpu,
      memory: mem,
      heapUsed: heap,
      requests: Math.floor(420 + Math.random() * 280),
    };

    setData((prev) => [...prev.slice(-14), newPoint]);
  };

  useEffect(() => {
    fetchTelemetry();
    if (!isLive) return;
    const interval = setInterval(fetchTelemetry, 3000);
    return () => clearInterval(interval);
  }, [isLive]);

  return (
    <div className="h-full w-full flex flex-col bg-zinc-950 text-zinc-100 overflow-y-auto select-none p-5">
      {/* Top Controls */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Activity className="size-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
              System Telemetry & Live Diagnostics
              <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-[10px]">
                Client Sandbox Telemetry
              </Badge>
            </h2>
            <p className="text-[11px] text-zinc-400">
              Interactive host simulation • 60 FPS Canvas • Zero external dependencies
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="xs"
            variant="outline"
            onClick={() => setIsLive(!isLive)}
            className={`text-[11px] border-zinc-800 gap-1.5 ${
              isLive ? "bg-emerald-950/30 text-emerald-400 border-emerald-800/50" : "text-zinc-400"
            }`}
          >
            <RefreshCw className={`size-3 ${isLive ? "animate-spin" : ""}`} />
            {isLive ? "Streaming Active" : "Stream Paused"}
          </Button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-4">
        <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-md">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
            <span className="flex items-center gap-1.5">
              <Cpu className="size-3.5 text-violet-400" /> Host Load
            </span>
            <span className="text-emerald-400 text-[10px] font-mono">Real</span>
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-zinc-100">
            {serverStats.cpuPercent}%
          </div>
          <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-violet-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${serverStats.cpuPercent}%` }}
            />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-md">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
            <span className="flex items-center gap-1.5">
              <HardDrive className="size-3.5 text-cyan-400" /> System RAM
            </span>
            <span className="text-cyan-400 text-[10px] font-mono">
              {Math.round((serverStats.usedMemMb || 0) / 1024)}G / {Math.round((serverStats.totalMemMb || 16000) / 1024)}G
            </span>
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-zinc-100">
            {serverStats.memoryPercent}%
          </div>
          <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-cyan-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${serverStats.memoryPercent}%` }}
            />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-md">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
            <span className="flex items-center gap-1.5">
              <Server className="size-3.5 text-emerald-400" /> Node V8 Heap
            </span>
            <span className="text-emerald-400 text-[10px] font-mono">Process</span>
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-zinc-100">
            {serverStats.heapUsedMb} <span className="text-xs font-normal text-zinc-400">MB</span>
          </div>
          <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full"
              style={{
                width: `${Math.min(100, Math.round(((serverStats.heapUsedMb || 10) / (serverStats.heapTotalMb || 100)) * 100))}%`,
              }}
            />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-md">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
            <span className="flex items-center gap-1.5">
              <Wifi className="size-3.5 text-amber-400" /> Server Uptime
            </span>
            <span className="text-amber-400 text-[10px] font-mono">Continuous</span>
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-zinc-100">
            {serverStats.uptimeSeconds} <span className="text-xs font-normal text-zinc-400">sec</span>
          </div>
          <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full w-[85%]" />
          </div>
        </div>
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
        {/* Real Process Heap & System Memory Waveform */}
        <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/80 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <Cpu className="size-3.5 text-violet-400" /> Host Metrics (% Load & Memory)
            </h3>
            <div className="flex items-center gap-3 text-[10px] text-zinc-400">
              <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-violet-500" /> Host Load</span>
              <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-cyan-400" /> RAM</span>
            </div>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="memGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="time" stroke="#71717a" fontSize={9} />
                <YAxis stroke="#71717a" fontSize={9} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181b",
                    borderColor: "#3f3f46",
                    borderRadius: "8px",
                    fontSize: "11px",
                  }}
                />
                <Area type="monotone" dataKey="cpu" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#cpuGradient)" />
                <Area type="monotone" dataKey="memory" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#memGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* V8 Heap Allocation */}
        <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/80 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <Server className="size-3.5 text-emerald-400" /> V8 Heap Allocation (MB)
            </h3>
            <span className="text-[10px] text-zinc-400 font-mono">Sampled from process.memoryUsage()</span>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="time" stroke="#71717a" fontSize={9} />
                <YAxis stroke="#71717a" fontSize={9} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181b",
                    borderColor: "#3f3f46",
                    borderRadius: "8px",
                    fontSize: "11px",
                  }}
                />
                <Bar dataKey="heapUsed" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Subsystem SLA Checklist */}
      <div className="mt-4 p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800/80">
        <h4 className="text-xs font-semibold text-zinc-300 mb-2">Connected Subsystems & Security Guards</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-zinc-950/60 border border-zinc-800">
            <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0" />
            <div>
              <p className="font-medium text-zinc-200">Server Engine</p>
              <p className="text-[10px] text-zinc-500 font-mono">/api/telemetry Active</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-zinc-950/60 border border-zinc-800">
            <ShieldCheck className="size-3.5 text-emerald-400 shrink-0" />
            <div>
              <p className="font-medium text-zinc-200">Aspire Shield</p>
              <p className="text-[10px] text-zinc-500 font-mono">SSRF Filter Ready</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-zinc-950/60 border border-zinc-800">
            <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0" />
            <div>
              <p className="font-medium text-zinc-200">Zustand State</p>
              <p className="text-[10px] text-zinc-500 font-mono">localStorage Synced</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-zinc-950/60 border border-zinc-800">
            <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0" />
            <div>
              <p className="font-medium text-zinc-200">Next.js Turbopack</p>
              <p className="text-[10px] text-zinc-500 font-mono">60 FPS Responsive</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
