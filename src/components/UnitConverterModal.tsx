/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowLeftRight, X, ArrowUpRight } from 'lucide-react';
import { CalculatorTheme } from '../types/calculator';
import { UNIT_CATEGORIES } from '../utils/themes';
import { soundFx } from '../utils/soundEffects';

interface UnitConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: CalculatorTheme;
  onInsertValue: (val: string) => void;
}

export const UnitConverterModal: React.FC<UnitConverterModalProps> = ({
  isOpen,
  onClose,
  theme,
  onInsertValue,
}) => {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const currentCategory = UNIT_CATEGORIES[activeCategoryIndex];

  const [fromUnitIndex, setFromUnitIndex] = useState(0);
  const [toUnitIndex, setToUnitIndex] = useState(1);
  const [inputValue, setInputValue] = useState('1');

  if (!isOpen) return null;

  const fromUnit = currentCategory.units[fromUnitIndex] || currentCategory.units[0];
  const toUnit = currentCategory.units[toUnitIndex] || currentCategory.units[1] || currentCategory.units[0];

  const parsedVal = parseFloat(inputValue);
  let convertedResult = '0';
  if (!Number.isNaN(parsedVal)) {
    const baseVal = fromUnit.toBase(parsedVal);
    const converted = toUnit.fromBase(baseVal);
    convertedResult = parseFloat(converted.toPrecision(8)).toString();
  }

  const handleSwap = () => {
    soundFx.playTap('operator');
    const temp = fromUnitIndex;
    setFromUnitIndex(toUnitIndex);
    setToUnitIndex(temp);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div
        className="w-full max-w-md rounded-3xl glass-panel p-5 sm:p-6 shadow-2xl relative border border-white/15"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div
              className="p-2 rounded-xl"
              style={{ backgroundColor: `${theme.accentColor}20`, color: theme.accentColor }}
            >
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">Glass Unit Converter</h2>
              <p className="text-xs text-white/50">Instant conversion across dimensions</p>
            </div>
          </div>
          <button
            onClick={() => {
              soundFx.playTap('action');
              onClose();
            }}
            className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-3 scrollbar-none">
          {UNIT_CATEGORIES.map((cat, idx) => (
            <button
              key={cat.name}
              onClick={() => {
                soundFx.playTap('number');
                setActiveCategoryIndex(idx);
                setFromUnitIndex(0);
                setToUnitIndex(Math.min(1, cat.units.length - 1));
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategoryIndex === idx
                  ? 'bg-white/20 text-white shadow-sm'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Converter Body */}
        <div className="space-y-3.5 mt-1">
          {/* From Box */}
          <div className="glass-panel-inset p-3.5 rounded-2xl">
            <div className="flex items-center justify-between text-xs text-white/50 mb-1.5">
              <span>From</span>
              <select
                value={fromUnitIndex}
                onChange={e => {
                  soundFx.playTap('number');
                  setFromUnitIndex(Number(e.target.value));
                }}
                className="bg-slate-900/80 border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none cursor-pointer"
              >
                {currentCategory.units.map((unit, idx) => (
                  <option key={unit.symbol} value={idx} className="bg-slate-900 text-white">
                    {unit.label}
                  </option>
                ))}
              </select>
            </div>
            <input
              type="number"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              className="w-full bg-transparent font-orbitron font-semibold text-2xl text-white focus:outline-none"
              placeholder="0"
            />
          </div>

          {/* Swap Button */}
          <div className="flex justify-center -my-1">
            <button
              onClick={handleSwap}
              className="p-2 rounded-full glass-button text-white/70 hover:text-white"
              title="Swap units"
            >
              <ArrowLeftRight className="w-4 h-4 rotate-90" />
            </button>
          </div>

          {/* To Box */}
          <div className="glass-panel-inset p-3.5 rounded-2xl">
            <div className="flex items-center justify-between text-xs text-white/50 mb-1.5">
              <span>To</span>
              <select
                value={toUnitIndex}
                onChange={e => {
                  soundFx.playTap('number');
                  setToUnitIndex(Number(e.target.value));
                }}
                className="bg-slate-900/80 border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none cursor-pointer"
              >
                {currentCategory.units.map((unit, idx) => (
                  <option key={unit.symbol} value={idx} className="bg-slate-900 text-white">
                    {unit.label}
                  </option>
                ))}
              </select>
            </div>
            <div
              className="font-orbitron font-bold text-2xl truncate py-0.5"
              style={{ color: theme.accentColor }}
            >
              {convertedResult}
            </div>
          </div>

          {/* Insert converted result into calculator */}
          <button
            onClick={() => {
              soundFx.playTap('equal');
              onInsertValue(convertedResult);
              onClose();
            }}
            className="w-full py-3 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 text-slate-950 transition-all active:scale-95"
            style={{
              backgroundColor: theme.accentColor,
              boxShadow: `0 0 20px ${theme.accentGlow}`,
            }}
          >
            <span>Insert Result into Calculator</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
