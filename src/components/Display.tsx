/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { AngleMode, CalculatorTheme } from '../types/calculator';
import { soundFx } from '../utils/soundEffects';

interface DisplayProps {
  expression: string;
  result: string;
  livePreview: string | null;
  historyText: string;
  angleMode: AngleMode;
  onToggleAngleMode: () => void;
  memoryValue: number;
  theme: CalculatorTheme;
  isSecondActive: boolean;
  onClearMemory: () => void;
  onRecallMemory: () => void;
  onAddToMemory: () => void;
  onSubtractFromMemory: () => void;
  onStoreMemory: () => void;
}

export const Display: React.FC<DisplayProps> = ({
  expression,
  result,
  livePreview,
  historyText,
  angleMode,
  onToggleAngleMode,
  memoryValue,
  theme,
  isSecondActive,
  onClearMemory,
  onRecallMemory,
  onAddToMemory,
  onSubtractFromMemory,
  onStoreMemory,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = result && result !== '0' ? result : expression;
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    soundFx.playTap('action');
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  // Determine font size dynamically based on length of display text
  const displayText = expression || result || '0';
  const getFontSizeClass = (text: string) => {
    const len = text.length;
    if (len > 24) return 'text-xl sm:text-2xl';
    if (len > 16) return 'text-2xl sm:text-3xl';
    if (len > 10) return 'text-3xl sm:text-4xl';
    return 'text-4xl sm:text-5xl';
  };

  return (
    <div className="glass-panel-inset rounded-2xl p-4 sm:p-5 mb-4 relative transition-all duration-300">
      {/* Top indicator bar */}
      <div className="flex items-center justify-between text-xs font-mono tracking-wider mb-2 text-white/60">
        <div className="flex items-center gap-2">
          {/* Angle Mode DEG / RAD clickable toggle */}
          <button
            onClick={() => {
              soundFx.playTap('scientific');
              onToggleAngleMode();
            }}
            className="px-2 py-0.5 rounded text-[11px] font-semibold transition-all border border-white/10 hover:border-white/30"
            style={{
              color: theme.accentColor,
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
            }}
            title="Click to toggle Degree / Radian mode"
          >
            {angleMode}
          </button>

          {/* 2nd function indicator */}
          {isSecondActive && (
            <span
              className="px-1.5 py-0.5 rounded text-[10px] font-bold animate-pulse"
              style={{
                color: theme.sciColor,
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
              }}
            >
              2ND
            </span>
          )}

          {/* Memory Active Indicator */}
          {memoryValue !== 0 && (
            <span
              className="px-1.5 py-0.5 rounded text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
              title={`Memory Stored: ${memoryValue}`}
            >
              M
            </span>
          )}
        </div>

        {/* Copy current result button */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 rounded text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          title="Copy result to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px] text-emerald-400 font-sans">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span className="text-[11px] font-sans">Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Memory Quick Bar */}
      <div className="flex items-center justify-between text-[11px] font-mono text-white/50 mb-3 border-b border-white/5 pb-2">
        <button
          onClick={() => {
            soundFx.playTap('action');
            onClearMemory();
          }}
          disabled={memoryValue === 0}
          className="hover:text-white disabled:opacity-30 disabled:hover:text-white/50 transition-colors px-1.5 py-0.5 rounded"
          title="Clear Memory (MC)"
        >
          MC
        </button>
        <button
          onClick={() => {
            soundFx.playTap('action');
            onRecallMemory();
          }}
          disabled={memoryValue === 0}
          className="hover:text-white disabled:opacity-30 disabled:hover:text-white/50 transition-colors px-1.5 py-0.5 rounded"
          title="Recall Memory (MR)"
        >
          MR
        </button>
        <button
          onClick={() => {
            soundFx.playTap('action');
            onAddToMemory();
          }}
          className="hover:text-white transition-colors px-1.5 py-0.5 rounded"
          title="Add to Memory (M+)"
        >
          M+
        </button>
        <button
          onClick={() => {
            soundFx.playTap('action');
            onSubtractFromMemory();
          }}
          className="hover:text-white transition-colors px-1.5 py-0.5 rounded"
          title="Subtract from Memory (M-)"
        >
          M-
        </button>
        <button
          onClick={() => {
            soundFx.playTap('action');
            onStoreMemory();
          }}
          className="hover:text-white transition-colors px-1.5 py-0.5 rounded"
          title="Store Current Value to Memory (MS)"
        >
          MS
        </button>
      </div>

      {/* History breadcrumb line */}
      <div
        className="min-h-[22px] text-xs sm:text-sm font-mono tracking-wide text-right overflow-x-auto whitespace-nowrap scrollbar-none transition-colors"
        style={{ color: theme.accentColor }}
      >
        {historyText || '\u00A0'}
      </div>

      {/* Primary Display Number/Formula in Orbitron Font */}
      <div className="mt-1 text-right overflow-x-auto scrollbar-none">
        <div
          className={`font-orbitron font-semibold tracking-wide text-white transition-all select-all ${getFontSizeClass(
            displayText
          )}`}
          style={{
            textShadow: `0 0 14px ${theme.accentGlow}`,
          }}
        >
          {displayText}
        </div>
      </div>

      {/* Real-time live result preview */}
      <div className="min-h-[20px] text-right mt-1.5 text-xs sm:text-sm font-mono text-white/40 tracking-wider">
        {livePreview && livePreview !== displayText && livePreview !== 'Error' ? (
          <span>= {livePreview}</span>
        ) : (
          '\u00A0'
        )}
      </div>
    </div>
  );
};
