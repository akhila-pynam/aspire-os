"use client";

import React, { useState, useRef, useEffect } from "react";
import { Terminal, Send, Sparkles, CornerDownLeft, Trash2, Cpu, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TerminalLine {
  id: string;
  type: "user" | "system" | "ai" | "error";
  text: string;
  timestamp: string;
}

const initialHistory: TerminalLine[] = [
  {
    id: "1",
    type: "system",
    text: "AspireOS Neural Kernel v4.19-x86_64 loaded.",
    timestamp: "07:00:12",
  },
  {
    id: "2",
    type: "system",
    text: "Subsystems initialized: [ReactFlow v11, Recharts v3, Supabase SDK, Gemini Engine].",
    timestamp: "07:00:13",
  },
  {
    id: "3",
    type: "ai",
    text: "Welcome to AspireOS Neural Copilot. Type 'help' for available commands, or ask any engineering or workflow question.",
    timestamp: "07:00:15",
  },
];

export function CopilotApp() {
  const [history, setHistory] = useState<TerminalLine[]>(initialHistory);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    const time = new Date().toTimeString().split(" ")[0];
    const userLine: TerminalLine = {
      id: Date.now().toString(),
      type: "user",
      text: trimmed,
      timestamp: time,
    };

    setHistory((prev) => [...prev, userLine]);
    setInput("");
    setIsProcessing(true);

    const lower = trimmed.toLowerCase();

    setTimeout(() => {
      let response: TerminalLine;
      const respTime = new Date().toTimeString().split(" ")[0];

      if (lower === "help") {
        response = {
          id: (Date.now() + 1).toString(),
          type: "system",
          text: `Available Terminal Commands:
  • help             - Displays this manual
  • neofetch         - Displays AspireOS system overview & specs
  • status           - Checks real-time health of all microservices
  • flow run         - Executes visual pipeline simulation
  • clear            - Wipes current terminal history
  • ask <question>   - Neural query to Gemini Intelligence`,
          timestamp: respTime,
        };
      } else if (lower === "neofetch") {
        response = {
          id: (Date.now() + 1).toString(),
          type: "system",
          text: `
      /\\      OS: AspireOS Pro Edition (Build 2026.10)
     /  \\     Host: Next.js 16.2 App Router on Bun
    / /\\ \\    Kernel: Linux-x86_64-Wasm Subsystem
   / ____ \\   Uptime: 4 hours, 12 mins
  /_/    \\_\\  Packages: 1,420 (npm / bun)
              Shell: Aspire-ZSH 5.9
              Resolution: 3840x2160 High-DPI
              DE: Aspire Glass Surface v2
              CPU: Virtual 16-Core Neural Engine
              GPU: WebGPU Metal Accelerator
              Memory: 17,612 MiB / 32,768 MiB (53%)`,
          timestamp: respTime,
        };
      } else if (lower === "status") {
        response = {
          id: (Date.now() + 1).toString(),
          type: "system",
          text: `[SYSTEM DIAGNOSTICS]
  ✔ Next.js App Router: Operational (Port 3001)
  ✔ Recharts Visualizer: Streaming at 60 FPS
  ✔ ReactFlow Graph: 4 Nodes, 4 Edges active
  ✔ Supabase pgvector: Healthy (1.2ms latency)
  ✔ Memory Pool: 0 leaks detected`,
          timestamp: respTime,
        };
      } else if (lower === "flow run") {
        response = {
          id: (Date.now() + 1).toString(),
          type: "system",
          text: `[FLOW DISPATCHER]
  1. Triggering Webhook (/api/v1/event-stream)... OK
  2. Embedding calculation via Supabase pgvector... OK (14ms)
  3. Inference via Gemini Neural Core... OK (220 tokens generated)
  4. Decision Gateway approved dispatch. Pipeline execution: 100% SUCCESS.`,
          timestamp: respTime,
        };
      } else if (lower === "clear") {
        setHistory([]);
        setIsProcessing(false);
        return;
      } else {
        // AI query response
        response = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          text: `Neural Copilot: I analyzed "${trimmed}". In AspireOS, all workflows synchronize seamlessly through our event mesh. Would you like me to inspect node dependencies or trigger a synthetic telemetry load?`,
          timestamp: respTime,
        };
      }

      setHistory((prev) => [...prev, response]);
      setIsProcessing(false);
    }, 400);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand(input);
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-[#0c0d12] text-zinc-200 font-mono text-xs select-none overflow-hidden">
      {/* Shell Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900/80 border-b border-zinc-800 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Terminal className="size-4 text-emerald-400" />
          <span className="font-semibold text-zinc-200 text-xs tracking-wider">
            aspire@neural-terminal: ~
          </span>
          <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
            zsh 5.9
          </Badge>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            size="xs"
            variant="ghost"
            onClick={() => setHistory([])}
            className="text-zinc-400 hover:text-zinc-200 text-[10px] gap-1"
          >
            <Trash2 className="size-3" />
            Clear
          </Button>
        </div>
      </div>

      {/* Quick Prompts Chips */}
      <div className="px-4 py-2 bg-zinc-950/70 border-b border-zinc-800/60 flex items-center gap-2 overflow-x-auto">
        <span className="text-[10px] text-zinc-500 uppercase font-sans font-semibold">Quick:</span>
        {["help", "neofetch", "status", "flow run"].map((q) => (
          <button
            key={q}
            onClick={() => handleCommand(q)}
            className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors"
          >
            ${q}
          </button>
        ))}
      </div>

      {/* Terminal Output Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 font-mono leading-relaxed select-text">
        {history.map((line) => (
          <div key={line.id} className="space-y-1">
            <div className="flex items-center gap-2 text-[10px] text-zinc-500">
              <span>[{line.timestamp}]</span>
              {line.type === "user" && <span className="text-violet-400 font-semibold">&gt; user</span>}
              {line.type === "system" && <span className="text-cyan-400 font-semibold">[system]</span>}
              {line.type === "ai" && <span className="text-amber-400 font-semibold">✨ copilot</span>}
            </div>
            <pre className="whitespace-pre-wrap text-zinc-200 text-xs font-mono pl-4 border-l border-zinc-800/80">
              {line.text}
            </pre>
          </div>
        ))}
        {isProcessing && (
          <div className="flex items-center gap-2 text-zinc-400 pl-4 animate-pulse">
            <Sparkles className="size-3 text-amber-400 animate-spin" />
            <span>Computing neural response...</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="p-3 bg-zinc-900/90 border-t border-zinc-800 flex items-center gap-2">
        <span className="text-emerald-400 font-bold">&gt;</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type command ('help', 'neofetch') or ask an AI question..."
          className="flex-1 bg-transparent border-none outline-none text-zinc-100 placeholder:text-zinc-600 font-mono text-xs"
          autoFocus
        />
        <Button
          size="xs"
          onClick={() => handleCommand(input)}
          disabled={!input.trim()}
          className="bg-emerald-600 hover:bg-emerald-500 text-white gap-1 text-[11px]"
        >
          <Send className="size-3" />
          Send
        </Button>
      </div>
    </div>
  );
}
