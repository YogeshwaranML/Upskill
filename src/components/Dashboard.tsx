/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import {
  Sparkles,
  Droplet,
  Thermometer,
  Percent,
  Sliders,
  Send,
  Loader2,
  RefreshCw,
  Cpu,
  BarChart,
  MessageSquare,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export default function Dashboard() {
  // Navigation inside Dashboard
  const [activeSubTab, setActiveSubTab] = useState<"predict" | "train" | "chat">("predict");

  // Predictor Inputs
  const [n, setN] = useState<number>(80);
  const [p, setP] = useState<number>(45);
  const [k, setK] = useState<number>(40);
  const [temperature, setTemperature] = useState<number>(24.2);
  const [humidity, setHumidity] = useState<number>(82.5);
  const [pH, setPH] = useState<number>(6.5);
  const [rainfall, setRainfall] = useState<number>(160.0);

  // Prediction Outputs
  const [loadingPrediction, setLoadingPrediction] = useState(false);
  const [predictionResult, setPredictionResult] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Presets
  const presets = [
    { name: "Clayey Rice Land", N: 85, P: 50, K: 40, temp: 24, hum: 83, ph: 6.2, rain: 240 },
    { name: "Arid Sandy Loam", N: 20, P: 45, K: 20, temp: 28, hum: 55, ph: 6.8, rain: 50 },
    { name: "High-Potassium Orchard", N: 25, P: 130, K: 200, temp: 23, hum: 85, ph: 6.0, rain: 75 },
    { name: "Optimal Tropical (Banana)", N: 100, P: 80, K: 50, temp: 27, hum: 81, ph: 5.9, rain: 105 },
    { name: "Dry Legume Pulse", N: 40, P: 65, K: 80, temp: 19, hum: 18, ph: 7.2, rain: 82 }
  ];

  const applyPreset = (preset: any) => {
    setN(preset.N);
    setP(preset.P);
    setK(preset.K);
    setTemperature(preset.temp);
    setHumidity(preset.hum);
    setPH(preset.ph);
    setRainfall(preset.rain);
  };

  // Run Crop Recommendation
  const handlePredict = async () => {
    setLoadingPrediction(true);
    setErrorMsg("");
    setPredictionResult(null);

    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          N: n,
          P: p,
          K: k,
          temperature,
          humidity,
          pH,
          rainfall
        })
      });

      if (!response.ok) {
        throw new Error("Prediction API call failed. Please make sure the backend is running.");
      }

      const data = await response.json();
      setPredictionResult(data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An error occurred.");
    } finally {
      setLoadingPrediction(false);
    }
  };

  // ML Training States
  const [knnK, setKnnK] = useState(5);
  const [dtDepth, setDtDepth] = useState(6);
  const [rfTrees, setRfTrees] = useState(10);
  const [rfDepth, setRfDepth] = useState(6);
  const [trainingLoading, setTrainingLoading] = useState(false);
  const [trainResults, setTrainResults] = useState<any | null>(null);

  const handleTrain = async () => {
    setTrainingLoading(true);
    try {
      const response = await fetch("/api/train", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          knnK,
          dtDepth,
          rfTrees,
          rfDepth
        })
      });

      if (!response.ok) throw new Error("Training request failed");
      const data = await response.json();
      setTrainResults(data.results);
    } catch (err) {
      console.error(err);
    } finally {
      setTrainingLoading(false);
    }
  };

  // Initialize training on load
  useEffect(() => {
    handleTrain();
  }, []);

  // Agronomist Chat States
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    {
      role: "assistant",
      content: "Hello! I am your AI Agronomist chatbot. Ask me any questions about crop care, fertilizer calculations, soil organic carbon, or the machine learning engineering behind this project!"
    }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!chatInput.trim() || chatLoading) return;

    const userMessage = chatInput;
    setChatInput("");
    const updatedMessages = [...chatMessages, { role: "user" as const, content: userMessage }];
    setChatMessages(updatedMessages);
    setChatLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages })
      });

      if (!response.ok) throw new Error("Chat request failed");
      const data = await response.json();
      setChatMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
    } catch (err: any) {
      setChatMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "**[AI Offline]** Gemini API is not connected. However, as an expert agronomist, I remind you that a healthy soil structure needs balanced composting and microclimate vigilance."
        }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Tab Selectors */}
      <div className="flex border-b border-stone-300/80 pb-3 justify-between items-center">
        <div className="flex space-x-6">
          <button
            onClick={() => setActiveSubTab("predict")}
            className={`pb-3 text-sm font-semibold transition-all relative ${
              activeSubTab === "predict"
                ? "text-[#3F4233] font-extrabold border-b-2 border-[#3F4233]"
                : "text-[#6B705C] hover:text-[#2D302E]"
            }`}
          >
            Crop Recommend Engine
          </button>
          <button
            onClick={() => setActiveSubTab("train")}
            className={`pb-3 text-sm font-semibold transition-all relative ${
              activeSubTab === "train"
                ? "text-[#3F4233] font-extrabold border-b-2 border-[#3F4233]"
                : "text-[#6B705C] hover:text-[#2D302E]"
            }`}
          >
            ML Model Benchmarking
          </button>
          <button
            onClick={() => setActiveSubTab("chat")}
            className={`pb-3 text-sm font-semibold transition-all relative flex items-center space-x-1.5 ${
              activeSubTab === "chat"
                ? "text-[#3F4233] font-extrabold border-b-2 border-[#3F4233]"
                : "text-[#6B705C] hover:text-[#2D302E]"
            }`}
          >
            <MessageSquare className="w-4 h-4 text-[#A3B18A]" />
            <span>AI Agronomist Chat</span>
          </button>
        </div>
      </div>

      {activeSubTab === "predict" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Inputs Section (Stony Container styling from Design HTML) */}
          <div className="lg:col-span-5 bg-[#E9E5D9] rounded-2xl border border-stone-300/60 p-6 shadow-sm space-y-6">
            <div className="space-y-1">
              <h3 className="font-bold text-[#3F4233] text-lg flex items-center space-x-2">
                <Sliders className="w-5 h-5 text-[#6B705C]" />
                <span>Agricultural Parameters</span>
              </h3>
              <p className="text-xs text-[#6B705C]">
                Set nutrient ranges and local seasonal metrics or click a quick soil preset.
              </p>
            </div>

            {/* Presets List */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-[#6B705C] uppercase tracking-wider block">Quick Presets</span>
              <div className="flex flex-wrap gap-2">
                {presets.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => applyPreset(preset)}
                    className="bg-[#F4F1EA] hover:bg-[#3F4233] hover:text-[#F4F1EA] hover:border-[#3F4233] text-[#2D302E] text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-stone-300/80 transition cursor-pointer"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Parameter Sliders */}
            <div className="space-y-5 font-sans">
              {/* Nitrogen */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-[#2D302E] flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#A3B18A] block"></span>
                    <span>Nitrogen (N)</span>
                  </span>
                  <span className="text-[#6B705C] font-mono text-[11px] font-bold">{n} kg/ha</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="140"
                  value={n}
                  onChange={(e) => setN(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-stone-300 rounded-lg appearance-none cursor-pointer accent-[#3F4233]"
                />
              </div>

              {/* Phosphorus */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-[#2D302E] flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#A3B18A] block"></span>
                    <span>Phosphorus (P)</span>
                  </span>
                  <span className="text-[#6B705C] font-mono text-[11px] font-bold">{p} kg/ha</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="145"
                  value={p}
                  onChange={(e) => setP(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-stone-300 rounded-lg appearance-none cursor-pointer accent-[#3F4233]"
                />
              </div>

              {/* Potassium */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-[#2D302E] flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#A3B18A] block"></span>
                    <span>Potassium (K)</span>
                  </span>
                  <span className="text-[#6B705C] font-mono text-[11px] font-bold">{k} kg/ha</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="205"
                  value={k}
                  onChange={(e) => setK(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-stone-300 rounded-lg appearance-none cursor-pointer accent-[#3F4233]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Temp */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#2D302E] flex items-center space-x-1">
                    <Thermometer className="w-3.5 h-3.5 text-[#3F4233]" />
                    <span>Temp (°C)</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="10"
                    max="45"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full rounded-xl border border-stone-300/80 p-2.5 text-xs focus:ring-1 focus:ring-[#3F4233] bg-[#F4F1EA] text-[#2D302E] font-medium"
                  />
                </div>

                {/* Humidity */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#2D302E] flex items-center space-x-1">
                    <Percent className="w-3.5 h-3.5 text-[#3F4233]" />
                    <span>Humidity (%)</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="10"
                    max="100"
                    value={humidity}
                    onChange={(e) => setHumidity(parseFloat(e.target.value))}
                    className="w-full rounded-xl border border-stone-300/80 p-2.5 text-xs focus:ring-1 focus:ring-[#3F4233] bg-[#F4F1EA] text-[#2D302E] font-medium"
                  />
                </div>

                {/* pH */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#2D302E] flex items-center space-x-1">
                    <Sliders className="w-3.5 h-3.5 text-[#3F4233]" />
                    <span>Soil pH</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="3.5"
                    max="9.0"
                    value={pH}
                    onChange={(e) => setPH(parseFloat(e.target.value))}
                    className="w-full rounded-xl border border-stone-300/80 p-2.5 text-xs focus:ring-1 focus:ring-[#3F4233] bg-[#F4F1EA] text-[#2D302E] font-medium"
                  />
                </div>

                {/* Rainfall */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#2D302E] flex items-center space-x-1">
                    <Droplet className="w-3.5 h-3.5 text-[#3F4233]" />
                    <span>Rainfall (mm)</span>
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="20"
                    max="300"
                    value={rainfall}
                    onChange={(e) => setRainfall(parseFloat(e.target.value))}
                    className="w-full rounded-xl border border-stone-300/80 p-2.5 text-xs focus:ring-1 focus:ring-[#3F4233] bg-[#F4F1EA] text-[#2D302E] font-medium"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handlePredict}
              disabled={loadingPrediction}
              className="w-full flex items-center justify-center space-x-2 bg-[#3F4233] hover:bg-[#2D302E] disabled:bg-stone-400 text-white py-3.5 rounded-xl text-sm font-bold tracking-wide transition shadow"
            >
              {loadingPrediction ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>AI Crop Engine Processing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 animate-pulse text-[#A3B18A]" />
                  <span>Recommend Optimal Crop</span>
                </>
              )}
            </button>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-7 space-y-6">
            {errorMsg && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start space-x-2.5 text-rose-800 text-xs">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <div>
                  <span className="font-bold">Recommendation Failure</span>
                  <p className="mt-0.5 leading-relaxed">{errorMsg}</p>
                </div>
              </div>
            )}

            {!predictionResult && !loadingPrediction && !errorMsg && (
              <div className="bg-[#E9E5D9]/40 border border-stone-300/40 rounded-2xl p-12 text-center flex flex-col items-center justify-center h-full min-h-[400px]">
                <Cpu className="w-12 h-12 text-[#6B705C] animate-pulse mb-3" />
                <h4 className="font-bold text-[#3F4233] text-base">Engine Ready for Inference</h4>
                <p className="text-xs text-[#6B705C] max-w-sm mt-1 leading-relaxed">
                  Adjust parameter sliders on the left or select a quick agricultural soil preset, then run the recommender.
                </p>
              </div>
            )}

            {loadingPrediction && (
              <div className="bg-[#E9E5D9]/40 border border-stone-300/40 rounded-2xl p-12 text-center flex flex-col items-center justify-center h-full min-h-[400px]">
                <Loader2 className="w-10 h-10 text-[#3F4233] animate-spin mb-4" />
                <h4 className="font-bold text-[#3F4233] text-base">Running Random Forest Classifier</h4>
                <p className="text-xs text-[#6B705C] max-w-xs mt-1.5 leading-relaxed">
                  Calculating multi-class probability scores across 22 crops, assessing nutrient indices, and launching the Gemini agronomy service...
                </p>
              </div>
            )}

            {predictionResult && (
              <div className="space-y-6 animate-fade-in">
                {/* Result Card (Designed elegantly following Section 2 in design html) */}
                <div className="bg-white rounded-[2.5rem] border border-stone-300 p-8 shadow-md relative overflow-hidden flex flex-col items-center justify-center min-h-[250px]">
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-[#F4F1EA] rounded-full text-[10px] font-bold uppercase text-[#6B705C] tracking-wide border border-stone-300/40">
                      ML Prediction Output
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-2 my-4 text-center">
                    <span className="text-xs italic text-stone-400">Optimal Crop Detected</span>
                    <h2 className="text-6xl md:text-7xl font-serif font-medium italic text-[#3F4233] leading-none capitalize">
                      {predictionResult.prediction.bestCrop}
                    </h2>
                    <div className="mt-4 px-6 py-2 bg-[#A3B18A]/20 text-[#3F4233] rounded-full text-xs font-semibold tracking-wide">
                      Confidence Score: {predictionResult.prediction.confidence}%
                    </div>
                  </div>

                  {predictionResult.prediction.alternatives && predictionResult.prediction.alternatives.length > 0 && (
                    <div className="w-full border-t border-stone-200/60 pt-4 mt-2">
                      <p className="text-[10px] text-stone-400 uppercase tracking-widest text-center mb-2">Secondary Matches</p>
                      <div className="flex justify-center flex-wrap gap-2">
                        {predictionResult.prediction.alternatives.map((alt: any, i: number) => (
                          <span key={i} className="px-3 py-1 bg-[#F4F1EA] rounded-full text-xs font-medium text-[#3F4233] border border-stone-200">
                            {alt.crop} ({alt.score}%)
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* AI Explanation Report */}
                <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm flex flex-col">
                  <div className="border-b border-stone-200 pb-3.5 mb-4 flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-[#A3B18A]" />
                    <span className="font-bold text-[#3F4233] text-sm font-serif">Agronomist Expert AI Diagnostics Report</span>
                  </div>
                  <div className="prose prose-stone max-w-none text-[#2D302E] text-xs leading-relaxed space-y-2 overflow-y-auto max-h-[350px]">
                    <div className="markdown-body">
                      <ReactMarkdown>{predictionResult.aiExplanation}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeSubTab === "train" && (
        <div className="space-y-6">
          {/* Hyperparameters Config Block */}
          <div className="bg-[#E9E5D9] rounded-2xl border border-stone-300/50 p-6 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-6 items-end font-sans">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#3F4233] block">KNN Neighbors (K)</label>
              <input
                type="number"
                min="1"
                max="15"
                value={knnK}
                onChange={(e) => setKnnK(parseInt(e.target.value))}
                className="w-full rounded-lg border border-stone-300 p-2 text-xs focus:ring-1 focus:ring-[#3F4233] bg-white text-[#2D302E]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#3F4233] block">DT Max Depth</label>
              <input
                type="number"
                min="3"
                max="12"
                value={dtDepth}
                onChange={(e) => setDtDepth(parseInt(e.target.value))}
                className="w-full rounded-lg border border-stone-300 p-2 text-xs focus:ring-1 focus:ring-[#3F4233] bg-white text-[#2D302E]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#3F4233] block">RF Estimators (Trees)</label>
              <input
                type="number"
                min="5"
                max="30"
                value={rfTrees}
                onChange={(e) => setRfTrees(parseInt(e.target.value))}
                className="w-full rounded-lg border border-stone-300 p-2 text-xs focus:ring-1 focus:ring-[#3F4233] bg-white text-[#2D302E]"
              />
            </div>

            <button
              onClick={handleTrain}
              disabled={trainingLoading}
              className="flex items-center justify-center space-x-2 bg-[#3F4233] hover:bg-[#2D302E] text-white font-semibold py-2.5 rounded-lg text-xs shadow cursor-pointer transition-colors"
            >
              {trainingLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Fitting Models...</span>
                </>
              ) : (
                <>
                  <Cpu className="w-3.5 h-3.5 text-[#A3B18A]" />
                  <span>Fit & Validate Models</span>
                </>
              )}
            </button>
          </div>

          {trainResults && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Table */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
                <div className="mb-4">
                  <h4 className="font-bold text-[#3F4233] text-base font-serif">Model Benchmark Scorecard</h4>
                  <p className="text-xs text-[#6B705C]">
                    Comparing metrics generated across a split ratio of 70% Train / 30% Validation.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-xs font-sans">
                    <thead>
                      <tr className="border-b border-stone-200 text-[#6B705C] font-bold">
                        <th className="pb-2.5">Model Family</th>
                        <th className="pb-2.5">Accuracy</th>
                        <th className="pb-2.5">Precision</th>
                        <th className="pb-2.5">Recall</th>
                        <th className="pb-2.5">F1-Score</th>
                        <th className="pb-2.5">Cross-Val</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-[#2D302E]">
                      {Object.entries(trainResults).map(([modelName, metrics]: any, idx) => (
                        <tr key={idx} className="hover:bg-[#F4F1EA]/40 transition">
                          <td className="py-3 font-semibold text-[#3F4233]">{modelName}</td>
                          <td className="py-3 font-mono font-medium">{(metrics.accuracy * 100).toFixed(1)}%</td>
                          <td className="py-3 font-mono">{(metrics.precision * 100).toFixed(1)}%</td>
                          <td className="py-3 font-mono">{(metrics.recall * 100).toFixed(1)}%</td>
                          <td className="py-3 font-mono font-bold text-[#3F4233] bg-[#A3B18A]/10 rounded px-1.5">{(metrics.f1 * 100).toFixed(1)}%</td>
                          <td className="py-3 font-mono text-stone-500 font-bold">
                            {metrics.crossVal ? `${(metrics.crossVal[0] * 100).toFixed(1)}%` : "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Chart */}
              <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-[#3F4233] text-base font-serif">F1-Score Comparison</h4>
                  <p className="text-xs text-[#6B705C]">Visualizing diagnostic capability across model frameworks.</p>
                </div>
                <div className="h-[250px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={Object.entries(trainResults).map(([name, m]: any) => ({
                        name: name.split(" ").slice(-1)[0],
                        F1: parseFloat((m.f1 * 100).toFixed(1))
                      }))}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e9e5d9" />
                      <XAxis dataKey="name" stroke="#6B705C" fontSize={10} />
                      <YAxis stroke="#6B705C" fontSize={10} domain={[60, 100]} />
                      <Tooltip />
                      <Bar dataKey="F1" fill="#A3B18A" radius={[4, 4, 0, 0]} />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeSubTab === "chat" && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm flex flex-col h-[550px] justify-between">
          <div className="border-b border-stone-200 pb-3 flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-[#3F4233]" />
            <div>
              <h4 className="font-bold text-[#3F4233] text-sm font-serif">Agronomy AI Chat Assistant</h4>
              <p className="text-[10px] text-[#6B705C]">Ask questions about NPK values, soil management, crop rotations, or model parameters.</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-4 space-y-4 px-2">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[#3F4233] text-white"
                      : "bg-[#F4F1EA] border border-stone-200 text-[#2D302E]"
                  }`}
                >
                  <div className="markdown-body">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="bg-[#F4F1EA] border border-stone-200 rounded-2xl px-4 py-3 text-xs text-stone-500 flex items-center space-x-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#3F4233]" />
                  <span>Agronomist is drafting response...</span>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-stone-200 pt-3.5 flex items-center space-x-2">
            <input
              type="text"
              placeholder="Ask about soil nitrogen levels, urea applications, or how decision trees split dataset partitions..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1 rounded-xl border border-stone-300 p-3 text-xs bg-[#F4F1EA] text-[#2D302E] focus:ring-1 focus:ring-[#3F4233] focus:outline-none"
            />
            <button
              onClick={handleSendMessage}
              className="bg-[#3F4233] hover:bg-[#2D302E] text-white p-3 rounded-xl transition cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4 text-[#A3B18A]" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
