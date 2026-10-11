"use client";

import React, { useState, useEffect } from "react";
import { Lock, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LockScreenProps {
  onUnlock: () => void;
}

export function LockScreen({ onUnlock }: LockScreenProps) {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
      setDate(
        now.toLocaleDateString([], {
          weekday: "long",
          month: "long",
          day: "numeric",
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-zinc-950/80 backdrop-blur-3xl flex flex-col items-center justify-between p-12 text-zinc-100 select-none animate-in fade-in duration-300">
      {/* Top Clock */}
      <div className="text-center pt-8">
        <h1 className="text-7xl md:text-8xl font-extralight tracking-tight font-sans drop-shadow-2xl">
          {time}
        </h1>
        <p className="text-lg md:text-xl text-zinc-400 mt-2 font-medium tracking-wide">
          {date}
        </p>
      </div>

      {/* Center User Profile & Unlock button */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="size-24 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-500 p-0.5 shadow-2xl shadow-violet-900/40">
            <div className="size-full rounded-full bg-zinc-900 flex items-center justify-center">
              <Sparkles className="size-10 text-violet-300" />
            </div>
          </div>
          <span className="absolute bottom-0 right-0 size-6 rounded-full bg-emerald-500 border-2 border-zinc-950 flex items-center justify-center">
            <ShieldCheck className="size-3.5 text-black stroke-[3]" />
          </span>
        </div>

        <div className="text-center">
          <h2 className="text-xl font-semibold text-zinc-100">Administrator</h2>
          <p className="text-xs text-zinc-400 mt-0.5 font-mono">akhil@aspire-os</p>
        </div>

        <Button
          onClick={onUnlock}
          className="mt-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-full px-6 py-2 h-10 gap-2 shadow-xl shadow-violet-950 font-medium text-sm transition-all hover:scale-105"
        >
          <Lock className="size-4" />
          <span>Click to Unlock</span>
          <ArrowRight className="size-4 ml-1" />
        </Button>
      </div>

      {/* Bottom hint */}
      <div className="text-xs text-zinc-500 font-mono">
        AspireOS Kernel 4.19 • Protected by End-to-End Encryption
      </div>
    </div>
  );
}
