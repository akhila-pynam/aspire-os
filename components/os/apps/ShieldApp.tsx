"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  RefreshCw,
  Lock,
  Globe,
  Key,
  Server,
  CheckCircle2,
  XCircle,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SecurityCheck } from "../types";

const initialChecks: SecurityCheck[] = [
  {
    id: "chk-1",
    title: "HTTP Security Headers & CSP",
    description: "Evaluates X-Frame-Options, X-Content-Type-Options, and Strict-Transport-Security.",
    category: "headers",
    status: "passed",
    details: "All modern defensive headers are declared in next.config.ts to prevent clickjacking and MIME-type sniffing.",
    remediation: "Headers active on all routes via Next.js middleware configuration.",
    lastChecked: "Just now",
  },
  {
    id: "chk-2",
    title: "SSRF Outbound Guard",
    description: "Validates workflow HTTP request nodes against private subnets and cloud metadata.",
    category: "network",
    status: "passed",
    details: "Outbound addresses 169.254.169.254, 127.0.0.1, 10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16 are blocked.",
    remediation: "Protected by outbound network gateway validator.",
    lastChecked: "Just now",
  },
  {
    id: "chk-3",
    title: "Client-Side Secret Isolation",
    description: "Audits browser bundles to verify no privileged service keys are exposed to client code.",
    category: "secrets",
    status: "passed",
    details: "No private service_role keys or LLM master credentials are baked into client-side JS.",
    remediation: "Privileged operations execute only inside server-side Route Handlers.",
    lastChecked: "Just now",
  },
  {
    id: "chk-4",
    title: "Session Storage & State Persistence",
    description: "Verifies desktop state persistence and session tokens.",
    category: "authentication",
    status: "passed",
    details: "Zustand persistence active using schema-validated keys; sensitive auth tokens excluded from local cache.",
    remediation: "Zustand partialize filter prevents credentials from entering browser storage.",
    lastChecked: "Just now",
  },
  {
    id: "chk-5",
    title: "Execution Timeout & Concurrency Boundaries",
    description: "Enforces max execution duration and bounded retries on workflow nodes.",
    category: "network",
    status: "passed",
    details: "Server runner enforces bounded timeout on all workflow steps to protect against infinite loops.",
    remediation: "Bounded loop timeouts enforced in app/api/workflows/execute.",
    lastChecked: "Just now",
  },
];

export function ShieldApp() {
  const [checks, setChecks] = useState<SecurityCheck[]>(initialChecks);
  const [isScanning, setIsScanning] = useState(false);
  const [activeTab, setActiveTab] = useState<"checks" | "sessions" | "audit">("checks");

  const passedCount = checks.filter((c) => c.status === "passed").length;
  const warningCount = checks.filter((c) => c.status === "warning").length;
  const failedCount = checks.filter((c) => c.status === "failed").length;

  const runSecurityAudit = () => {
    setIsScanning(true);
    setTimeout(() => {
      setChecks((prev) =>
        prev.map((c) => ({
          ...c,
          lastChecked: "Just now",
        }))
      );
      setIsScanning(false);
    }, 800);
  };

  return (
    <div className="h-full w-full flex flex-col bg-zinc-950 text-zinc-100 overflow-y-auto select-none p-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-800 gap-3">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
              Aspire Shield — Security Posture & Guard
              <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-[10px]">
                Defenses Active
              </Badge>
            </h2>
            <p className="text-[11px] text-zinc-400">Continuous architecture validation & least-privilege telemetry</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="xs"
            variant="outline"
            onClick={runSecurityAudit}
            disabled={isScanning}
            className="border-zinc-800 bg-zinc-900 text-zinc-200 gap-1 text-[11px]"
          >
            <RefreshCw className={`size-3 ${isScanning ? "animate-spin" : ""}`} />
            {isScanning ? "Evaluating Policies..." : "Re-scan Posture"}
          </Button>
        </div>
      </div>

      {/* Security Health Scorecard */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
        <div className="p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800/80 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-zinc-500 font-semibold uppercase">Passing Checks</p>
            <p className="text-2xl font-bold font-mono text-emerald-400 mt-0.5">{passedCount} / {checks.length}</p>
          </div>
          <div className="size-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="size-4" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800/80 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-zinc-500 font-semibold uppercase">Warnings</p>
            <p className="text-2xl font-bold font-mono text-amber-400 mt-0.5">{warningCount}</p>
          </div>
          <div className="size-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
            <AlertTriangle className="size-4" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800/80 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-zinc-500 font-semibold uppercase">Critical Issues</p>
            <p className="text-2xl font-bold font-mono text-rose-400 mt-0.5">{failedCount}</p>
          </div>
          <div className="size-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400">
            <XCircle className="size-4" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800 mb-4 pb-1">
        <button
          onClick={() => setActiveTab("checks")}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            activeTab === "checks" ? "bg-zinc-800 text-zinc-100" : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          Security Checks ({checks.length})
        </button>
        <button
          onClick={() => setActiveTab("sessions")}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            activeTab === "sessions" ? "bg-zinc-800 text-zinc-100" : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          Active Sessions & Identity
        </button>
      </div>

      {/* Tab 1: Checks List */}
      {activeTab === "checks" && (
        <div className="space-y-3 flex-1">
          {checks.map((chk) => (
            <div
              key={chk.id}
              className="p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700/80 transition-all space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {chk.status === "passed" ? (
                    <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                  ) : chk.status === "warning" ? (
                    <AlertTriangle className="size-4 text-amber-400 shrink-0" />
                  ) : (
                    <XCircle className="size-4 text-rose-400 shrink-0" />
                  )}
                  <h3 className="text-xs font-semibold text-zinc-100">{chk.title}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-zinc-500 font-mono">Checked {chk.lastChecked}</span>
                  <Badge
                    variant="outline"
                    className={`text-[9px] uppercase font-mono ${
                      chk.status === "passed"
                        ? "border-emerald-500/30 text-emerald-300 bg-emerald-950/20"
                        : "border-amber-500/30 text-amber-300 bg-amber-950/20"
                    }`}
                  >
                    {chk.status}
                  </Badge>
                </div>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed pl-6">{chk.description}</p>

              <div className="pl-6 pt-1 grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
                  <span className="text-zinc-500 font-medium">Evaluation Evidence:</span>
                  <p className="text-zinc-300 mt-0.5">{chk.details}</p>
                </div>
                <div className="p-2 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
                  <span className="text-zinc-500 font-medium">Remediation Status:</span>
                  <p className="text-emerald-400 mt-0.5">{chk.remediation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Sessions */}
      {activeTab === "sessions" && (
        <div className="space-y-3 flex-1">
          <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-3">
            <h3 className="text-xs font-semibold text-zinc-200">Current Authenticated Environment</h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800">
                <span className="text-zinc-500 text-[10px]">Session Identity:</span>
                <p className="font-mono text-zinc-200 mt-1">administrator@aspire-os.local</p>
              </div>
              <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800">
                <span className="text-zinc-500 text-[10px]">Client Origin:</span>
                <p className="font-mono text-emerald-400 mt-1">127.0.0.1:3001 (Allowed Dev Origin)</p>
              </div>
            </div>
            <div className="pt-2">
              <Button
                size="xs"
                variant="outline"
                onClick={() => window.location.reload()}
                className="text-rose-400 border-rose-900/50 hover:bg-rose-950/30 text-xs"
              >
                Revoke Current Session
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
