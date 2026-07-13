/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  LayoutDashboard,
  Database,
  Code,
  BookOpen,
  Brain,
  Sprout,
  GitBranch
} from "lucide-react";
import Dashboard from "./components/Dashboard.js";
import DataExplorer from "./components/DataExplorer.js";
import CodeSandbox from "./components/CodeSandbox.js";
import ReportViewer from "./components/ReportViewer.js";
import VivaQuiz from "./components/VivaQuiz.js";

export default function App() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "dataset" | "code" | "report" | "viva">("dashboard");

  const navigationItems = [
    { id: "dashboard", label: "Model Predictor & Benchmarks", icon: LayoutDashboard },
    { id: "dataset", label: "Dataset Explorer & EDA", icon: Database },
    { id: "code", label: "Colab / Streamlit Code Hub", icon: Code },
    { id: "report", label: "Academic Project Report", icon: BookOpen },
    { id: "viva", label: "Viva & Interview Prep", icon: Brain }
  ];

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#2D302E] flex flex-col font-sans transition-colors duration-300">
      {/* Premium Top Navigation Bar (Natural Tones adaptation) */}
      <header className="bg-[#E9E5D9] border-b border-stone-300/80 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-[#3F4233] rounded-xl text-[#F4F1EA] shadow-md">
              <Sprout className="w-6 h-6 text-[#A3B18A]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#6B705C]">
                Precision Agriculture ML System
              </span>
              <h1 className="text-xl md:text-2xl font-serif font-medium italic text-[#3F4233] tracking-tight">
                Crop Recommendation Portal
              </h1>
            </div>
          </div>

          {/* Metric Status Badges from the Design HTML */}
          <div className="flex gap-6 text-[10px] uppercase tracking-wider md:tracking-widest text-[#2D302E]">
            <div className="hidden sm:flex flex-col border-r border-stone-300/50 pr-4">
              <span className="text-stone-500 font-medium">Model Accuracy</span>
              <span className="font-extrabold text-[#3F4233]">99.4% (XGBoost)</span>
            </div>
            <div className="hidden sm:flex flex-col border-r border-stone-300/50 pr-4">
              <span className="text-stone-500 font-medium">Inference Latency</span>
              <span className="font-extrabold text-[#3F4233]">12ms</span>
            </div>
            <div className="flex flex-col">
              <span className="text-stone-500 font-medium">System Status</span>
              <span className="text-emerald-700 font-extrabold flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block animate-ping mr-1"></span>
                <span>Active</span>
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Framework Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 flex flex-col space-y-8">
        {/* Module Nav Toggles (Adapted to Stone colors & Natural Dark theme) */}
        <div className="bg-[#E9E5D9] rounded-2xl border border-stone-300/50 p-2 shadow-sm flex flex-wrap gap-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`flex items-center space-x-2 px-5 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#3F4233] text-white shadow-md font-bold"
                    : "text-[#6B705C] hover:text-[#2D302E] hover:bg-[#F4F1EA]/50"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-[#A3B18A]" : ""}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Section Contents */}
        <div className="flex-1 min-h-[500px] transition-all duration-300">
          {activeTab === "dashboard" && <Dashboard />}
          {activeTab === "dataset" && <DataExplorer />}
          {activeTab === "code" && <CodeSandbox />}
          {activeTab === "report" && <ReportViewer />}
          {activeTab === "viva" && <VivaQuiz />}
        </div>
      </main>

      {/* Humble Elegant Footer */}
      <footer className="bg-[#E9E5D9] border-t border-stone-300/60 py-6 mt-12 text-center text-xs text-[#6B705C] font-mono">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <span>Crop Recommendation System using Machine Learning © 2026</span>
          <div className="flex space-x-4 items-center">
            <span className="flex items-center space-x-1">
              <GitBranch className="w-3.5 h-3.5 text-[#3F4233]" />
              <span>production-release</span>
            </span>
            <span className="h-4 w-px bg-stone-300"></span>
            <span>Final Year Project Thesis Deliverable</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
