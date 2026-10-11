"use client";

import React from "react";
import { motion } from "framer-motion";
import { Minus, X, Maximize2, Minimize2 } from "lucide-react";
import { WindowState } from "./types";

interface WindowFrameProps {
  window: WindowState;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  children: React.ReactNode;
}

export function WindowFrame({
  window,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  children,
}: WindowFrameProps) {
  if (!window.isOpen || window.isMinimized) {
    return null;
  }

  const isMax = window.isMaximized;

  return (
    <motion.div
      drag={!isMax}
      dragMomentum={false}
      onMouseDown={onFocus}
      initial={{ opacity: 0, scale: 0.94, y: 20 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
        width: isMax ? "100%" : window.size.width,
        height: isMax ? "calc(100vh - 40px - 84px)" : window.size.height,
        top: isMax ? 40 : window.position.y,
        left: isMax ? 0 : window.position.x,
      }}
      exit={{ opacity: 0, scale: 0.92, y: 15 }}
      transition={{ type: "spring", damping: 26, stiffness: 280 }}
      style={{
        zIndex: window.zIndex,
        position: "absolute",
      }}
      className={`flex flex-col rounded-2xl overflow-hidden border border-zinc-700/60 bg-zinc-950/95 backdrop-blur-2xl shadow-2xl shadow-black/80 transition-shadow ${
        isMax ? "rounded-none border-x-0 border-t-0" : ""
      }`}
    >
      {/* Title Bar */}
      <div
        className="h-11 px-4 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between cursor-move select-none"
        onDoubleClick={onMaximize}
      >
        {/* Left window indicators */}
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="size-3.5 rounded-full bg-rose-500 hover:bg-rose-600 flex items-center justify-center text-white transition-all shadow-sm"
            title="Exit Window (Close)"
          >
            <X className="size-2.5 stroke-[3]" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMinimize();
            }}
            className="size-3.5 rounded-full bg-amber-500 hover:bg-amber-600 flex items-center justify-center text-amber-950 transition-all shadow-sm"
            title="Minimize Window"
          >
            <Minus className="size-2.5 stroke-[3]" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMaximize();
            }}
            className="size-3.5 rounded-full bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center text-emerald-950 transition-all shadow-sm"
            title={isMax ? "Restore Window" : "Maximize Window"}
          >
            {isMax ? (
              <Minimize2 className="size-2.5 stroke-[3]" />
            ) : (
              <Maximize2 className="size-2.5 stroke-[3]" />
            )}
          </button>
        </div>

        {/* Window Title in Center */}
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-200">
          <span className="truncate">{window.title}</span>
        </div>

        {/* Right Side: Clear, Dedicated Window Controls with EXIT button */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMinimize();
            }}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
            title="Minimize Window"
          >
            <Minus className="size-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMaximize();
            }}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
            title={isMax ? "Restore Window" : "Maximize Window"}
          >
            {isMax ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
          </button>

          {/* Prominent Red Exit Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="px-2.5 py-1 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 hover:border-rose-500 transition-all flex items-center gap-1.5 text-xs font-medium shadow-sm ml-1"
            title="Close / Exit this App"
          >
            <X className="size-3.5 stroke-[2.5]" />
            <span>Exit</span>
          </button>
        </div>
      </div>

      {/* Window Body */}
      <div className="flex-1 w-full overflow-hidden relative">{children}</div>
    </motion.div>
  );
}
