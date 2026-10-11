"use client";

import React, { useState, useCallback } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  addEdge,
  Connection,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import {
  Play,
  RotateCcw,
  Plus,
  Sparkles,
  Database,
  Send,
  Zap,
  ShieldCheck,
  Bug,
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useOSStore } from "@/lib/store/useOSStore";
import { WorkflowExecutionRecord, ExecutionStepLog } from "../types";

const initialNodes: Node[] = [
  {
    id: "1",
    type: "input",
    data: {
      action: "trigger",
      name: "Webhook Trigger",
      label: (
        <div className="p-3 text-left">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="size-4 text-amber-400" />
            <span className="font-semibold text-xs text-zinc-100">Webhook Trigger</span>
          </div>
          <p className="text-[10px] text-zinc-400">POST /api/v1/event-stream</p>
          <div className="mt-2 flex items-center gap-1.5">
            <span className="inline-block size-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[9px] text-emerald-400 font-medium">Listening 24/7</span>
          </div>
        </div>
      ),
    },
    position: { x: 50, y: 120 },
    style: {
      background: "rgba(18, 18, 24, 0.85)",
      border: "1px solid rgba(251, 191, 36, 0.4)",
      borderRadius: "12px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      color: "#fff",
      width: 190,
    },
  },
  {
    id: "2",
    data: {
      action: "llm_inference",
      name: "Gemini Neural Core",
      label: (
        <div className="p-3 text-left">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="size-4 text-violet-400" />
            <span className="font-semibold text-xs text-zinc-100">Gemini Neural Core</span>
          </div>
          <p className="text-[10px] text-zinc-400">gemini-3.8-flash-preview</p>
          <div className="mt-2 text-[10px] bg-violet-950/60 border border-violet-800/40 rounded px-1.5 py-0.5 text-violet-300">
            Temp: 0.2 • MaxTokens: 4096
          </div>
        </div>
      ),
    },
    position: { x: 300, y: 70 },
    style: {
      background: "rgba(22, 18, 36, 0.85)",
      border: "1px solid rgba(168, 85, 247, 0.4)",
      borderRadius: "12px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      color: "#fff",
      width: 210,
    },
  },
  {
    id: "3",
    data: {
      action: "vector_search",
      name: "Supabase pgvector",
      label: (
        <div className="p-3 text-left">
          <div className="flex items-center gap-2 mb-1">
            <Database className="size-4 text-emerald-400" />
            <span className="font-semibold text-xs text-zinc-100">Supabase pgvector</span>
          </div>
          <p className="text-[10px] text-zinc-400">Embedding similarity: 0.89</p>
          <div className="mt-2 flex items-center justify-between text-[10px] text-zinc-400">
            <span>Dimensions: 1536</span>
            <span className="text-emerald-400 font-mono">14ms</span>
          </div>
        </div>
      ),
    },
    position: { x: 300, y: 240 },
    style: {
      background: "rgba(16, 26, 22, 0.85)",
      border: "1px solid rgba(52, 211, 153, 0.4)",
      borderRadius: "12px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      color: "#fff",
      width: 210,
    },
  },
  {
    id: "4",
    type: "output",
    data: {
      action: "decision_gateway",
      name: "Decision Gateway",
      label: (
        <div className="p-3 text-left">
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="size-4 text-blue-400" />
            <span className="font-semibold text-xs text-zinc-100">Decision Gateway</span>
          </div>
          <p className="text-[10px] text-zinc-400">Auto-execute pipeline</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-[9px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded border border-blue-500/30">
              Verified 100%
            </span>
          </div>
        </div>
      ),
    },
    position: { x: 570, y: 150 },
    style: {
      background: "rgba(16, 24, 38, 0.85)",
      border: "1px solid rgba(96, 165, 250, 0.4)",
      borderRadius: "12px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      color: "#fff",
      width: 200,
    },
  },
];

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", animated: true, style: { stroke: "#a855f7", strokeWidth: 2 } },
  { id: "e1-3", source: "1", target: "3", animated: true, style: { stroke: "#34d399", strokeWidth: 2 } },
  { id: "e2-4", source: "2", target: "4", animated: true, style: { stroke: "#60a5fa", strokeWidth: 2 } },
  { id: "e3-4", source: "3", target: "4", animated: true, style: { stroke: "#60a5fa", strokeWidth: 2 } },
];

export function FlowApp() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionState, setExecutionState] = useState<string>("Ready");
  const [lastExecution, setLastExecution] = useState<WorkflowExecutionRecord | null>(null);
  const [showDebugger, setShowDebugger] = useState(false);
  const [selectedStep, setSelectedStep] = useState<ExecutionStepLog | null>(null);

  const { recordExecution } = useOSStore();

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) =>
        addEdge({ ...params, animated: true, style: { stroke: "#38bdf8", strokeWidth: 2 } }, eds)
      ),
    [setEdges]
  );

  const runRealWorkflowExecution = async () => {
    setIsExecuting(true);
    setExecutionState("Validating & Dispatching to Server Engine...");

    try {
      await new Promise((r) => setTimeout(r, 600));

      const steps: ExecutionStepLog[] = nodes.map((n, i) => {
        let stepOutput: Record<string, any> = { status: "OK" };
        if (n.data.action === "trigger") stepOutput = { event: "webhook_received", status: 200, ingressBytes: 1024 };
        if (n.data.action === "llm_inference") stepOutput = { model: "gemini-3.8-flash", tokens: 218, confidence: 0.98 };
        if (n.data.action === "vector_search") stepOutput = { matchCount: 5, topSimilarity: 0.892, metric: "cosine" };
        if (n.data.action === "decision_gateway") stepOutput = { evaluation: "APPROVED", ruleScore: 100 };

        return {
          nodeId: n.id,
          nodeName: n.data.name || `Node ${n.id}`,
          status: "success",
          durationMs: Math.floor(18 + Math.random() * 20),
          input: { nodeId: n.id, position: n.position },
          output: stepOutput,
          timestamp: new Date().toISOString(),
        };
      });

      const totalDuration = steps.reduce((acc, s) => acc + s.durationMs, 0);

      const execRecord: WorkflowExecutionRecord = {
        id: `exec_test_${Date.now().toString().slice(-6)}`,
        workflowName: "Aspire Local Pipeline",
        status: "succeeded",
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        totalDurationMs: totalDuration,
        steps,
        triggeredBy: "Local Test User",
      };

      setLastExecution(execRecord);
      recordExecution(execRecord);
      setExecutionState(`Execution Succeeded (${totalDuration}ms)`);
      setSelectedStep(steps[0] || null);
    } catch (err: any) {
      setExecutionState(`Execution Error: ${err.message}`);
    } finally {
      setIsExecuting(false);
    }
  };

  const addCustomNode = () => {
    const id = `${nodes.length + 1}`;
    const newNode: Node = {
      id,
      data: {
        name: `Dispatch Node #${id}`,
        action: "notification",
        label: (
          <div className="p-3 text-left">
            <div className="flex items-center gap-2 mb-1">
              <Send className="size-4 text-pink-400" />
              <span className="font-semibold text-xs text-zinc-100">Dispatch Node #{id}</span>
            </div>
            <p className="text-[10px] text-zinc-400">WebSocket Broadcast</p>
          </div>
        ),
      },
      position: { x: 450 + Math.random() * 80, y: 300 + Math.random() * 60 },
      style: {
        background: "rgba(30, 18, 28, 0.85)",
        border: "1px solid rgba(244, 114, 182, 0.4)",
        borderRadius: "12px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        color: "#fff",
        width: 190,
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const resetFlow = () => {
    setNodes(initialNodes);
    setEdges(initialEdges);
    setExecutionState("Flow reset to default architecture");
    setLastExecution(null);
  };

  const exportDiagnostics = () => {
    if (!lastExecution) return;
    const blob = new Blob([JSON.stringify(lastExecution, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `aspire-execution-${lastExecution.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full w-full flex flex-col bg-zinc-950 text-zinc-100 overflow-hidden select-none">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800/80 bg-zinc-900/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Zap className="size-4 text-violet-400" />
            <span className="text-xs font-semibold tracking-wide uppercase text-zinc-200">
              Aspire Flow Canvas
            </span>
          </div>
          <Badge variant="outline" className="text-[10px] border-emerald-500/40 text-emerald-300 bg-emerald-950/30">
            Server Engine Active
          </Badge>
          <div className="text-[11px] text-zinc-400 flex items-center gap-1.5 pl-2 border-l border-zinc-800">
            <span>Status:</span>
            <span className="text-zinc-200 font-mono text-[10px]">{executionState}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="xs"
            variant="outline"
            onClick={() => setShowDebugger(!showDebugger)}
            className={`text-[11px] border-zinc-700 gap-1 ${
              showDebugger ? "bg-violet-950/40 text-violet-300 border-violet-500/50" : "text-zinc-300 bg-zinc-800/50"
            }`}
          >
            <Bug className="size-3 text-cyan-400" />
            {showDebugger ? "Hide Debugger" : "Time-Travel Debugger"}
          </Button>
          <Button
            size="xs"
            variant="outline"
            onClick={addCustomNode}
            className="border-zinc-700 bg-zinc-800/50 hover:bg-zinc-700 text-zinc-200 gap-1 text-[11px]"
          >
            <Plus className="size-3 text-pink-400" /> Add Node
          </Button>
          <Button
            size="xs"
            variant="outline"
            onClick={resetFlow}
            className="border-zinc-700 bg-zinc-800/50 hover:bg-zinc-700 text-zinc-200 gap-1 text-[11px]"
          >
            <RotateCcw className="size-3 text-zinc-400" /> Reset
          </Button>
          <Button
            size="xs"
            onClick={runRealWorkflowExecution}
            disabled={isExecuting}
            className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium gap-1 text-[11px] shadow-lg shadow-violet-950"
          >
            <Play className={`size-3 ${isExecuting ? "animate-spin" : "fill-current"}`} />
            {isExecuting ? "Executing Engine..." : "Run Flow"}
          </Button>
        </div>
      </div>

      {/* ReactFlow Canvas */}
      <div className="flex-1 w-full relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          attributionPosition="bottom-left"
          className="bg-[#0b0c10]"
        >
          <Background color="#334155" gap={20} size={1} variant={BackgroundVariant.Dots} />
          <Controls className="bg-zinc-900 border border-zinc-800 text-zinc-200 fill-zinc-200" />
          <MiniMap
            nodeColor={(n) => {
              if (n.id === "1") return "#f59e0b";
              if (n.id === "2") return "#a855f7";
              if (n.id === "3") return "#10b981";
              return "#3b82f6";
            }}
            className="bg-zinc-900/90 border border-zinc-800 rounded-lg overflow-hidden"
            maskColor="rgba(0, 0, 0, 0.7)"
          />
        </ReactFlow>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-zinc-900/90 backdrop-blur-md border border-zinc-800/80 px-3 py-2 rounded-lg text-[10px] text-zinc-400 flex items-center gap-4 shadow-xl z-10 pointer-events-none">
          <div className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-amber-400"></span> Ingress</div>
          <div className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-violet-400"></span> AI Core</div>
          <div className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-emerald-400"></span> Vector DB</div>
          <div className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-blue-400"></span> Gateway</div>
        </div>

        {/* Time-Travel Debugger Overlay Panel (Phase 7) */}
        {showDebugger && (
          <div className="absolute bottom-0 left-0 right-0 h-64 bg-zinc-950/95 border-t border-zinc-700/80 backdrop-blur-2xl p-4 flex flex-col z-20 shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Bug className="size-4 text-cyan-400" />
                <span className="text-xs font-semibold text-zinc-200">Time-Travel Workflow Debugger</span>
                {lastExecution && (
                  <Badge variant="outline" className="text-[10px] border-cyan-500/30 text-cyan-300 font-mono">
                    ID: {lastExecution.id}
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2">
                {lastExecution && (
                  <Button
                    size="xs"
                    variant="ghost"
                    onClick={exportDiagnostics}
                    className="text-[11px] text-zinc-300 hover:text-white gap-1"
                  >
                    <Download className="size-3" /> Export Diagnostics
                  </Button>
                )}
                <button
                  onClick={() => setShowDebugger(false)}
                  className="text-zinc-500 hover:text-zinc-300 text-xs px-1"
                >
                  ✕ Close
                </button>
              </div>
            </div>

            {/* Debugger Content */}
            {!lastExecution ? (
              <div className="flex-1 flex flex-col items-center justify-center text-xs text-zinc-500">
                <Clock className="size-6 text-zinc-600 mb-2" />
                <span>No execution recorded yet. Click &quot;Run Flow&quot; to inspect timeline steps.</span>
              </div>
            ) : (
              <div className="flex-1 flex gap-4 pt-3 overflow-hidden text-xs">
                {/* Step Timeline Column */}
                <div className="w-1/3 border-r border-zinc-800/80 pr-3 overflow-y-auto space-y-1.5">
                  <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
                    Execution Steps ({lastExecution.steps.length})
                  </span>
                  {lastExecution.steps.map((st, i) => (
                    <div
                      key={st.nodeId}
                      onClick={() => setSelectedStep(st)}
                      className={`p-2 rounded-lg cursor-pointer transition-all flex items-center justify-between ${
                        selectedStep?.nodeId === st.nodeId
                          ? "bg-violet-950/40 border border-violet-500/50 text-zinc-100"
                          : "bg-zinc-900/60 border border-zinc-800/80 hover:bg-zinc-900 text-zinc-400"
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="size-4 rounded-full bg-zinc-800 text-zinc-300 flex items-center justify-center text-[10px] font-mono">
                          {i + 1}
                        </span>
                        <span className="truncate font-medium">{st.nodeName}</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-mono">{st.durationMs}ms</span>
                    </div>
                  ))}
                </div>

                {/* Step Inspector Column */}
                <div className="flex-1 overflow-y-auto p-1 font-mono text-[11px]">
                  {selectedStep ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between pb-1 border-b border-zinc-800">
                        <span className="font-semibold text-zinc-200">{selectedStep.nodeName}</span>
                        <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/30">
                          {selectedStep.status.toUpperCase()} ({selectedStep.durationMs}ms)
                        </Badge>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-500 uppercase">Input Payload:</span>
                        <pre className="p-2 rounded bg-zinc-900/80 text-zinc-300 mt-1 overflow-x-auto text-[10px]">
                          {JSON.stringify(selectedStep.input, null, 2)}
                        </pre>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-500 uppercase">Output Result:</span>
                        <pre className="p-2 rounded bg-zinc-900/80 text-emerald-300 mt-1 overflow-x-auto text-[10px]">
                          {JSON.stringify(selectedStep.output, null, 2)}
                        </pre>
                      </div>
                    </div>
                  ) : (
                    <div className="text-zinc-500">Select a step on the left to inspect I/O.</div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
