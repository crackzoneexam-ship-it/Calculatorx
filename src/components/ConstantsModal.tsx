/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Atom, X, Plus } from 'lucide-react';
import { CalculatorTheme } from '../types/calculator';
import { SCIENTIFIC_CONSTANTS } from '../utils/themes';
import { soundFx } from '../utils/soundEffects';

interface ConstantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: CalculatorTheme;
  onInsertConstant: (val: string) => void;
}

export const ConstantsModal: React.FC<ConstantsModalProps> = ({
  isOpen,
  onClose,
  theme,
  onInsertConstant,
}) => {
  const [filter, setFilter] = useState<'All' | 'Physics' | 'Math' | 'Universal'>('All');

  if (!isOpen) return null;

  const filteredList =
    filter === 'All'
      ? SCIENTIFIC_CONSTANTS
      : SCIENTIFIC_CONSTANTS.filter(c => c.category === filter);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div
        className="w-full max-w-lg max-h-[85vh] flex flex-col rounded-3xl glass-panel p-5 sm:p-6 shadow-2xl relative border border-white/15"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div
              className="p-2 rounded-xl"
              style={{ backgroundColor: `${theme.accentColor}20`, color: theme.accentColor }}
            >
              <Atom className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">Scientific Constants</h2>
              <p className="text-xs text-white/50">CODATA fundamental physical and mathematical values</p>
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

        {/* Filter Categories */}
        <div className="flex items-center gap-1.5 py-3">
          {(['All', 'Math', 'Physics', 'Universal'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => {
                soundFx.playTap('number');
                setFilter(cat);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filter === cat
                  ? 'bg-white/20 text-white shadow-sm'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Constants List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin my-1">
          {filteredList.map(item => (
            <div
              key={item.symbol}
              onClick={() => {
                soundFx.playTap('scientific');
                onInsertConstant(item.value.toString());
                onClose();
              }}
              className="group p-3 rounded-2xl glass-panel-inset hover:border-white/20 transition-all cursor-pointer flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-orbitron font-bold text-base shrink-0"
                  style={{
                    backgroundColor: `${theme.accentColor}15`,
                    color: theme.accentColor,
                    border: `1px solid ${theme.accentColor}30`,
                  }}
                >
                  {item.symbol}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-white tracking-tight truncate">
                    {item.name}
                  </div>
                  <div className="text-xs font-mono text-white/50 truncate">
                    {item.value} {item.unit && <span className="text-white/40">({item.unit})</span>}
                  </div>
                </div>
              </div>

              <button
                className="p-2 rounded-xl bg-white/5 group-hover:bg-white/15 text-white/70 group-hover:text-white transition-colors shrink-0"
                title="Insert constant into calculator"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
