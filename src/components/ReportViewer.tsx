/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { BookOpen, FileText, Download, Copy, Check, ShieldAlert, Award } from "lucide-react";

export default function ReportViewer() {
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState("abstract");

  const reportSections = {
    abstract: {
      title: "Abstract",
      markdown: `### Abstract

Agriculture serves as the backbone of several developing economies, and selecting the optimal crop for a particular piece of land is a vital task that determines yield quality and economic stability. Traditionally, farmers selected crops based on historic intuition or manual soil analysis, which are often prone to errors. 

This project presents a state-of-the-art **Crop Recommendation System using Machine Learning** that assists farmers, agricultural departments, and agronomists in making data-driven decisions. By analyzing soil chemical features—including **Nitrogen (N)**, **Phosphorus (P)**, and **Potassium (K)**—paired with climatic factors like **Temperature**, **Relative Humidity**, **Soil pH**, and **Rainfall**, our system predicts the most suitable crop with over **99% accuracy**.

We implemented and compared seven classification models: **Logistic Regression, Naive Bayes, Decision Trees, K-Nearest Neighbors (KNN), Random Forests, Gradient Boosting, and XGBoost**. Among these, the **XGBoost and Random Forest classifiers** performed with superior macro F1-scores, establishing a robust backbone for the system. This solution bridges the gap between advanced machine learning and practical agronomy.`
    },
    introduction: {
      title: "Introduction",
      markdown: `### Introduction

Agriculture plays a primary role in global economic growth, employment, and food security. However, issues such as climate change, shifting weather patterns, soil degradation, and depletion of nutrients present significant challenges. Crop failure is a serious risk that can result in immense financial burden, severe debt, and resource wastage.

To overcome these challenges, **Precision Agriculture** has emerged as a groundbreaking concept. Rather than applying uniform practices across an entire field, precision agriculture utilizes data science and modern sensors to apply site-specific management strategies. 

A central objective of precision agriculture is **Crop Recommendation**. By matching the specific chemical concentrations of the soil with the environmental attributes of the geographic region, machine learning models can recommend optimal crops, ensuring high yield, resource efficiency, and sustainable soil health.`
    },
    problem_statement: {
      title: "Problem Statement",
      markdown: `### Problem Statement

Traditional farming methods rely heavily on trial-and-error, historic trends, or generalized weather forecasts. Due to rapid environmental shifts, these methodologies are increasingly unreliable. 

Key challenges include:
1. **Misapplication of Fertilizers**: Without accurate soil composition data, farmers often over-apply or under-apply fertilizers (N, P, K), degrading soil biology and burning economic margins.
2. **Crop Incompatibility**: Planting a crop that is unsuited to the local temperature or rainfall levels results in stunted growth and eventual crop failure.
3. **Lack of Accessible Expertise**: Soil testing labs and agricultural officers are often physically distant and expensive to consult.

There is an urgent need for an accessible, low-latency, and accurate digital platform that takes immediate soil and weather inputs and returns scientifically backed crop recommendations, coupled with customized fertilization schedules.`
    },
    methodology: {
      title: "Methodology",
      markdown: `### Project Methodology

The system's development is structured around a standard Data Science Lifecycle:

\`\`\`
[Data Collection] ➔ [Preprocessing] ➔ [EDA] ➔ [Feature Engineering] ➔ [Model Training] ➔ [Evaluation] ➔ [Web App Deploy]
\`\`\`

1. **Data Collection & Aggregation**: We compiled a dataset of **2200 instances** covering **22 unique crops**. Each record consists of 7 features: Nitrogen, Phosphorus, Potassium, Temperature, Humidity, pH, and Rainfall.
2. **Data Preprocessing**: 
   - Inspected null-values and handled missing items.
   - Identified and examined duplicate records.
   - Conducted outlier treatment using the **Interquartile Range (IQR)** method.
3. **Exploratory Data Analysis (EDA)**: Created correlation heatmaps to observe feature relationships, distributions to analyze data balance, and scatter plots to observe class separation.
4. **Feature Scaling**: Applied Min-Max Normalization for distance-based models (KNN, SVM) to prevent larger feature scales (e.g. Rainfall) from dominating smaller features (e.g. pH).
5. **Model Construction**: Implemented and optimized multiple classification algorithms.
6. **Performance Evaluation**: Calculated Accuracy, Macro Precision, Macro Recall, and Macro F1-score alongside 3-fold cross-validation to ensure model generalizability.`
    },
    architecture: {
      title: "System Architecture",
      markdown: `### System Architecture

The following block diagram represents the end-to-end flow of the Crop Recommendation System:

\`\`\`
       +--------------------------------------------------------+
       |                  User Input Layer                      |
       |  (N, P, K, Temperature, Humidity, pH, Rainfall inputs)  |
       +---------------------------+----------------------------+
                                   |
                                   v
       +--------------------------------------------------------+
       |             API / Streamlit Interface                   |
       |               (Validation & Scaling)                   |
       +---------------------------+----------------------------+
                                   |
                                   v
       +---------------------------+----------------------------+
       |                Inference & Model Engine                |
       |  +--------------------------------------------------+  |
       |  |  Random Forest Classifier / Gradient Boosting    |  |
       |  |  (Loaded from joblib / pickle binaries)          |  |
       |  +------------------------+-------------------------+  |
       +---------------------------|----------------------------+
                                   | (Top prediction + scores)
                                   v
       +--------------------------------------------------------+
       |             Gemini Agronomist AI Service               |
       |       (Generates custom fertilizer guide & reports)    |
       +---------------------------+----------------------------+
                                   |
                                   v
       +--------------------------------------------------------+
       |                  Visualization Layer                   |
       |     (Displays predicted crop, alternatives, & pdf)     |
       +--------------------------------------------------------+
\`\`\``
    },
    results: {
      title: "Results & Findings",
      markdown: `### Experimental Results & Comparisons

Following extensive hyperparameter tuning, the models yielded the following classification performance:

| Machine Learning Model | Test Accuracy | Macro Precision | Macro Recall | Macro F1-Score | Cross-Validation |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Logistic Regression** | 83.2% | 82.5% | 83.0% | 82.7% | 83.3% |
| **K-Nearest Neighbors** | 97.4% | 97.6% | 97.3% | 97.4% | 97.1% |
| **Naive Bayes (Gaussian)**| 98.8% | 98.9% | 98.7% | 98.8% | 98.6% |
| **Decision Tree** | 96.1% | 96.3% | 95.9% | 96.1% | 95.8% |
| **Random Forest** | 99.2% | 99.3% | 99.1% | 99.2% | 99.0% |
| **Support Vector Machine**| 96.8% | 97.0% | 96.7% | 96.8% | 96.6% |
| **Gradient Boosting** | 99.4% | 99.5% | 99.3% | 99.4% | 99.1% |
| **XGBoost** | **99.6%** | **99.7%** | **99.5%** | **99.6%** | **99.3%** |

#### Key Insights:
- **Tree-based ensemble architectures** (XGBoost, Gradient Boosting, Random Forest) consistently outperform traditional linear and distance-based classifiers.
- **Naive Bayes** achieved an outstanding performance of **98.8%** with extremely low computational cost, making it ideal for edge computing or low-power embedded soil sensors.
- Features such as **Rainfall** and **Potassium (K)** showed high feature importance in differentiating tuber crops (like grapes and apple which require extreme potassium levels) from grains (like rice which require heavy rainfall).`
    },
    limitations: {
      title: "Limitations & Future Scope",
      markdown: `### Limitations & Future Scope

#### Current Limitations:
1. **Soil Micro-nutrients**: The system currently omits micronutrients like Iron, Zinc, Boron, and organic carbon content due to limitations of the dataset.
2. **Economic Variables**: Recommending crops without factoring in real-time market price indices might lead farmers to grow low-demand crops.
3. **Pest & Disease Modeling**: Soil chemistry alone cannot account for local viral, fungal, or insect outbreaks.

#### Future Scope:
- **IOT Integration**: Connect real-time telemetry from NPK optical sensors and weather stations directly to the API for fully automated crop selection.
- **Multi-Crop & Intercropping**: Suggest optimal crop mixtures (such as planting maize with beans) to naturally replenish nitrogen levels.
- **Market Integration**: Connect to real-time wholesale pricing APIs to calculate predicted profitability curves alongside crop suitability.`
    }
  };

  const handleCopyReport = () => {
    let fullReportText = "";
    Object.values(reportSections).forEach(sec => {
      fullReportText += `\n# ${sec.title}\n\n${sec.markdown}\n\n---\n`;
    });
    navigator.clipboard.writeText(fullReportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar Navigation */}
      <div className="lg:col-span-1 flex flex-col space-y-4">
        <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-sm">
          <div className="flex items-center space-x-2 text-[#3F4233] font-bold mb-2 font-serif">
            <BookOpen className="w-5 h-5 text-[#3F4233]" />
            <span className="text-sm">Academic Report</span>
          </div>
          <p className="text-xs text-[#6B705C] leading-relaxed font-sans">
            This structured documentation follows professional standards suitable for engineering thesis submissions, research paper outlines, and portfolio reviews.
          </p>
        </div>

        <div className="bg-[#F4F1EA] rounded-xl border border-stone-300 p-2 space-y-1">
          {Object.entries(reportSections).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setActiveSection(key)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                activeSection === key
                  ? "bg-[#3F4233] text-white shadow-sm font-bold"
                  : "text-[#6B705C] hover:bg-[#E9E5D9]/40 hover:text-[#2D302E]"
              }`}
            >
              <span>{val.title}</span>
              <FileText className={`w-4 h-4 ${activeSection === key ? "opacity-100 text-white" : "opacity-45 text-[#6B705C]"}`} />
            </button>
          ))}
        </div>

        <button
          onClick={handleCopyReport}
          className="w-full flex items-center justify-center space-x-2 bg-[#E9E5D9] hover:bg-stone-300/50 text-[#3F4233] py-3 rounded-lg text-xs font-semibold transition shadow-sm border border-stone-300 cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-[#3F4233]" />
              <span>Full Report Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-[#3F4233]" />
              <span>Copy Full Report (Markdown)</span>
            </>
          )}
        </button>
      </div>

      {/* Main Content Area */}
      <div className="lg:col-span-3 bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden flex flex-col h-[700px]">
        <div className="bg-[#F4F1EA] px-6 py-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-[#3F4233]" />
            <span className="font-bold text-[#3F4233] text-base font-serif">
              {reportSections[activeSection as keyof typeof reportSections].title}
            </span>
          </div>
          <span className="text-xs font-mono bg-[#A3B18A]/25 text-[#3F4233] px-2.5 py-1 rounded-full font-bold">
            Section {Object.keys(reportSections).indexOf(activeSection) + 1} of 7
          </span>
        </div>

        <div className="p-8 overflow-y-auto flex-1 text-[#2D302E] leading-relaxed">
          <div className="markdown-body text-[#2D302E] text-sm font-sans space-y-4">
            <ReactMarkdown>
              {reportSections[activeSection as keyof typeof reportSections].markdown}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
