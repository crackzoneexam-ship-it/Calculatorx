/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AngleMode } from '../types/calculator';

/**
 * Strips floating point representation errors (e.g., 0.1 + 0.2 = 0.30000000000000004 -> 0.3)
 */
export function formatMathResult(num: number): string {
  if (Number.isNaN(num)) return 'Error';
  if (!Number.isFinite(num)) {
    return num > 0 ? 'Infinity' : '-Infinity';
  }

  // Handle tiny numbers close to zero (e.g., cos(90 deg) = 6.123e-17 -> 0)
  if (Math.abs(num) < 1e-14 && Math.abs(num) > 0) {
    return '0';
  }

  // Format to standard human-readable precision
  const precision = 12;
  const fixed = parseFloat(num.toPrecision(precision));

  // If number is very large or very small, use scientific notation
  if (Math.abs(fixed) >= 1e14 || (Math.abs(fixed) > 0 && Math.abs(fixed) < 1e-6)) {
    return fixed.toExponential(6).replace(/\.?0+e/, 'e');
  }

  // Handle integer vs float
  if (fixed % 1 === 0) {
    return fixed.toString();
  }

  // Trim trailing zeros after decimal point
  return fixed.toString();
}

/**
 * Calculates factorial of an integer n (0 <= n <= 170)
 */
export function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) return NaN;
  if (n === 0 || n === 1) return 1;
  if (n > 170) return Infinity; // JS max float limit
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

/**
 * Evaluates a mathematical expression safely with DEG/RAD awareness
 */
export function evaluateExpression(expr: string, angleMode: AngleMode): { result: string; rawValue: number | null; error?: string } {
  if (!expr || expr.trim() === '') {
    return { result: '0', rawValue: 0 };
  }

  try {
    let sanitized = expr;

    // Replace display symbols with math equivalents
    sanitized = sanitized
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/π/g, `(${Math.PI})`)
      .replace(/e(?![a-zA-Z0-9_])/g, `(${Math.E})`)
      .replace(/φ/g, '(1.618033988749895)');

    // Handle factorial syntax: e.g. 5! or (3+2)!
    // Replace n! with __fact(n)
    sanitized = sanitized.replace(/(\d+(\.\d+)?|\([^)]+\))!/g, '__fact($1)');

    // Replace powers ^ with **
    sanitized = sanitized.replace(/\^/g, '**');

    // Handle implicit multiplication: e.g., 2(3), (2)(3), 2π, 2sqrt(4)
    sanitized = sanitized
      .replace(/(\d)(\()/g, '$1*$2')
      .replace(/(\))(\d)/g, '$1*$2')
      .replace(/(\))(\()/g, '$1*$2')
      .replace(/(\d)(sin|cos|tan|asin|acos|atan|sinh|cosh|tanh|log|ln|sqrt|cbrt)/g, '$1*$2');

    // Auto-close missing parentheses at the end
    const openParens = (sanitized.match(/\(/g) || []).length;
    const closeParens = (sanitized.match(/\)/g) || []).length;
    if (openParens > closeParens) {
      sanitized += ')'.repeat(openParens - closeParens);
    }

    // Mathematical context functions
    const isDeg = angleMode === 'DEG';
    const toRad = (x: number) => (x * Math.PI) / 180;
    const fromRad = (x: number) => (x * 180) / Math.PI;

    const mathContext = {
      sin: (x: number) => {
        const rad = isDeg ? toRad(x) : x;
        // Fix sin(180 deg) = 0
        const val = Math.sin(rad);
        return Math.abs(val) < 1e-15 ? 0 : val;
      },
      cos: (x: number) => {
        const rad = isDeg ? toRad(x) : x;
        // Fix cos(90 deg) = 0
        const val = Math.cos(rad);
        return Math.abs(val) < 1e-15 ? 0 : val;
      },
      tan: (x: number) => {
        if (isDeg) {
          const mod = Math.abs(x) % 180;
          if (mod === 90) return NaN;
          return Math.tan(toRad(x));
        }
        return Math.tan(x);
      },
      asin: (x: number) => {
        const val = Math.asin(x);
        return isDeg ? fromRad(val) : val;
      },
      acos: (x: number) => {
        const val = Math.acos(x);
        return isDeg ? fromRad(val) : val;
      },
      atan: (x: number) => {
        const val = Math.atan(x);
        return isDeg ? fromRad(val) : val;
      },
      sinh: Math.sinh,
      cosh: Math.cosh,
      tanh: Math.tanh,
      log: Math.log10,
      log10: Math.log10,
      ln: Math.log,
      sqrt: Math.sqrt,
      cbrt: Math.cbrt,
      abs: Math.abs,
      __fact: factorial,
      pow: Math.pow,
    };

    // Safe Function execution with explicit parameter bindings
    const functionKeys = Object.keys(mathContext);
    const functionValues = Object.values(mathContext);

    // Validate sanitized expression only contains allowed tokens
    const allowedCharsPattern = /^[\d\s+\-*/%().,**\w]+$/;
    if (!allowedCharsPattern.test(sanitized)) {
      return { result: 'Error', rawValue: null, error: 'Invalid characters in expression' };
    }

    const evaluator = new Function(...functionKeys, `"use strict"; return (${sanitized});`);
    const rawAnswer = evaluator(...functionValues);

    if (rawAnswer === undefined || rawAnswer === null || Number.isNaN(rawAnswer)) {
      return { result: 'Error', rawValue: null, error: 'Undefined calculation' };
    }

    return {
      result: formatMathResult(rawAnswer),
      rawValue: rawAnswer,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Syntax Error';
    return { result: 'Error', rawValue: null, error: errorMsg };
  }
}

/**
 * Translates raw input or tokens to readable display representation
 */
export function formatExpressionForDisplay(expr: string): string {
  if (!expr) return '0';
  return expr
    .replace(/\*/g, '×')
    .replace(/\//g, '÷')
    .replace(/\*\*/g, '^');
}
