"use client";

import dynamic from "next/dynamic";

const Desktop = dynamic(
  () => import("@/components/os/Desktop").then((mod) => mod.Desktop),
  {
    ssr: false,
    loading: () => (
      <div className="h-screen w-screen bg-[#07090e] flex flex-col items-center justify-center text-zinc-100 select-none">
        <div className="size-16 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 p-0.5 shadow-2xl shadow-violet-900/50 mb-4 animate-pulse">
          <div className="size-full rounded-2xl bg-zinc-950 flex items-center justify-center">
            <span className="text-xl font-bold text-violet-400">⚡</span>
          </div>
        </div>
        <h1 className="text-lg font-semibold tracking-wide text-zinc-100">AspireOS</h1>
        <p className="text-xs text-zinc-500 font-mono mt-1">Booting Neural Subsystem...</p>
      </div>
    ),
  }
);

export default function Home() {
  return (
    <main className="h-screen w-screen overflow-hidden">
      <Desktop />
    </main>
  );
}
