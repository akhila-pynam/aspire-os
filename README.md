# ⚡ AspireOS (Preview & Client Test Edition)

> **Modern Autonomous Web Operating System & AI Workflow Studio — Client Preview**

Welcome to the public test edition of **AspireOS**! This repository contains the complete interactive web desktop environment designed for local testing and evaluation.

---

## 🌟 What You Can Test in This Edition

- **🖥️ Virtual Desktop & Window Manager**:
  - Multi-window management powered by **Framer Motion** (drag, maximize, minimize, and restore).
  - Dedicated top-right **`[ ✕ Exit ]`** button on every window + macOS traffic light controls.
  - Floating bottom glassmorphic dock with spring magnification on cursor hover.
  - System top bar with dynamic status pill, quick exit button, live digital clock, and notification center.
  - Dynamic wallpaper engine (Aurora Borealis, Neon Horizon, Solar Gradient, Quantum Deep, Obsidian Slate).
  - Lock Screen security display with one-click unlock.

- **⚡ Aspire Flow Canvas (`reactflow`)**:
  - Interactive visual node-graph pipeline builder.
  - Drag and connect nodes (Webhook Ingress, Gemini Neural Core, Supabase pgvector, Decision Gateway).
  - Built-in **Time-Travel Workflow Debugger** with step-by-step I/O payload inspection and diagnostic JSON export.

- **📊 System Telemetry Studio (`recharts`)**:
  - Real-time animated Area and Bar charts.
  - Dynamic host load gauges and V8 heap memory visualization.

- **🤖 Neural Copilot & Terminal**:
  - Interactive zsh-styled shell with built-in commands (`help`, `neofetch`, `status`, `flow run`, `clear`).
  - Conversational AI prompt interface.

- **🔍 Aspire Command Intelligence (<kbd>Ctrl+K</kbd> / <kbd>Cmd+K</kbd>)**:
  - Universal command palette to search, launch applications, or trigger actions from anywhere on the desktop.

- **📝 Sprint Task Matrix**:
  - Interactive project task planner with priority badges, completion toggles, and live progress percentage.
  - **Persistent local storage**: Tasks and desktop layouts are automatically preserved across page reloads using Zustand.

- **📁 Storage & Virtual Filesystem**:
  - File browser with functional file upload, download, and deletion simulation.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4 + tw-animate-css + Shadcn UI (`base-nova`)
- **Motion Engine**: Framer Motion 12
- **Graph Builder**: React Flow 11
- **Charts**: Recharts 3
- **State Management**: Zustand 5 with `persist` middleware

---

## 🚀 Quickstart: Run & Test Locally

### 1. Clone the repository
```bash
git clone https://github.com/akhila-pynam/AspireOS.git
cd AspireOS
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the development server
```bash
npm run dev
# or: bun dev
```

### 4. Open in your browser
Navigate to [http://localhost:3000](http://localhost:3000) (or the port displayed in your terminal).

---

## 🔒 Architecture Note

This repository contains the **client-side UI shell and interactive desktop environment** for local testing, demonstration, and evaluation. Core server orchestration engines, private backend microservices, and internal agent pipelines remain proprietary.

---

## 📄 License
MIT © [Akhila Pynam](https://github.com/akhila-pynam)
