/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CalculatorTheme, ScientificConstant, UnitCategory } from '../types/calculator';

export const THEMES: CalculatorTheme[] = [
  {
    id: 'cyber-aurora',
    name: 'Cyber Aurora',
    previewBg: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
    bgGradient: 'from-[#0a151b] via-[#142830] to-[#1c3844]',
    accentColor: '#00e5ff',
    accentGlow: 'rgba(0, 229, 255, 0.45)',
    textColor: '#ffffff',
    operatorColor: '#00e5ff',
    actionColor: '#ff3366',
    sciColor: '#b388ff',
    equalBtnStyle: 'bg-[#00e5ff] text-slate-950 font-bold hover:bg-[#33ebff] shadow-[0_0_25px_rgba(0,229,255,0.6)] active:shadow-[0_0_12px_rgba(0,229,255,0.4)]',
  },
  {
    id: 'obsidian-amber',
    name: 'Obsidian Amber',
    previewBg: 'linear-gradient(135deg, #120f0a, #1f1a14, #2d241c)',
    bgGradient: 'from-[#0d0b07] via-[#1a1510] to-[#261f17]',
    accentColor: '#f59e0b',
    accentGlow: 'rgba(245, 158, 11, 0.45)',
    textColor: '#fef3c7',
    operatorColor: '#fbbf24',
    actionColor: '#f43f5e',
    sciColor: '#fb923c',
    equalBtnStyle: 'bg-amber-400 text-slate-950 font-bold hover:bg-amber-300 shadow-[0_0_25px_rgba(245,158,11,0.6)] active:shadow-[0_0_12px_rgba(245,158,11,0.4)]',
  },
  {
    id: 'amethyst-nebula',
    name: 'Amethyst Nebula',
    previewBg: 'linear-gradient(135deg, #190b28, #2a1244, #3d1b63)',
    bgGradient: 'from-[#12071d] via-[#210d35] to-[#311450]',
    accentColor: '#d946ef',
    accentGlow: 'rgba(217, 70, 239, 0.45)',
    textColor: '#fae8ff',
    operatorColor: '#e879f9',
    actionColor: '#f43f5e',
    sciColor: '#a855f7',
    equalBtnStyle: 'bg-fuchsia-500 text-white font-bold hover:bg-fuchsia-400 shadow-[0_0_25px_rgba(217,70,239,0.6)] active:shadow-[0_0_12px_rgba(217,70,239,0.4)]',
  },
  {
    id: 'glacier-ice',
    name: 'Glacier Ice',
    previewBg: 'linear-gradient(135deg, #0b1c28, #122b3d, #1b3d56)',
    bgGradient: 'from-[#07131b] via-[#0d2130] to-[#143247]',
    accentColor: '#38bdf8',
    accentGlow: 'rgba(56, 189, 248, 0.45)',
    textColor: '#f0f9ff',
    operatorColor: '#7dd3fc',
    actionColor: '#fb7185',
    sciColor: '#818cf8',
    equalBtnStyle: 'bg-sky-400 text-slate-950 font-bold hover:bg-sky-300 shadow-[0_0_25px_rgba(56,189,248,0.6)] active:shadow-[0_0_12px_rgba(56,189,248,0.4)]',
  },
  {
    id: 'emerald-matrix',
    name: 'Emerald Matrix',
    previewBg: 'linear-gradient(135deg, #071e16, #0d2f24, #144434)',
    bgGradient: 'from-[#04130e] via-[#09221a] to-[#0f3427]',
    accentColor: '#10b981',
    accentGlow: 'rgba(16, 185, 129, 0.45)',
    textColor: '#ecfdf5',
    operatorColor: '#34d399',
    actionColor: '#f43f5e',
    sciColor: '#6ee7b7',
    equalBtnStyle: 'bg-emerald-400 text-slate-950 font-bold hover:bg-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.6)] active:shadow-[0_0_12px_rgba(16,185,129,0.4)]',
  },
];

export const SCIENTIFIC_CONSTANTS: ScientificConstant[] = [
  { symbol: 'π', name: 'Pi', value: Math.PI, unit: '', category: 'Math' },
  { symbol: 'e', name: "Euler's Number", value: Math.E, unit: '', category: 'Math' },
  { symbol: 'φ', name: 'Golden Ratio', value: 1.618033988749895, unit: '', category: 'Math' },
  { symbol: 'c', name: 'Speed of Light', value: 299792458, unit: 'm/s', category: 'Physics' },
  { symbol: 'G', name: 'Gravitational Constant', value: 6.67430e-11, unit: 'm³/(kg·s²)', category: 'Physics' },
  { symbol: 'h', name: "Planck's Constant", value: 6.62607015e-34, unit: 'J·s', category: 'Physics' },
  { symbol: 'ħ', name: 'Reduced Planck Constant', value: 1.054571817e-34, unit: 'J·s', category: 'Physics' },
  { symbol: 'k', name: "Boltzmann Constant", value: 1.380649e-23, unit: 'J/K', category: 'Physics' },
  { symbol: 'N_A', name: "Avogadro's Number", value: 6.02214076e23, unit: 'mol⁻¹', category: 'Universal' },
  { symbol: 'q_e', name: 'Elementary Charge', value: 1.602176634e-19, unit: 'C', category: 'Universal' },
  { symbol: 'm_e', name: 'Electron Mass', value: 9.1093837e-31, unit: 'kg', category: 'Physics' },
  { symbol: 'm_p', name: 'Proton Mass', value: 1.67262192e-27, unit: 'kg', category: 'Physics' },
  { symbol: 'R', name: 'Gas Constant', value: 8.314462618, unit: 'J/(mol·K)', category: 'Universal' },
  { symbol: 'g', name: 'Standard Gravity', value: 9.80665, unit: 'm/s²', category: 'Physics' },
];

export const UNIT_CATEGORIES: UnitCategory[] = [
  {
    name: 'Length',
    units: [
      { symbol: 'm', label: 'Meters (m)', toBase: v => v, fromBase: v => v },
      { symbol: 'km', label: 'Kilometers (km)', toBase: v => v * 1000, fromBase: v => v / 1000 },
      { symbol: 'cm', label: 'Centimeters (cm)', toBase: v => v * 0.01, fromBase: v => v / 0.01 },
      { symbol: 'mm', label: 'Millimeters (mm)', toBase: v => v * 0.001, fromBase: v => v / 0.001 },
      { symbol: 'mi', label: 'Miles (mi)', toBase: v => v * 1609.344, fromBase: v => v / 1609.344 },
      { symbol: 'yd', label: 'Yards (yd)', toBase: v => v * 0.9144, fromBase: v => v / 0.9144 },
      { symbol: 'ft', label: 'Feet (ft)', toBase: v => v * 0.3048, fromBase: v => v / 0.3048 },
      { symbol: 'in', label: 'Inches (in)', toBase: v => v * 0.0254, fromBase: v => v / 0.0254 },
    ],
  },
  {
    name: 'Mass & Weight',
    units: [
      { symbol: 'kg', label: 'Kilograms (kg)', toBase: v => v, fromBase: v => v },
      { symbol: 'g', label: 'Grams (g)', toBase: v => v / 1000, fromBase: v => v * 1000 },
      { symbol: 'mg', label: 'Milligrams (mg)', toBase: v => v / 1000000, fromBase: v => v * 1000000 },
      { symbol: 'lb', label: 'Pounds (lb)', toBase: v => v * 0.45359237, fromBase: v => v / 0.45359237 },
      { symbol: 'oz', label: 'Ounces (oz)', toBase: v => v * 0.0283495, fromBase: v => v / 0.0283495 },
      { symbol: 'ton', label: 'Metric Tons (t)', toBase: v => v * 1000, fromBase: v => v / 1000 },
    ],
  },
  {
    name: 'Temperature',
    units: [
      { symbol: '°C', label: 'Celsius (°C)', toBase: v => v, fromBase: v => v },
      { symbol: '°F', label: 'Fahrenheit (°F)', toBase: v => (v - 32) * (5 / 9), fromBase: v => v * (9 / 5) + 32 },
      { symbol: 'K', label: 'Kelvin (K)', toBase: v => v - 273.15, fromBase: v => v + 273.15 },
    ],
  },
  {
    name: 'Speed',
    units: [
      { symbol: 'm/s', label: 'Meters per sec (m/s)', toBase: v => v, fromBase: v => v },
      { symbol: 'km/h', label: 'Kilometers per hour (km/h)', toBase: v => v / 3.6, fromBase: v => v * 3.6 },
      { symbol: 'mph', label: 'Miles per hour (mph)', toBase: v => v * 0.44704, fromBase: v => v / 0.44704 },
      { symbol: 'knot', label: 'Knots (kn)', toBase: v => v * 0.514444, fromBase: v => v / 0.514444 },
    ],
  },
  {
    name: 'Data Storage',
    units: [
      { symbol: 'B', label: 'Bytes (B)', toBase: v => v, fromBase: v => v },
      { symbol: 'KB', label: 'Kilobytes (KB)', toBase: v => v * 1024, fromBase: v => v / 1024 },
      { symbol: 'MB', label: 'Megabytes (MB)', toBase: v => v * Math.pow(1024, 2), fromBase: v => v / Math.pow(1024, 2) },
      { symbol: 'GB', label: 'Gigabytes (GB)', toBase: v => v * Math.pow(1024, 3), fromBase: v => v / Math.pow(1024, 3) },
      { symbol: 'TB', label: 'Terabytes (TB)', toBase: v => v * Math.pow(1024, 4), fromBase: v => v / Math.pow(1024, 4) },
    ],
  },
];
