import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  AppId,
  WindowState,
  WallpaperId,
  TaskItem,
  WorkflowExecutionRecord,
} from "@/components/os/types";

const defaultWindows: Record<AppId, WindowState> = {
  flow: {
    id: "flow",
    title: "Aspire Flow Canvas — AI Pipeline Graph",
    iconName: "Zap",
    isOpen: true,
    isMinimized: false,
    isMaximized: false,
    zIndex: 10,
    position: { x: 60, y: 55 },
    size: { width: 920, height: 580 },
  },
  telemetry: {
    id: "telemetry",
    title: "System Telemetry & Activity Monitor",
    iconName: "Activity",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 9,
    position: { x: 130, y: 75 },
    size: { width: 840, height: 560 },
  },
  copilot: {
    id: "copilot",
    title: "Neural Copilot & Interactive Terminal",
    iconName: "Terminal",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 8,
    position: { x: 170, y: 95 },
    size: { width: 760, height: 520 },
  },
  files: {
    id: "files",
    title: "Cloud Storage & Virtual Filesystem",
    iconName: "Folder",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 7,
    position: { x: 210, y: 110 },
    size: { width: 780, height: 500 },
  },
  tasks: {
    id: "tasks",
    title: "Sprint Task Matrix & Engineering Roadmap",
    iconName: "CheckSquare",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 6,
    position: { x: 240, y: 120 },
    size: { width: 740, height: 520 },
  },
  settings: {
    id: "settings",
    title: "AspireOS System Preferences",
    iconName: "SlidersHorizontal",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 5,
    position: { x: 280, y: 130 },
    size: { width: 680, height: 540 },
  },
  shield: {
    id: "shield",
    title: "Aspire Shield — Security Center & Audit",
    iconName: "Shield",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 11,
    position: { x: 190, y: 80 },
    size: { width: 800, height: 560 },
  },
};

const initialTasks: TaskItem[] = [
  {
    id: "t-1",
    title: "Enforce Content-Security-Policy & anti-clickjacking headers",
    category: "Security",
    priority: "Urgent",
    completed: true,
    createdAt: "2026-10-11",
  },
  {
    id: "t-2",
    title: "Implement SSRF-safe outbound request validation for HTTP nodes",
    category: "Security",
    priority: "Urgent",
    completed: true,
    createdAt: "2026-10-11",
  },
  {
    id: "t-3",
    title: "Migrate in-memory OS window state to persistent Zustand store",
    category: "Architecture",
    priority: "High",
    completed: true,
    createdAt: "2026-10-11",
  },
  {
    id: "t-4",
    title: "Construct Aspire Command Intelligence global palette (Ctrl+K)",
    category: "Frontend",
    priority: "High",
    completed: false,
    createdAt: "2026-10-11",
  },
  {
    id: "t-5",
    title: "Build server-side workflow execution engine with step logging",
    category: "AI Pipeline",
    priority: "Urgent",
    completed: false,
    createdAt: "2026-10-11",
  },
];

interface OSStoreState {
  // Window states
  windows: Record<AppId, WindowState>;
  activeApp: AppId | null;
  highestZ: number;

  // Desktop Appearance
  wallpaper: WallpaperId;
  accentColor: string;

  // Session & Security
  isLocked: boolean;
  isCommandPaletteOpen: boolean;

  // Applications Data
  tasks: TaskItem[];
  executions: WorkflowExecutionRecord[];

  // Actions
  openApp: (id: AppId) => void;
  closeWindow: (id: AppId) => void;
  minimizeWindow: (id: AppId) => void;
  maximizeWindow: (id: AppId) => void;
  focusWindow: (id: AppId) => void;
  setWallpaper: (id: WallpaperId) => void;
  setAccentColor: (color: string) => void;
  setIsLocked: (locked: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;

  // Tasks actions
  addTask: (task: Omit<TaskItem, "id" | "createdAt">) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;

  // Execution actions
  recordExecution: (exec: WorkflowExecutionRecord) => void;
}

export const useOSStore = create<OSStoreState>()(
  persist(
    (set, get) => ({
      windows: defaultWindows,
      activeApp: "flow",
      highestZ: 15,
      wallpaper: "aurora",
      accentColor: "violet",
      isLocked: false,
      isCommandPaletteOpen: false,
      tasks: initialTasks,
      executions: [],

      openApp: (id: AppId) => {
        const state = get();
        const win = state.windows[id];
        const nextZ = state.highestZ + 1;

        if (!win.isOpen) {
          set({
            highestZ: nextZ,
            activeApp: id,
            windows: {
              ...state.windows,
              [id]: {
                ...win,
                isOpen: true,
                isMinimized: false,
                zIndex: nextZ,
              },
            },
          });
        } else if (win.isMinimized) {
          set({
            highestZ: nextZ,
            activeApp: id,
            windows: {
              ...state.windows,
              [id]: {
                ...win,
                isMinimized: false,
                zIndex: nextZ,
              },
            },
          });
        } else if (state.activeApp === id) {
          set({
            activeApp: null,
            windows: {
              ...state.windows,
              [id]: {
                ...win,
                isMinimized: true,
              },
            },
          });
        } else {
          set({
            highestZ: nextZ,
            activeApp: id,
            windows: {
              ...state.windows,
              [id]: {
                ...win,
                zIndex: nextZ,
              },
            },
          });
        }
      },

      closeWindow: (id: AppId) => {
        const state = get();
        set({
          activeApp: state.activeApp === id ? null : state.activeApp,
          windows: {
            ...state.windows,
            [id]: {
              ...state.windows[id],
              isOpen: false,
            },
          },
        });
      },

      minimizeWindow: (id: AppId) => {
        const state = get();
        set({
          activeApp: state.activeApp === id ? null : state.activeApp,
          windows: {
            ...state.windows,
            [id]: {
              ...state.windows[id],
              isMinimized: true,
            },
          },
        });
      },

      maximizeWindow: (id: AppId) => {
        const state = get();
        set({
          windows: {
            ...state.windows,
            [id]: {
              ...state.windows[id],
              isMaximized: !state.windows[id].isMaximized,
            },
          },
        });
      },

      focusWindow: (id: AppId) => {
        const state = get();
        const nextZ = state.highestZ + 1;
        set({
          highestZ: nextZ,
          activeApp: id,
          windows: {
            ...state.windows,
            [id]: {
              ...state.windows[id],
              isMinimized: false,
              zIndex: nextZ,
            },
          },
        });
      },

      setWallpaper: (wallpaper: WallpaperId) => set({ wallpaper }),
      setAccentColor: (accentColor: string) => set({ accentColor }),
      setIsLocked: (isLocked: boolean) => set({ isLocked }),
      setCommandPaletteOpen: (isCommandPaletteOpen: boolean) =>
        set({ isCommandPaletteOpen }),

      addTask: (newTask) => {
        const item: TaskItem = {
          ...newTask,
          id: `task-${Date.now()}`,
          createdAt: new Date().toISOString().split("T")[0],
        };
        set((state) => ({ tasks: [item, ...state.tasks] }));
      },

      toggleTask: (id: string) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t
          ),
        }));
      },

      deleteTask: (id: string) => {
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        }));
      },

      recordExecution: (exec: WorkflowExecutionRecord) => {
        set((state) => ({
          executions: [exec, ...state.executions.slice(0, 19)],
        }));
      },
    }),
    {
      name: "aspire_os_v1_store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        windows: state.windows,
        wallpaper: state.wallpaper,
        accentColor: state.accentColor,
        tasks: state.tasks,
        executions: state.executions,
      }),
    }
  )
);
