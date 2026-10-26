/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  Volume2,
  VolumeX,
  History,
  Palette,
  ArrowLeftRight,
  Atom,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

import { AngleMode, CalculatorTheme, CalculatorViewMode, HistoryItem } from './types/calculator';
import { THEMES } from './utils/themes';
import { evaluateExpression, formatExpressionForDisplay } from './utils/mathEngine';
import { soundFx } from './utils/soundEffects';
import { Display } from './components/Display';
import { Keypad } from './components/Keypad';
import { HistoryTape } from './components/HistoryTape';
import { UnitConverterModal } from './components/UnitConverterModal';
import { ConstantsModal } from './components/ConstantsModal';

const HISTORY_STORAGE_KEY = 'glass_calc_history_v2';
const THEME_STORAGE_KEY = 'glass_calc_theme_v2';
const ANGLE_STORAGE_KEY = 'glass_calc_angle_v2';
const VIEW_STORAGE_KEY = 'glass_calc_view_v2';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState<CalculatorTheme>(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return THEMES.find(t => t.id === saved) || THEMES[0];
  });
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  // Audio mute state
  const [isMuted, setIsMuted] = useState<boolean>(() => soundFx.getMuted());

  // Angle Mode (DEG vs RAD)
  const [angleMode, setAngleMode] = useState<AngleMode>(() => {
    return (localStorage.getItem(ANGLE_STORAGE_KEY) as AngleMode) || 'DEG';
  });

  // View Mode (Standard vs Scientific)
  const [viewMode, setViewMode] = useState<CalculatorViewMode>(() => {
    return (localStorage.getItem(VIEW_STORAGE_KEY) as CalculatorViewMode) || 'standard';
  });

  // 2nd Function active state
  const [isSecondActive, setIsSecondActive] = useState<boolean>(false);

  // Core Calculator state
  const [expression, setExpression] = useState<string>('');
  const [lastCalculatedResult, setLastCalculatedResult] = useState<string>('0');
  const [historyText, setHistoryText] = useState<string>('');
  const [isResultDisplayed, setIsResultDisplayed] = useState<boolean>(false);
  const [memoryValue, setMemoryValue] = useState<number>(0);

  // Active key indicator for physical keyboard presses
  const [activeKeyChar, setActiveKeyChar] = useState<string | null>(null);

  // History records
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals state
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isConverterOpen, setIsConverterOpen] = useState(false);
  const [isConstantsOpen, setIsConstantsOpen] = useState(false);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history.slice(0, 50)));
  }, [history]);

  // Save preferences
  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, theme.id);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(ANGLE_STORAGE_KEY, angleMode);
  }, [angleMode]);

  useEffect(() => {
    localStorage.setItem(VIEW_STORAGE_KEY, viewMode);
  }, [viewMode]);

  // Compute live preview of current expression
  const livePreview = useMemo(() => {
    if (!expression || isResultDisplayed) return null;
    // Don't preview bare numbers or trailing operators
    if (/^[\d.]+$/.test(expression) || /[+\-*/^]$/.test(expression)) return null;

    const { result, error } = evaluateExpression(expression, angleMode);
    if (error || result === 'Error') return null;
    return result;
  }, [expression, angleMode, isResultDisplayed]);

  // Append token to expression
  const handleAppend = useCallback(
    (token: string) => {
      soundFx.triggerHaptic(8);

      setExpression(prev => {
        const isDigit = /^[0-9]$/.test(token);
        const isOperator = /^[+\-*/%^]$/.test(token);

        // If result was just displayed:
        if (isResultDisplayed) {
          setIsResultDisplayed(false);
          // If starting with a digit or function, reset expression
          if (isDigit || token.endsWith('(') || token === 'π' || token === 'e') {
            return token;
          }
          // If starting with operator, chain onto last calculated result
          if (isOperator) {
            return lastCalculatedResult + token;
          }
        }

        // Prevent double decimals in the current number segment
        if (token === '.') {
          const parts = prev.split(/[\s+\-*/%^()]+/);
          const currentPart = parts[parts.length - 1];
          if (currentPart && currentPart.includes('.')) {
            return prev;
          }
          if (!prev || /[+\-*/%^()]$/.test(prev)) {
            return prev + '0.';
          }
        }

        // Avoid consecutive operators (e.g. replace '+' with '*')
        if (isOperator && prev.length > 0) {
          const lastChar = prev.slice(-1);
          if (/[+\-*/^]/.test(lastChar)) {
            return prev.slice(0, -1) + token;
          }
        }

        return prev + token;
      });
    },
    [isResultDisplayed, lastCalculatedResult]
  );

  // Clear all
  const handleClearAll = useCallback(() => {
    soundFx.triggerHaptic(12);
    setExpression('');
    setLastCalculatedResult('0');
    setHistoryText('');
    setIsResultDisplayed(false);
  }, []);

  // Delete last character or function token
  const handleDeleteLast = useCallback(() => {
    soundFx.triggerHaptic(8);
    setExpression(prev => {
      if (isResultDisplayed) {
        setIsResultDisplayed(false);
        return '';
      }
      if (!prev) return '';

      // Check if ending with a function like 'sin(', 'cos(', 'asin(', etc.
      const match = prev.match(/(sin|cos|tan|asin|acos|atan|sinh|cosh|tanh|log|ln|sqrt|cbrt|10\^|e\^)\($/);
      if (match) {
        return prev.slice(0, -match[0].length);
      }

      return prev.slice(0, -1);
    });
  }, [isResultDisplayed]);

  // Calculate result
  const handleCalculate = useCallback(() => {
    if (!expression || expression.trim() === '') return;
    soundFx.triggerHaptic(15);

    const { result, error, rawValue } = evaluateExpression(expression, angleMode);

    if (error || result === 'Error') {
      setHistoryText(formatExpressionForDisplay(expression) + ' =');
      setLastCalculatedResult('Error');
      setIsResultDisplayed(true);
      return;
    }

    // Success calculation
    const formattedExpr = formatExpressionForDisplay(expression);
    setHistoryText(formattedExpr + ' =');
    setLastCalculatedResult(result);
    setIsResultDisplayed(true);

    // Add to history tape
    const newItem: HistoryItem = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      expression: formattedExpr,
      result,
      timestamp: Date.now(),
    };
    setHistory(prev => [newItem, ...prev.slice(0, 49)]);

    // Trigger subtle confetti on interesting results
    if (result === '42' || result === '3.14159265359' || result === '0') {
      try {
        confetti({
          particleCount: 30,
          spread: 60,
          origin: { y: 0.7 },
          colors: [theme.accentColor, theme.sciColor, '#ffffff'],
        });
      } catch {
        // No-op
      }
    }
  }, [expression, angleMode, theme]);

  // Memory functions
  const handleClearMemory = () => setMemoryValue(0);
  const handleRecallMemory = () => {
    handleAppend(memoryValue.toString());
  };
  const handleAddToMemory = () => {
    const val = parseFloat(isResultDisplayed ? lastCalculatedResult : livePreview || expression || '0');
    if (!Number.isNaN(val)) setMemoryValue(prev => prev + val);
  };
  const handleSubtractFromMemory = () => {
    const val = parseFloat(isResultDisplayed ? lastCalculatedResult : livePreview || expression || '0');
    if (!Number.isNaN(val)) setMemoryValue(prev => prev - val);
  };
  const handleStoreMemory = () => {
    const val = parseFloat(isResultDisplayed ? lastCalculatedResult : livePreview || expression || '0');
    if (!Number.isNaN(val)) setMemoryValue(val);
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when focusing on form inputs (e.g. Unit converter)
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) {
        return;
      }

      const key = e.key;
      let handled = false;

      // Temporary key highlight flash
      setActiveKeyChar(key);
      setTimeout(() => setActiveKeyChar(null), 150);

      if (key >= '0' && key <= '9') {
        soundFx.playTap('number');
        handleAppend(key);
        handled = true;
      } else if (key === '.') {
        soundFx.playTap('number');
        handleAppend('.');
        handled = true;
      } else if (key === '+' || key === '-' || key === '*' || key === '/' || key === '%') {
        soundFx.playTap('operator');
        handleAppend(key);
        handled = true;
      } else if (key === '^') {
        soundFx.playTap('scientific');
        handleAppend('^');
        handled = true;
      } else if (key === '(' || key === ')') {
        soundFx.playTap('scientific');
        handleAppend(key);
        handled = true;
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        soundFx.playTap('equal');
        handleCalculate();
        handled = true;
      } else if (key === 'Backspace') {
        soundFx.playTap('action');
        handleDeleteLast();
        handled = true;
      } else if (key === 'Escape') {
        soundFx.playTap('action');
        handleClearAll();
        handled = true;
      } else if (key.toLowerCase() === 's') {
        soundFx.playTap('scientific');
        handleAppend('sin(');
        handled = true;
      } else if (key.toLowerCase() === 'c') {
        soundFx.playTap('scientific');
        handleAppend('cos(');
        handled = true;
      } else if (key.toLowerCase() === 't') {
        soundFx.playTap('scientific');
        handleAppend('tan(');
        handled = true;
      } else if (key.toLowerCase() === 'l') {
        soundFx.playTap('scientific');
        handleAppend('log(');
        handled = true;
      } else if (key.toLowerCase() === 'p') {
        soundFx.playTap('scientific');
        handleAppend('π');
        handled = true;
      }

      if (handled) {
        // Stop default browser scroll/search behaviors
        if (key === '/' || key === "'") {
          e.preventDefault();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleAppend, handleCalculate, handleDeleteLast, handleClearAll]);

  return (
    <div
      className={`min-h-screen w-full flex flex-col justify-between p-3 sm:p-6 transition-colors duration-700 bg-gradient-to-br ${theme.bgGradient} relative select-none overflow-x-hidden`}
    >
      {/* Background Ambient Glow Orbs */}
      <div
        className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-[120px] pointer-events-none opacity-20"
        style={{ backgroundColor: theme.accentColor }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full blur-[130px] pointer-events-none opacity-20"
        style={{ backgroundColor: theme.sciColor }}
      />

      {/* Top Application Bar */}
      <header className="max-w-md w-full mx-auto flex items-center justify-between pb-3 sm:pb-4 border-b border-white/10 relative z-20">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center font-orbitron font-bold text-sm shadow-lg border border-white/20"
            style={{
              backgroundColor: `${theme.accentColor}25`,
              color: theme.accentColor,
            }}
          >
            GL
          </div>
          <span className="font-semibold text-sm tracking-wide text-white whitespace-nowrap">
            Premium Glass
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* History tape toggle */}
          <button
            onClick={() => {
              soundFx.playTap('action');
              setIsHistoryOpen(true);
            }}
            className="p-2 rounded-xl glass-button text-white/70 hover:text-white relative"
            title="Calculation History Tape"
          >
            <History className="w-4 h-4" />
            {history.length > 0 && (
              <span
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center text-slate-950 font-mono shadow-sm"
                style={{ backgroundColor: theme.accentColor }}
              >
                {history.length > 99 ? '99+' : history.length}
              </span>
            )}
          </button>

          {/* Unit Converter toggle */}
          <button
            onClick={() => {
              soundFx.playTap('action');
              setIsConverterOpen(true);
            }}
            className="p-2 rounded-xl glass-button text-white/70 hover:text-white"
            title="Unit Converter"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>

          {/* Constants library */}
          <button
            onClick={() => {
              soundFx.playTap('action');
              setIsConstantsOpen(true);
            }}
            className="p-2 rounded-xl glass-button text-white/70 hover:text-white"
            title="Constants Library"
          >
            <Atom className="w-4 h-4" />
          </button>

          {/* Audio toggle */}
          <button
            onClick={() => {
              const newMuted = soundFx.toggleMute();
              setIsMuted(newMuted);
            }}
            className="p-2 rounded-xl glass-button text-white/70 hover:text-white"
            title={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Theme switcher dropdown toggle */}
          <div className="relative">
            <button
              onClick={() => {
                soundFx.playTap('action');
                setShowThemeMenu(prev => !prev);
              }}
              className="p-2 rounded-xl glass-button text-white/70 hover:text-white"
              title="Change Glass Theme"
            >
              <Palette className="w-4 h-4" />
            </button>

            {showThemeMenu && (
              <div
                className="absolute right-0 mt-2 w-48 rounded-2xl glass-panel p-2 shadow-2xl z-50 border border-white/20 animate-fadeIn"
                onClick={e => e.stopPropagation()}
              >
                <div className="text-[11px] font-semibold text-white/50 px-2 py-1 uppercase tracking-wider">
                  Select Theme
                </div>
                {THEMES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => {
                      soundFx.playTap('action');
                      setTheme(t);
                      setShowThemeMenu(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium transition-all ${
                      theme.id === t.id
                        ? 'bg-white/20 text-white font-semibold'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-sm"
                      style={{ background: t.previewBg }}
                    />
                    <span>{t.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Glass Calculator Container */}
      <main className="my-auto py-2 sm:py-4 flex justify-center items-center w-full relative z-10">
        <div
          className={`calculator w-full max-w-[390px] sm:max-w-[430px] rounded-3xl glass-panel p-4 sm:p-6 transition-all duration-300 relative border border-white/15`}
        >
          {/* Mode Switcher Tabs (Standard vs Scientific) */}
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-1 p-1 bg-black/30 rounded-xl border border-white/10">
              <button
                onClick={() => {
                  soundFx.playTap('action');
                  setViewMode('standard');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'standard'
                    ? 'bg-white/20 text-white shadow-sm'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                Standard
              </button>
              <button
                onClick={() => {
                  soundFx.playTap('scientific');
                  setViewMode('scientific');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'scientific'
                    ? 'bg-white/20 text-white shadow-sm'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                Scientific
              </button>
            </div>

            {/* Quick reset / AC helper */}
            <button
              onClick={() => {
                soundFx.playTap('action');
                handleClearAll();
              }}
              className="text-xs text-white/40 hover:text-white/80 transition-colors flex items-center gap-1 px-2 py-1 rounded"
              title="Reset state"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Digital Display with Orbitron Font and live preview */}
          <Display
            expression={formatExpressionForDisplay(expression)}
            result={lastCalculatedResult}
            livePreview={livePreview}
            historyText={historyText}
            angleMode={angleMode}
            onToggleAngleMode={() => setAngleMode(prev => (prev === 'DEG' ? 'RAD' : 'DEG'))}
            memoryValue={memoryValue}
            theme={theme}
            isSecondActive={isSecondActive}
            onClearMemory={handleClearMemory}
            onRecallMemory={handleRecallMemory}
            onAddToMemory={handleAddToMemory}
            onSubtractFromMemory={handleSubtractFromMemory}
            onStoreMemory={handleStoreMemory}
          />

          {/* Tactile Keypad */}
          <Keypad
            viewMode={viewMode}
            theme={theme}
            isSecondActive={isSecondActive}
            onToggleSecond={() => setIsSecondActive(prev => !prev)}
            onAppend={handleAppend}
            onClearAll={handleClearAll}
            onDeleteLast={handleDeleteLast}
            onCalculate={handleCalculate}
            activeKeyChar={activeKeyChar}
          />
        </div>
      </main>

      {/* Footer info / keyboard hint */}
      <footer className="max-w-md w-full mx-auto text-center pt-2 pb-1 text-white/40 text-xs font-mono relative z-10 flex items-center justify-between">
        <span className="hidden sm:inline">Keyboard support: Numbers, +, -, *, /, Enter, Backspace, Esc</span>
        <span className="sm:hidden mx-auto">Glass Optics Engine</span>
        <span className="hidden sm:inline text-right opacity-60">High-Precision Math</span>
      </footer>

      {/* Slide-over Modals */}
      <HistoryTape
        history={history}
        theme={theme}
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelectResult={res => {
          setExpression(res);
          setIsResultDisplayed(false);
        }}
        onSelectExpression={expr => {
          setExpression(expr.replace(/×/g, '*').replace(/÷/g, '/'));
          setIsResultDisplayed(false);
        }}
        onClearHistory={() => setHistory([])}
        onDeleteHistoryItem={id => setHistory(prev => prev.filter(item => item.id !== id))}
      />

      <UnitConverterModal
        isOpen={isConverterOpen}
        onClose={() => setIsConverterOpen(false)}
        theme={theme}
        onInsertValue={val => handleAppend(val)}
      />

      <ConstantsModal
        isOpen={isConstantsOpen}
        onClose={() => setIsConstantsOpen(false)}
        theme={theme}
        onInsertConstant={val => handleAppend(val)}
      />
    </div>
  );
}
