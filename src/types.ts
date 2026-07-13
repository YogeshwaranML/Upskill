/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CropStats {
  mean: number;
  min: number;
  max: number;
  description: string;
}

export interface FeatureDefinition {
  name: string;
  symbol: string;
  unit: string;
  importance: number;
  description: string;
  significance: string;
}

export interface QuizQuestion {
  question: string;
  options?: string[];
  answer: string;
  explanation: string;
  category: "viva" | "interview";
}
