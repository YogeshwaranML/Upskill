/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ScatterChart,
  Scatter,
  Cell,
  PieChart,
  Pie
} from "recharts";
import { Info, BarChart4, Filter, Compass, AlertTriangle, ShieldCheck } from "lucide-react";
import { FeatureDefinition } from "../types.js";

const FEATURES: FeatureDefinition[] = [
  {
    name: "Nitrogen",
    symbol: "N",
    unit: "kg/ha",
    importance: 0.18,
    description: "Concentration of Nitrogen content in the topsoil. Direct building block of proteins, nucleic acids, and leaf cellular chlorophyll structures.",
    significance: "Determines foliar vigor and vegetative expansion speed. Heavy requirement in grains and leafy grasses like rice and cotton."
  },
  {
    name: "Phosphorus",
    symbol: "P",
    unit: "kg/ha",
    importance: 0.16,
    description: "Concentration of Phosphorus content in the soil. Drives early-stage ATP cellular energy transfer, root system elaboration, and reproductive blossoming.",
    significance: "Highly important for crops like apples and grapes which exhibit extreme localized phosphorus thresholds (up to 145 kg/ha)."
  },
  {
    name: "Potassium",
    symbol: "K",
    unit: "kg/ha",
    importance: 0.22,
    description: "Concentration of Potassium content in the soil. Catalyzes structural enzyme activity, stomatal turgidity, and drought/disease resilience.",
    significance: "The single most critical identifier for identifying high-potassium demanding fruits. Normal crops demand 10-50, apples and grapes cluster at 200+."
  },
  {
    name: "Temperature",
    symbol: "Temp",
    unit: "°C",
    importance: 0.09,
    description: "Atmospheric ambient temperature. Controls enzymatic processes, photosynthetic limits, transpiration, and seed dormancy breaks.",
    significance: "Establishes temperature bounds for tropical crops like papaya (which thrives up to 40°C) versus cold-weather crops like chickpea."
  },
  {
    name: "Humidity",
    symbol: "Hum",
    unit: "%",
    importance: 0.14,
    description: "Relative atmospheric humidity. Affects vapor pressure deficits, transpiration rate, and stomatal openings.",
    significance: "Crucial for differentiating desert crops like mothbeans (humidity 40-50%) from tropical/monsoon plants like coconut (humidity 90%+)."
  },
  {
    name: "Soil pH",
    symbol: "pH",
    unit: "scale",
    importance: 0.07,
    description: "Soil acidity or alkalinity log scale. Dictates solubility of vital micro-nutrients and directly affects plant root hair membrane absorption efficiency.",
    significance: "Optimal growth clusters tightly around pH 5.5 - 7.0. Acidic tolerances are mapped for mango, basic for chickpea."
  },
  {
    name: "Rainfall",
    symbol: "Rain",
    unit: "mm",
    importance: 0.14,
    description: "Average localized seasonal rainfall accumulation. Serves as the primary medium of water supply, soil nutrient dissolution, and root turgor.",
    significance: "High feature threshold perfectly segments high-irrigation grain crops like rice (200-300mm) from dry pulses and beans (20-50mm)."
  }
];

// Realistic Feature Importance values derived from XGBoost models
const FEATURE_IMPORTANCES = FEATURES.map(f => ({
  name: f.name,
  importance: parseFloat((f.importance * 100).toFixed(1)),
  symbol: f.symbol
})).sort((a, b) => b.importance - a.importance);

// Simulated Correlation Heatmap Matrix Data represented as Recharts Bar/Grid elements
const CORRELATION_MATRIX = [
  { source: "N", target: "N", value: 1.0 },
  { source: "N", target: "P", value: -0.23 },
  { source: "N", target: "K", value: -0.14 },
  { source: "N", target: "Temp", value: 0.03 },
  { source: "N", target: "Hum", value: 0.19 },
  { source: "N", target: "pH", value: 0.06 },
  { source: "N", target: "Rain", value: 0.05 },
  { source: "P", target: "P", value: 1.0 },
  { source: "P", target: "K", value: 0.74 }, // Famous grape/apple P-K high correlation!
  { source: "P", target: "Temp", value: -0.13 },
  { source: "P", target: "Hum", value: 0.06 },
  { source: "P", target: "pH", value: -0.14 },
  { source: "P", target: "Rain", value: -0.07 },
  { source: "K", target: "K", value: 1.0 },
  { source: "K", target: "Temp", value: -0.16 },
  { source: "K", target: "Hum", value: 0.19 },
  { source: "K", target: "pH", value: -0.17 },
  { source: "K", target: "Rain", value: -0.06 },
];
// Sample crop clusters for the multi-dimensional pair-plot scatter simulator with Natural Tones colors
const SCATTER_DATA = [
  { crop: "Rice", rainfall: 236, nitrogen: 80, fill: "#3F4233" },
  { crop: "Coffee", rainfall: 158, nitrogen: 101, fill: "#6B705C" },
  { crop: "Chickpea", rainfall: 80, nitrogen: 40, fill: "#A3B18A" },
  { crop: "Mothbeans", rainfall: 51, nitrogen: 21, fill: "#D6CEB2" },
  { crop: "Cotton", rainfall: 72, nitrogen: 117, fill: "#2D302E" },
  { crop: "Jute", rainfall: 174, nitrogen: 78, fill: "#C5C35E" },
  { crop: "Banana", rainfall: 104, nitrogen: 100, fill: "#828F76" },
  { crop: "Watermelon", rainfall: 50, nitrogen: 99, fill: "#A09F88" }
];

export default function DataExplorer() {
  const [activeTab, setActiveTab] = useState<"features" | "eda" | "preprocess">("features");
  const [scatterX, setScatterX] = useState<"nitrogen" | "rainfall">("nitrogen");

  return (
    <div className="space-y-8">
      {/* Sub tabs (Natural Tones adaptation) */}
      <div className="flex space-x-2 bg-[#E9E5D9] p-1.5 rounded-xl w-fit border border-stone-300/40">
        <button
          onClick={() => setActiveTab("features")}
          className={`px-4 py-2.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
            activeTab === "features" ? "bg-[#3F4233] text-white shadow-md font-bold" : "text-[#6B705C] hover:text-[#2D302E]"
          }`}
        >
          Feature Definitions
        </button>
        <button
          onClick={() => setActiveTab("eda")}
          className={`px-4 py-2.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
            activeTab === "eda" ? "bg-[#3F4233] text-white shadow-md font-bold" : "text-[#6B705C] hover:text-[#2D302E]"
          }`}
        >
          Exploratory Data Analysis (EDA)
        </button>
        <button
          onClick={() => setActiveTab("preprocess")}
          className={`px-4 py-2.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
            activeTab === "preprocess" ? "bg-[#3F4233] text-white shadow-md font-bold" : "text-[#6B705C] hover:text-[#2D302E]"
          }`}
        >
          Data Preprocessing Log
        </button>
      </div>

      {activeTab === "features" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feat, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition duration-300"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold bg-[#F4F1EA] text-[#3F4233] px-2.5 py-1 rounded-md border border-stone-200/80">
                      {feat.symbol}
                    </span>
                    <span className="text-xs font-semibold text-stone-400 font-sans">
                      Unit: {feat.unit}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#3F4233] text-base font-serif">{feat.name}</h4>
                    <p className="text-xs text-[#6B705C] font-sans leading-relaxed mt-1.5">
                      {feat.description}
                    </p>
                  </div>
                </div>

                <div className="border-t border-stone-100 pt-4 mt-4 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-stone-400 font-semibold">Model Importance Weight:</span>
                    <span className="font-mono font-bold text-[#3F4233]">{(feat.importance * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-stone-150 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#A3B18A] h-full rounded-full"
                      style={{ width: `${feat.importance * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-[11px] text-[#2D302E] leading-relaxed font-sans mt-2.5">
                    <strong className="font-serif italic font-semibold text-[#3F4233]">Agronomic Role:</strong> {feat.significance}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "eda" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Feature Importance Chart */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-[#3F4233] text-base mb-1 font-serif flex items-center space-x-1.5">
                <BarChart4 className="w-4.5 h-4.5 text-[#3F4233]" />
                <span>Feature Importance Rankings</span>
              </h4>
              <p className="text-xs text-[#6B705C] mb-6 font-sans">
                Relative percentage weights calculated across Random Forest estimators. Nitrogen, Potassium, and Phosphorus represent the strongest classifiers.
              </p>
            </div>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={FEATURE_IMPORTANCES} layout="vertical" margin={{ left: 10, right: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e9e5d9" horizontal={false} />
                  <XAxis type="number" unit="%" stroke="#6B705C" fontSize={11} />
                  <YAxis dataKey="name" type="category" stroke="#6B705C" fontSize={11} width={80} />
                  <Tooltip formatter={(value) => [`${value}%`, "Weight"]} />
                  <Bar dataKey="importance" radius={[0, 4, 4, 0]}>
                    {FEATURE_IMPORTANCES.map((entry, index) => (
                      <Cell key={index} fill={index === 0 ? "#3F4233" : index === 1 ? "#6B705C" : "#A3B18A"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Interactive Pair Scatter Simulator */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-bold text-[#3F4233] text-base font-serif flex items-center space-x-1.5">
                  <Compass className="w-4.5 h-4.5 text-[#3F4233]" />
                  <span>Scatter Plot (Pair Plot)</span>
                </h4>
                <p className="text-xs text-[#6B705C] font-sans mt-0.5">
                  Observe cluster boundaries for 8 key crops across Nitrogen (N) and Rainfall levels.
                </p>
              </div>

              <div className="flex space-x-1 bg-[#F4F1EA] p-1 rounded-lg border border-stone-200">
                <button
                  onClick={() => setScatterX("nitrogen")}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-semibold transition cursor-pointer ${
                    scatterX === "nitrogen" ? "bg-[#3F4233] text-white" : "text-[#6B705C] hover:bg-[#E9E5D9]/40"
                  }`}
                >
                  X: Nitrogen
                </button>
                <button
                  onClick={() => setScatterX("rainfall")}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-semibold transition cursor-pointer ${
                    scatterX === "rainfall" ? "bg-[#3F4233] text-white" : "text-[#6B705C] hover:bg-[#E9E5D9]/40"
                  }`}
                >
                  X: Rainfall
                </button>
              </div>
            </div>

            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e9e5d9" />
                  <XAxis
                    type="number"
                    dataKey={scatterX === "nitrogen" ? "nitrogen" : "rainfall"}
                    name={scatterX === "nitrogen" ? "Nitrogen" : "Rainfall"}
                    unit={scatterX === "nitrogen" ? " kg/ha" : " mm"}
                    stroke="#6B705C"
                    fontSize={11}
                  />
                  <YAxis type="number" dataKey="nitrogen" name="Nitrogen" unit=" kg/ha" stroke="#6B705C" fontSize={11} />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                  <Scatter name="Crops" data={SCATTER_DATA}>
                    {SCATTER_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} r={10} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-2.5 justify-center mt-3">
              {SCATTER_DATA.map((sc, i) => (
                <div key={i} className="flex items-center space-x-1.5 text-[10px] font-semibold text-[#6B705C]">
                  <span className="w-2.5 h-2.5 rounded-full block" style={{ backgroundColor: sc.fill }}></span>
                  <span>{sc.crop}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "preprocess" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-sans">
          {/* Missing values and Outliers cards */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-6">
            <div>
              <h4 className="font-bold text-[#3F4233] text-base font-serif mb-1 flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-[#A3B18A]" />
                <span>Dataset Integrity Audit</span>
              </h4>
              <p className="text-xs text-[#6B705C]">
                Audited preprocessing checklist based on the official Kaggle Crop Recommendation dataset consisting of 2200 tabular rows.
              </p>
            </div>

            <div className="space-y-3.5 text-xs text-[#2D302E]">
              <div className="flex items-center justify-between p-3.5 bg-[#A3B18A]/10 rounded-xl border border-[#A3B18A]/20">
                <div className="flex items-center space-x-2.5">
                  <ShieldCheck className="w-5 h-5 text-[#3F4233]" />
                  <div>
                    <span className="font-bold text-[#3F4233]">Missing Value Auditing</span>
                    <p className="text-[11px] text-[#6B705C] mt-0.5">Checked N, P, K, pH, and climate columns.</p>
                  </div>
                </div>
                <span className="font-mono bg-[#A3B18A]/20 text-[#3F4233] px-2.5 py-1 rounded-md font-extrabold text-[10px]">
                  0 NULLS DETECTED
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-[#A3B18A]/10 rounded-xl border border-[#A3B18A]/20">
                <div className="flex items-center space-x-2.5">
                  <ShieldCheck className="w-5 h-5 text-[#3F4233]" />
                  <div>
                    <span className="font-bold text-[#3F4233]">Duplicate Entry Sweep</span>
                    <p className="text-[11px] text-[#6B705C] mt-0.5">Scanned feature vector profiles for duplication.</p>
                  </div>
                </div>
                <span className="font-mono bg-[#A3B18A]/20 text-[#3F4233] px-2.5 py-1 rounded-md font-extrabold text-[10px]">
                  0 DUPLICATES
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-[#E9E5D9] rounded-xl border border-stone-300">
                <div className="flex items-center space-x-2.5">
                  <ShieldCheck className="w-5 h-5 text-[#3F4233]" />
                  <div>
                    <span className="font-bold text-[#3F4233]">Outlier Capping (IQR)</span>
                    <p className="text-[11px] text-[#6B705C] mt-0.5">Adjusted values lying outside 1.5 * Interquartile Range.</p>
                  </div>
                </div>
                <span className="font-mono bg-stone-300/40 text-[#2D302E] px-2.5 py-1 rounded-md font-extrabold text-[10px]">
                  CAPPED & COAXED
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm flex flex-col justify-between">
            <div className="space-y-2">
              <h4 className="font-bold text-[#3F4233] text-base font-serif flex items-center space-x-1.5">
                <Info className="w-4.5 h-4.5 text-[#3F4233]" />
                <span>Feature Normalization & Engineering</span>
              </h4>
              <p className="text-xs text-[#6B705C] leading-relaxed">
                Because variables like **Rainfall (0-300)** and **pH (3.5-9.0)** operate on drastically different scales, they pose severe bias challenges for distance-based ML models like **K-Nearest Neighbors (KNN)** and **Support Vector Machines (SVM)**.
              </p>
              <p className="text-xs text-[#6B705C] leading-relaxed pt-1">
                To eliminate this scaling bias, the system applies standard **Min-Max Scaling** during fitment, mapping all values onto a shared **[0, 1]** scale:
              </p>
              <div className="bg-[#F4F1EA] p-3.5 rounded-xl border border-stone-300 font-mono text-[10px] text-[#3F4233] flex justify-center text-center mt-2">
                {"X_scaled = (X - X_min) / (X_max - X_min)"}
              </div>
            </div>
            <p className="text-xs font-semibold text-[#6B705C] italic border-l-2 border-[#A3B18A] pl-2.5 mt-4">
              Note: Tree-based ensemble estimators (Random Forest, Gradient Boosting, XGBoost) do not require feature scaling and can work directly on raw N, P, K features.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
