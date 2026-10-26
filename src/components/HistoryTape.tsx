/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { History, Trash2, ArrowUpRight, Copy, Check, Download, X } from 'lucide-react';
import { HistoryItem, CalculatorTheme } from '../types/calculator';
import { soundFx } from '../utils/soundEffects';

interface HistoryTapeProps {
  history: HistoryItem[];
  theme: CalculatorTheme;
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (result: string) => void;
  onSelectExpression: (expr: string) => void;
  onClearHistory: () => void;
  onDeleteHistoryItem: (id: string) => void;
}

export const HistoryTape: React.FC<HistoryTapeProps> = ({
  history,
  theme,
  isOpen,
  onClose,
  onSelectResult,
  onSelectExpression,
  onClearHistory,
  onDeleteHistoryItem,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [exported, setExported] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    soundFx.playTap('action');
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleExport = () => {
    if (history.length === 0) return;
    const lines = history.map(item => {
      const time = new Date(item.timestamp).toLocaleTimeString();
      return `[${time}] ${item.expression} = ${item.result}`;
    });
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calculator_history_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    soundFx.playTap('action');
    setExported(true);
    setTimeout(() => setExported(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div
        className="w-full max-w-md max-h-[85vh] flex flex-col rounded-3xl glass-panel p-5 sm:p-6 shadow-2xl relative border border-white/15"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div
              className="p-2 rounded-xl"
              style={{ backgroundColor: `${theme.accentColor}20`, color: theme.accentColor }}
            >
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">Calculation Tape</h2>
              <p className="text-xs text-white/50">{history.length} records in memory</p>
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

        {/* History List */}
        <div className="flex-1 overflow-y-auto py-3 space-y-2.5 my-2 pr-1 scrollbar-thin">
          {history.length === 0 ? (
            <div className="py-16 text-center text-white/40">
              <History className="w-10 h-10 mx-auto mb-3 opacity-30 stroke-1" />
              <p className="text-sm font-medium">No calculation history yet</p>
              <p className="text-xs text-white/30 mt-1">Calculations will appear here automatically</p>
            </div>
          ) : (
            history.map(item => (
              <div
                key={item.id}
                className="group relative p-3 rounded-2xl glass-panel-inset hover:border-white/20 transition-all"
              >
                <div className="flex items-center justify-between text-[11px] text-white/40 font-mono mb-1">
                  <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleCopy(item.id, `${item.expression} = ${item.result}`)}
                      className="p-1 rounded text-white/50 hover:text-white transition-colors"
                      title="Copy full entry"
                    >
                      {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => {
                        soundFx.playTap('action');
                        onDeleteHistoryItem(item.id);
                      }}
                      className="p-1 rounded text-white/50 hover:text-red-400 transition-colors"
                      title="Delete entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Expression */}
                <div
                  onClick={() => {
                    soundFx.playTap('number');
                    onSelectExpression(item.expression);
                    onClose();
                  }}
                  className="text-xs font-mono text-white/70 tracking-wide truncate cursor-pointer hover:text-white transition-colors"
                  title="Click to insert expression into calculator"
                >
                  {item.expression}
                </div>

                {/* Result */}
                <div className="flex items-center justify-between mt-1 pt-1">
                  <div
                    onClick={() => {
                      soundFx.playTap('number');
                      onSelectResult(item.result);
                      onClose();
                    }}
                    className="font-orbitron font-bold text-lg cursor-pointer hover:brightness-125 transition-all truncate"
                    style={{ color: theme.accentColor }}
                    title="Click to use result"
                  >
                    = {item.result}
                  </div>
                  <button
                    onClick={() => {
                      soundFx.playTap('number');
                      onSelectResult(item.result);
                      onClose();
                    }}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-sans font-medium text-white/60 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    Use
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        {history.length > 0 && (
          <div className="flex items-center justify-between pt-3 border-t border-white/10 gap-3">
            <button
              onClick={() => {
                soundFx.playTap('action');
                onClearHistory();
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear All
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-white/10 hover:bg-white/20 transition-colors"
            >
              {exported ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Downloaded</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Tape</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
