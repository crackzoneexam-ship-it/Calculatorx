/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AngleMode = 'DEG' | 'RAD';
export type CalculatorViewMode = 'standard' | 'scientific';

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

export interface CalculatorTheme {
  id: string;
  name: string;
  previewBg: string;
  bgGradient: string;
  accentColor: string;
  accentGlow: string;
  textColor: string;
  operatorColor: string;
  actionColor: string;
  sciColor: string;
  equalBtnStyle: string;
}

export interface UnitCategory {
  name: string;
  units: {
    symbol: string;
    label: string;
    toBase: (val: number) => number;
    fromBase: (val: number) => number;
  }[];
}

export interface ScientificConstant {
  symbol: string;
  name: string;
  value: number;
  unit: string;
  category: 'Physics' | 'Math' | 'Universal';
}
