/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { HelpCircle, BrainCircuit, RefreshCw, CheckCircle, XCircle, Award, Sparkles } from "lucide-react";
import { QuizQuestion } from "../types.js";

const QUESTIONS: QuizQuestion[] = [
  {
    category: "viva",
    question: "What is the primary objective of this project, and why is Machine Learning used instead of traditional analysis?",
    answer: "The primary objective is to recommend the most optimal crop based on specific soil (N, P, K, pH) and meteorological factors (temperature, humidity, rainfall). Machine Learning is preferred because traditional crop models are either linear or struggle to handle complex, multi-dimensional, non-linear relationships. ML classifiers can identify hidden correlations and yield accuracy ratings exceeding 99%.",
    explanation: "Standard rules fail to account for complex intersections like how low pH coupled with extremely high rainfall affects specific tuber crop requirements compared to grains."
  },
  {
    category: "viva",
    question: "What is the role of N, P, and K values in soil chemistry and crop physiological growth?",
    answer: "1) Nitrogen (N) is vital for chlorophyll synthesis, vegetative leaf growth, and stem strength. 2) Phosphorus (P) is essential for early-stage root development, cell division, and flowering. 3) Potassium (K) regulates water transpiration, stomatal openings, disease resistance, and fruit/grain quality.",
    explanation: "For example, high potassium (K) levels are typically demanded by crops like apples and grapes (usually around 200 mg/kg), whereas rice requires heavy nitrogen."
  },
  {
    category: "viva",
    question: "Why did XGBoost and Random Forest outperform simple Logistic Regression in this task?",
    answer: "Logistic Regression assumes a linear relationship between features and logs of odds. However, crop requirements are highly clustered, multi-modal, and threshold-based. Random Forests and XGBoost use ensembles of decision trees, which natively segment the space using multi-level binary partitions (orthogonal splits), making them highly suitable for classification of clusters.",
    explanation: "Linear boundary lines fail to classify 22 distinct crops with non-linear feature bounds."
  },
  {
    category: "viva",
    question: "What is Cross-Validation, and why is it essential to report alongside simple train-test split accuracy?",
    answer: "Cross-validation splits the dataset into k equal segments (folds). It trains on k-1 folds and validates on the remaining fold, rotating this process k times. Simple train-test splits are sensitive to how the random split occurred, which can lead to optimistic bias. CV ensures that model performance is stable and generalizable across unseen, arbitrary data distributions.",
    explanation: "A stable cross-validation score shows the model isn't overfitting to a single lucky random seed."
  },
  {
    category: "interview",
    question: "How do you detect and handle outliers in a multi-variable tabular dataset like this crop dataset?",
    answer: "Outliers can be detected using statistical criteria like the Interquartile Range (IQR) method (values below Q1 - 1.5*IQR or above Q3 + 1.5*IQR) or Z-score thresholding. They can be handled by either: 1) Trimming (removing the records, suited for mis-entered outliers), 2) Windsorization (capping the values at the thresholds), or 3) Using robust algorithms like Random Forests that are inherently resilient to outliers.",
    explanation: "For pH or temperature, extreme records might indicate sensor malfunction, requiring outlier capping."
  },
  {
    category: "interview",
    question: "Why must features like Rainfall and pH be handled carefully before training distance-based algorithms like KNN or SVM?",
    answer: "KNN and SVM calculate distances (Euclidean or Manhattan) between sample coordinates. Rainfall values can range from 20 to 300+, while pH values range tightly between 3.5 and 8.0. Unscaled, the distance contribution of Rainfall will mathematically dwarf and completely drown out pH, rendering pH's influence negligible. Feature scaling (Min-Max or Standardization) puts all features on the same scale (0-1 or z-distribution).",
    explanation: "Min-Max Normalization ensures that a change of 1 unit in pH is equivalent in distance weights to proportional shifts in rainfall."
  },
  {
    category: "interview",
    question: "How do you deploy this model to production in an enterprise environment?",
    answer: "In enterprise pipelines, the trained model would be wrapped in a RESTful API container (using Flask, FastAPI, or Node.js endpoints) and compiled into Docker images. These containers can be deployed on serverless cloud platforms (such as Google Cloud Run or AWS Fargate). The model state is serialized using Joblib or ONNX for high-performance and low-latency client invocation.",
    explanation: "A lightweight API ensures high-concurrency client requests from IOT field nodes or mobile apps."
  }
];

export default function VivaQuiz() {
  const [activeTab, setActiveTab] = useState<"flashcards" | "quiz">("flashcards");
  const [category, setCategory] = useState<"viva" | "interview">("viva");
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});
  
  // Quiz states
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [answersSubmitted, setAnswersSubmitted] = useState<boolean[]>([]);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const toggleFlip = (index: number) => {
    setFlippedCards(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const filteredQuestions = QUESTIONS.filter(q => q.category === category);

  // Gamified multiple-choice simulated questions for the interactive quiz tab
  const quizQuestions = [
    {
      q: "Which soil nutrient is directly responsible for vegetative leaf growth and chlorophyll synthesis?",
      options: ["Phosphorus (P)", "Potassium (K)", "Nitrogen (N)", "Calcium (Ca)"],
      correct: 2,
      explanation: "Nitrogen (N) stimulates leaf expansion, structural proteins, and chlorophyll molecule construction."
    },
    {
      q: "Why is a MinMaxScaler critical for K-Nearest Neighbors (KNN) in this dataset?",
      options: [
        "To speed up training speed only",
        "To prevent features with larger scales like Rainfall from drowning out features like pH",
        "To handle negative numbers in the temperature values",
        "To convert the target labels into binary formats"
      ],
      correct: 1,
      explanation: "Without scaling, the large numeric values of rainfall dominate the distance calculation over tightly bounded fields like pH."
    },
    {
      q: "Which Machine Learning model utilizes the concept of Gini Impurity or Information Gain to construct branches?",
      options: ["Logistic Regression", "Support Vector Machine", "Decision Tree", "Gaussian Naive Bayes"],
      correct: 2,
      explanation: "Decision Trees select split points based on maximizing Information Gain (Entropy reduction) or minimizing Gini Impurity."
    },
    {
      q: "What does an F1-Score of 99.2% represent in multi-class crop prediction?",
      options: [
        "That the model only predicted 1 crop accurately",
        "A balanced harmonic mean showing excellent precision and recall across all crop categories",
        "That the model is overfitted and will not work on new data",
        "That the training set is extremely small and unbalanced"
      ],
      correct: 1,
      explanation: "The F1-score is the harmonic mean of precision and recall, ensuring that high performance is not skewed by high-accuracy but low-recall properties."
    }
  ];

  const handleOptionClick = (idx: number) => {
    if (selectedOptionIdx !== null) return; // Prevent double selecting
    setSelectedOptionIdx(idx);
    
    const isCorrect = idx === quizQuestions[currentQuestionIdx].correct;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOptionIdx(null);
    if (currentQuestionIdx < quizQuestions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIdx(0);
    setSelectedOptionIdx(null);
    setScore(0);
    setIsCompleted(false);
    setQuizStarted(false);
  };

  return (
    <div className="space-y-8">
      {/* Tab Switcher (Natural Tones Adapt) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div className="flex space-x-2 bg-[#E9E5D9] p-1.5 rounded-xl border border-stone-300/40">
          <button
            onClick={() => setActiveTab("flashcards")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === "flashcards" ? "bg-[#3F4233] text-white shadow-sm font-bold" : "text-[#6B705C] hover:text-[#2D302E]"
            }`}
          >
            Study Flashcards
          </button>
          <button
            onClick={() => {
              setActiveTab("quiz");
              resetQuiz();
            }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition flex items-center space-x-1 cursor-pointer ${
              activeTab === "quiz" ? "bg-[#3F4233] text-white shadow-sm font-bold" : "text-[#6B705C] hover:text-[#2D302E]"
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5 text-[#3F4233]" />
            <span>Interactive Quiz</span>
          </button>
        </div>

        {activeTab === "flashcards" && (
          <div className="flex space-x-2 bg-[#F4F1EA] p-1 rounded-lg border border-stone-300">
            <button
              onClick={() => setCategory("viva")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
                category === "viva" ? "bg-[#3F4233] text-white font-bold" : "text-[#6B705C] hover:text-[#2D302E]"
              }`}
            >
              Academic Viva Q&A
            </button>
            <button
              onClick={() => setCategory("interview")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
                category === "interview" ? "bg-[#3F4233] text-white font-bold" : "text-[#6B705C] hover:text-[#2D302E]"
              }`}
            >
              DS Interview Prep
            </button>
          </div>
        )}
      </div>

      {activeTab === "flashcards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredQuestions.map((q, idx) => (
            <div
              key={idx}
              onClick={() => toggleFlip(idx)}
              className="group cursor-pointer perspective-1000 min-h-[220px]"
            >
              <div
                className={`relative w-full h-full duration-500 transform-style-preserve-3d transition-all ${
                  flippedCards[idx] ? "rotate-y-180" : ""
                }`}
              >
                {/* Front Side */}
                <div className="w-full h-full bg-white rounded-2xl border border-stone-200 p-6 shadow-sm hover:shadow-md transition duration-300 absolute backface-hidden flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-stone-400">
                      <HelpCircle className="w-5 h-5 text-[#A3B18A]" />
                      <span className="text-xs font-bold uppercase tracking-wider font-mono">Question {idx + 1}</span>
                    </div>
                    <h4 className="font-bold text-[#3F4233] text-base leading-snug font-serif">
                      {q.question}
                    </h4>
                  </div>
                  <div className="text-xs text-[#6B705C] font-semibold group-hover:text-[#2D302E] transition flex items-center space-x-1 mt-4">
                    <span>Click to reveal detailed scientific answer</span>
                    <span>→</span>
                  </div>
                </div>

                {/* Back Side */}
                <div className="w-full h-full bg-[#3F4233] text-stone-100 rounded-2xl p-6 shadow-md absolute backface-hidden rotate-y-180 flex flex-col justify-between overflow-y-auto">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-[#A3B18A]">
                      <BrainCircuit className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-wider font-mono">Verified Answer</span>
                    </div>
                    <p className="text-sm text-[#E9E5D9] leading-relaxed font-sans">
                      {q.answer}
                    </p>
                    <div className="border-t border-[#A3B18A]/25 pt-2.5 mt-2">
                      <p className="text-xs text-[#A3B18A] italic leading-relaxed">
                        <strong className="font-serif italic font-semibold text-white">Pro-Tip/Insight:</strong> {q.explanation}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-[#A3B18A] font-medium pt-3 text-center">
                    Click card to flip back
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-stone-200 p-8 shadow-sm">
          {!quizStarted ? (
            <div className="text-center space-y-6 py-6">
              <div className="inline-flex p-4 bg-[#A3B18A]/10 rounded-full text-[#3F4233]">
                <BrainCircuit className="w-10 h-10 animate-pulse" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-[#3F4233] font-serif">ML & Soil Science Interactive Quiz</h3>
                <p className="text-sm text-[#6B705C] max-w-md mx-auto leading-relaxed font-sans">
                  Test your understanding of model selection, precision metrics, soil chemistry, and crop physics in this gamified prep quiz.
                </p>
              </div>
              <button
                onClick={() => setQuizStarted(true)}
                className="bg-[#3F4233] hover:bg-[#2D302E] text-white font-semibold px-6 py-3 rounded-xl transition shadow-md cursor-pointer text-xs"
              >
                Launch Challenge
              </button>
            </div>
          ) : isCompleted ? (
            <div className="text-center space-y-6 py-6">
              <div className="inline-flex p-4 bg-[#E9E5D9] rounded-full text-[#3F4233]">
                <Award className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-[#3F4233] font-serif">Challenge Completed!</h3>
                <p className="text-sm text-[#6B705C]">
                  You scored <strong className="text-[#3F4233] font-bold">{score}</strong> out of <strong className="text-stone-800">{quizQuestions.length}</strong> questions correctly.
                </p>
              </div>
              
              <div className="max-w-md mx-auto bg-[#F4F1EA] rounded-xl p-4 border border-stone-300 text-xs text-[#6B705C] leading-relaxed text-left">
                {score === quizQuestions.length ? (
                  <div className="flex items-start space-x-2 text-[#3F4233] font-medium">
                    <Sparkles className="w-4 h-4 text-[#A3B18A] shrink-0 mt-0.5" />
                    <span>Fantastic! You have an expert theoretical and practical grasp of crop data analytics and machine learning model operations. Perfect score!</span>
                  </div>
                ) : (
                  <span>Great attempt! Review the explanations for any missed cards to build complete readiness for your viva or data science interviews.</span>
                )}
              </div>

              <div className="flex justify-center space-x-3">
                <button
                  onClick={resetQuiz}
                  className="bg-[#3F4233] hover:bg-[#2D302E] text-white font-semibold px-5 py-2.5 rounded-lg transition text-xs shadow cursor-pointer"
                >
                  Retake Quiz
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Progress bar */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#6B705C] font-mono font-medium">
                  Question {currentQuestionIdx + 1} of {quizQuestions.length}
                </span>
                <span className="text-xs text-[#3F4233] font-bold bg-[#A3B18A]/25 px-2.5 py-0.5 rounded-full">
                  Score: {score}
                </span>
              </div>
              <div className="w-full bg-[#E9E5D9] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#3F4233] h-full transition-all duration-300 rounded-full"
                  style={{ width: `${((currentQuestionIdx + 1) / quizQuestions.length) * 100}%` }}
                ></div>
              </div>

              {/* Question */}
              <h4 className="text-[#3F4233] font-bold text-base leading-relaxed font-serif">
                {quizQuestions[currentQuestionIdx].q}
              </h4>

              {/* Options */}
              <div className="space-y-3">
                {quizQuestions[currentQuestionIdx].options.map((option, idx) => {
                  const isSelected = selectedOptionIdx === idx;
                  const isCorrect = idx === quizQuestions[currentQuestionIdx].correct;
                  const hasAnswered = selectedOptionIdx !== null;

                  let cardStyle = "border-stone-200 hover:bg-[#F4F1EA] text-[#2D302E]";
                  let icon = null;

                  if (hasAnswered) {
                    if (isCorrect) {
                      cardStyle = "bg-[#A3B18A]/15 border-[#A3B18A] text-[#3F4233] font-bold";
                      icon = <CheckCircle className="w-4.5 h-4.5 text-[#3F4233] shrink-0" />;
                    } else if (isSelected) {
                      cardStyle = "bg-[#E9E5D9] border-stone-300 text-stone-700";
                      icon = <XCircle className="w-4.5 h-4.5 text-[#3F4233] shrink-0" />;
                    } else {
                      cardStyle = "opacity-50 border-stone-100 text-stone-400";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={hasAnswered}
                      onClick={() => handleOptionClick(idx)}
                      className={`w-full text-left px-4 py-3.5 rounded-xl border transition-all duration-200 flex items-center justify-between text-xs font-sans cursor-pointer ${cardStyle}`}
                    >
                      <span>{option}</span>
                      {icon}
                    </button>
                  );
                })}
              </div>

              {/* Explanation & Next button */}
              {selectedOptionIdx !== null && (
                <div className="space-y-4 pt-2 border-t border-stone-100 animate-fade-in">
                  <div className="bg-[#F4F1EA] p-4 rounded-xl border border-stone-300 space-y-1">
                    <span className="text-xs font-bold text-[#3F4233] block font-serif">Explanation:</span>
                    <p className="text-xs text-[#6B705C] leading-relaxed font-sans">
                      {quizQuestions[currentQuestionIdx].explanation}
                    </p>
                  </div>
                  <button
                    onClick={handleNextQuestion}
                    className="w-full bg-[#3F4233] hover:bg-[#2D302E] text-white font-semibold py-3 rounded-xl transition text-xs shadow-sm cursor-pointer"
                  >
                    {currentQuestionIdx === quizQuestions.length - 1 ? "Finish Challenge" : "Next Question"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
