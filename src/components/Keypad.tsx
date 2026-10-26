/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CalculatorTheme, CalculatorViewMode } from '../types/calculator';
import { soundFx } from '../utils/soundEffects';

interface KeypadProps {
  viewMode: CalculatorViewMode;
  theme: CalculatorTheme;
  isSecondActive: boolean;
  onToggleSecond: () => void;
  onAppend: (token: string, type?: 'number' | 'operator' | 'scientific') => void;
  onClearAll: () => void;
  onDeleteLast: () => void;
  onCalculate: () => void;
  activeKeyChar?: string | null;
}

export const Keypad: React.FC<KeypadProps> = ({
  viewMode,
  theme,
  isSecondActive,
  onToggleSecond,
  onAppend,
  onClearAll,
  onDeleteLast,
  onCalculate,
  activeKeyChar,
}) => {
  const isKeyPressed = (char: string) => activeKeyChar === char;

  return (
    <div className="flex flex-col gap-2.5">
      {/* Expanded Scientific Matrix when viewMode is 'scientific' */}
      {viewMode === 'scientific' && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-2.5 transition-all animate-fadeIn">
          {/* 2nd toggle key */}
          <button
            onClick={() => {
              soundFx.playTap('scientific');
              onToggleSecond();
            }}
            className={`glass-button py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              isSecondActive
                ? 'bg-purple-500/30 border-purple-400 text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                : 'text-white/70 hover:text-white'
            }`}
            title="Toggle secondary functions"
          >
            2nd
          </button>

          {/* Sin / Asin */}
          <button
            onClick={() => {
              soundFx.playTap('scientific');
              onAppend(isSecondActive ? 'asin(' : 'sin(', 'scientific');
            }}
            className="glass-button py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold"
            style={{ color: theme.sciColor }}
          >
            {isSecondActive ? 'sin⁻¹' : 'sin'}
          </button>

          {/* Cos / Acos */}
          <button
            onClick={() => {
              soundFx.playTap('scientific');
              onAppend(isSecondActive ? 'acos(' : 'cos(', 'scientific');
            }}
            className="glass-button py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold"
            style={{ color: theme.sciColor }}
          >
            {isSecondActive ? 'cos⁻¹' : 'cos'}
          </button>

          {/* Tan / Atan */}
          <button
            onClick={() => {
              soundFx.playTap('scientific');
              onAppend(isSecondActive ? 'atan(' : 'tan(', 'scientific');
            }}
            className="glass-button py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold"
            style={{ color: theme.sciColor }}
          >
            {isSecondActive ? 'tan⁻¹' : 'tan'}
          </button>

          {/* Pi / e */}
          <button
            onClick={() => {
              soundFx.playTap('scientific');
              onAppend(isSecondActive ? 'e' : 'π', 'scientific');
            }}
            className="glass-button py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold"
            style={{ color: theme.sciColor }}
          >
            {isSecondActive ? 'e' : 'π'}
          </button>

          {/* Log / 10^x */}
          <button
            onClick={() => {
              soundFx.playTap('scientific');
              onAppend(isSecondActive ? '10^(' : 'log(', 'scientific');
            }}
            className="glass-button py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold"
            style={{ color: theme.sciColor }}
          >
            {isSecondActive ? '10ˣ' : 'log'}
          </button>

          {/* Ln / e^x */}
          <button
            onClick={() => {
              soundFx.playTap('scientific');
              onAppend(isSecondActive ? 'e^(' : 'ln(', 'scientific');
            }}
            className="glass-button py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold"
            style={{ color: theme.sciColor }}
          >
            {isSecondActive ? 'eˣ' : 'ln'}
          </button>

          {/* Sqrt / x² */}
          <button
            onClick={() => {
              soundFx.playTap('scientific');
              onAppend(isSecondActive ? '^2' : 'sqrt(', 'scientific');
            }}
            className="glass-button py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold"
            style={{ color: theme.sciColor }}
          >
            {isSecondActive ? 'x²' : '√'}
          </button>

          {/* Power x^y / cbrt */}
          <button
            onClick={() => {
              soundFx.playTap('scientific');
              onAppend(isSecondActive ? 'cbrt(' : '^', 'scientific');
            }}
            className="glass-button py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold"
            style={{ color: theme.sciColor }}
          >
            {isSecondActive ? '∛' : 'xʸ'}
          </button>

          {/* Factorial / Reciprocal (1/x) */}
          <button
            onClick={() => {
              soundFx.playTap('scientific');
              onAppend(isSecondActive ? '1/(' : '!', 'scientific');
            }}
            className="glass-button py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold"
            style={{ color: theme.sciColor }}
          >
            {isSecondActive ? '1/x' : 'n!'}
          </button>
        </div>
      )}

      {/* Primary Keypad Grid */}
      <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
        {/* Row 1: If standard view, show the quick scientific row as requested in original prompt */}
        {viewMode === 'standard' && (
          <>
            <button
              onClick={() => {
                soundFx.playTap('scientific');
                onAppend('sin(', 'scientific');
              }}
              className="glass-button py-3 sm:py-3.5 rounded-xl text-sm font-semibold"
              style={{ color: theme.sciColor }}
            >
              sin
            </button>
            <button
              onClick={() => {
                soundFx.playTap('scientific');
                onAppend('cos(', 'scientific');
              }}
              className="glass-button py-3 sm:py-3.5 rounded-xl text-sm font-semibold"
              style={{ color: theme.sciColor }}
            >
              cos
            </button>
            <button
              onClick={() => {
                soundFx.playTap('scientific');
                onAppend('tan(', 'scientific');
              }}
              className="glass-button py-3 sm:py-3.5 rounded-xl text-sm font-semibold"
              style={{ color: theme.sciColor }}
            >
              tan
            </button>
            <button
              onClick={() => {
                soundFx.playTap('scientific');
                onAppend('log(', 'scientific');
              }}
              className="glass-button py-3 sm:py-3.5 rounded-xl text-sm font-semibold"
              style={{ color: theme.sciColor }}
            >
              log
            </button>

            <button
              onClick={() => {
                soundFx.playTap('scientific');
                onAppend('sqrt(', 'scientific');
              }}
              className="glass-button py-3 sm:py-3.5 rounded-xl text-base font-semibold"
              style={{ color: theme.sciColor }}
            >
              √
            </button>
            <button
              onClick={() => {
                soundFx.playTap('scientific');
                onAppend('^', 'scientific');
              }}
              className="glass-button py-3 sm:py-3.5 rounded-xl text-sm font-semibold"
              style={{ color: theme.sciColor }}
            >
              xʸ
            </button>
            <button
              onClick={() => {
                soundFx.playTap('scientific');
                onAppend('(', 'scientific');
              }}
              className={`glass-button py-3 sm:py-3.5 rounded-xl text-base font-semibold ${
                isKeyPressed('(') ? 'active-key' : ''
              }`}
              style={{ color: theme.sciColor }}
            >
              (
            </button>
            <button
              onClick={() => {
                soundFx.playTap('scientific');
                onAppend(')', 'scientific');
              }}
              className={`glass-button py-3 sm:py-3.5 rounded-xl text-base font-semibold ${
                isKeyPressed(')') ? 'active-key' : ''
              }`}
              style={{ color: theme.sciColor }}
            >
              )
            </button>
          </>
        )}

        {/* In scientific view, parentheses take place on row with AC/DEL */}
        {viewMode === 'scientific' && (
          <>
            <button
              onClick={() => {
                soundFx.playTap('scientific');
                onAppend('(', 'scientific');
              }}
              className={`glass-button py-3 sm:py-3.5 rounded-xl text-base font-semibold ${
                isKeyPressed('(') ? 'active-key' : ''
              }`}
              style={{ color: theme.sciColor }}
            >
              (
            </button>
            <button
              onClick={() => {
                soundFx.playTap('scientific');
                onAppend(')', 'scientific');
              }}
              className={`glass-button py-3 sm:py-3.5 rounded-xl text-base font-semibold ${
                isKeyPressed(')') ? 'active-key' : ''
              }`}
              style={{ color: theme.sciColor }}
            >
              )
            </button>
          </>
        )}

        {/* AC - Clear All */}
        <button
          onClick={() => {
            soundFx.playTap('action');
            onClearAll();
          }}
          className={`glass-button py-3 sm:py-3.5 rounded-xl text-base font-bold transition-all ${
            isKeyPressed('Escape') ? 'active-key' : ''
          }`}
          style={{ color: theme.actionColor }}
          title="All Clear (Escape)"
        >
          AC
        </button>

        {/* DEL - Backspace */}
        <button
          onClick={() => {
            soundFx.playTap('action');
            onDeleteLast();
          }}
          className={`glass-button py-3 sm:py-3.5 rounded-xl text-base font-bold transition-all ${
            isKeyPressed('Backspace') ? 'active-key' : ''
          }`}
          style={{ color: theme.actionColor }}
          title="Delete Last (Backspace)"
        >
          DEL
        </button>

        {/* % - Percent */}
        <button
          onClick={() => {
            soundFx.playTap('operator');
            onAppend('%', 'operator');
          }}
          className={`glass-button py-3 sm:py-3.5 rounded-xl text-lg font-bold ${
            isKeyPressed('%') ? 'active-key' : ''
          }`}
          style={{ color: theme.operatorColor }}
        >
          %
        </button>

        {/* ÷ - Division */}
        <button
          onClick={() => {
            soundFx.playTap('operator');
            onAppend('/', 'operator');
          }}
          className={`glass-button py-3 sm:py-3.5 rounded-xl text-xl font-bold ${
            isKeyPressed('/') ? 'active-key' : ''
          }`}
          style={{ color: theme.operatorColor }}
        >
          ÷
        </button>

        {/* Digits 7, 8, 9 & × */}
        <button
          onClick={() => {
            soundFx.playTap('number');
            onAppend('7', 'number');
          }}
          className={`glass-button py-3 sm:py-3.5 rounded-xl text-xl font-medium text-white ${
            isKeyPressed('7') ? 'active-key' : ''
          }`}
        >
          7
        </button>
        <button
          onClick={() => {
            soundFx.playTap('number');
            onAppend('8', 'number');
          }}
          className={`glass-button py-3 sm:py-3.5 rounded-xl text-xl font-medium text-white ${
            isKeyPressed('8') ? 'active-key' : ''
          }`}
        >
          8
        </button>
        <button
          onClick={() => {
            soundFx.playTap('number');
            onAppend('9', 'number');
          }}
          className={`glass-button py-3 sm:py-3.5 rounded-xl text-xl font-medium text-white ${
            isKeyPressed('9') ? 'active-key' : ''
          }`}
        >
          9
        </button>
        <button
          onClick={() => {
            soundFx.playTap('operator');
            onAppend('*', 'operator');
          }}
          className={`glass-button py-3 sm:py-3.5 rounded-xl text-xl font-bold ${
            isKeyPressed('*') ? 'active-key' : ''
          }`}
          style={{ color: theme.operatorColor }}
        >
          ×
        </button>

        {/* Digits 4, 5, 6 & - */}
        <button
          onClick={() => {
            soundFx.playTap('number');
            onAppend('4', 'number');
          }}
          className={`glass-button py-3 sm:py-3.5 rounded-xl text-xl font-medium text-white ${
            isKeyPressed('4') ? 'active-key' : ''
          }`}
        >
          4
        </button>
        <button
          onClick={() => {
            soundFx.playTap('number');
            onAppend('5', 'number');
          }}
          className={`glass-button py-3 sm:py-3.5 rounded-xl text-xl font-medium text-white ${
            isKeyPressed('5') ? 'active-key' : ''
          }`}
        >
          5
        </button>
        <button
          onClick={() => {
            soundFx.playTap('number');
            onAppend('6', 'number');
          }}
          className={`glass-button py-3 sm:py-3.5 rounded-xl text-xl font-medium text-white ${
            isKeyPressed('6') ? 'active-key' : ''
          }`}
        >
          6
        </button>
        <button
          onClick={() => {
            soundFx.playTap('operator');
            onAppend('-', 'operator');
          }}
          className={`glass-button py-3 sm:py-3.5 rounded-xl text-xl font-bold ${
            isKeyPressed('-') ? 'active-key' : ''
          }`}
          style={{ color: theme.operatorColor }}
        >
          −
        </button>

        {/* Digits 1, 2, 3 & + */}
        <button
          onClick={() => {
            soundFx.playTap('number');
            onAppend('1', 'number');
          }}
          className={`glass-button py-3 sm:py-3.5 rounded-xl text-xl font-medium text-white ${
            isKeyPressed('1') ? 'active-key' : ''
          }`}
        >
          1
        </button>
        <button
          onClick={() => {
            soundFx.playTap('number');
            onAppend('2', 'number');
          }}
          className={`glass-button py-3 sm:py-3.5 rounded-xl text-xl font-medium text-white ${
            isKeyPressed('2') ? 'active-key' : ''
          }`}
        >
          2
        </button>
        <button
          onClick={() => {
            soundFx.playTap('number');
            onAppend('3', 'number');
          }}
          className={`glass-button py-3 sm:py-3.5 rounded-xl text-xl font-medium text-white ${
            isKeyPressed('3') ? 'active-key' : ''
          }`}
        >
          3
        </button>
        <button
          onClick={() => {
            soundFx.playTap('operator');
            onAppend('+', 'operator');
          }}
          className={`glass-button py-3 sm:py-3.5 rounded-xl text-xl font-bold ${
            isKeyPressed('+') ? 'active-key' : ''
          }`}
          style={{ color: theme.operatorColor }}
        >
          +
        </button>

        {/* Digits 0, . & = (col-span-2) */}
        <button
          onClick={() => {
            soundFx.playTap('number');
            onAppend('0', 'number');
          }}
          className={`glass-button py-3 sm:py-3.5 rounded-xl text-xl font-medium text-white ${
            isKeyPressed('0') ? 'active-key' : ''
          }`}
        >
          0
        </button>
        <button
          onClick={() => {
            soundFx.playTap('number');
            onAppend('.', 'number');
          }}
          className={`glass-button py-3 sm:py-3.5 rounded-xl text-xl font-bold text-white ${
            isKeyPressed('.') ? 'active-key' : ''
          }`}
        >
          .
        </button>

        {/* Equal button - glowing accent spanning 2 columns */}
        <button
          onClick={() => {
            soundFx.playTap('equal');
            onCalculate();
          }}
          className={`col-span-2 py-3 sm:py-3.5 rounded-xl text-2xl font-bold cursor-pointer transition-all duration-200 active:scale-95 ${
            theme.equalBtnStyle
          } ${isKeyPressed('Enter') || isKeyPressed('=') ? 'scale-95 brightness-125' : ''}`}
          title="Calculate (Enter or =)"
        >
          =
        </button>
      </div>
    </div>
  );
};
