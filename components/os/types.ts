export type AppId =
  | 'flow'
  | 'telemetry'
  | 'copilot'
  | 'files'
  | 'tasks'
  | 'settings'
  | 'shield';

export type WallpaperId = 'aurora' | 'cyberpunk' | 'sunset' | 'quantum' | 'obsidian';

export interface AppDefinition {
  id: AppId;
  title: string;
  iconName: string;
  description: string;
  defaultWidth: number;
  defaultHeight: number;
  category: 'workflow' | 'system' | 'productivity' | 'ai' | 'security';
  badge?: string;
}

export interface WindowState {
  id: AppId;
  title: string;
  iconName: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  app: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'alert';
}

export interface TaskItem {
  id: string;
  title: string;
  category: 'Architecture' | 'AI Pipeline' | 'Security' | 'Frontend';
  priority: 'High' | 'Medium' | 'Urgent';
  completed: boolean;
  createdAt: string;
}

export interface ExecutionStepLog {
  nodeId: string;
  nodeName: string;
  status: 'pending' | 'running' | 'success' | 'failed' | 'skipped';
  durationMs: number;
  input: Record<string, any>;
  output: Record<string, any>;
  error?: string;
  timestamp: string;
}

export interface WorkflowExecutionRecord {
  id: string;
  workflowName: string;
  status: 'validating' | 'queued' | 'running' | 'succeeded' | 'failed' | 'cancelled';
  startedAt: string;
  completedAt?: string;
  totalDurationMs: number;
  steps: ExecutionStepLog[];
  triggeredBy: string;
}

export interface SecurityCheck {
  id: string;
  title: string;
  description: string;
  category: 'headers' | 'authentication' | 'secrets' | 'network';
  status: 'passed' | 'warning' | 'failed';
  details: string;
  remediation: string;
  lastChecked: string;
}
