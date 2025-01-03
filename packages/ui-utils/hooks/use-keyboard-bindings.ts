'use client';
import { useCallback, useEffect, useRef } from 'react';

// Define valid keys with uppercase support and special keys
type Letter =
  | 'a'
  | 'A'
  | 'b'
  | 'B'
  | 'c'
  | 'C'
  | 'd'
  | 'D'
  | 'e'
  | 'E'
  | 'f'
  | 'F'
  | 'g'
  | 'G'
  | 'h'
  | 'H'
  | 'i'
  | 'I'
  | 'j'
  | 'J'
  | 'k'
  | 'K'
  | 'l'
  | 'L'
  | 'm'
  | 'M'
  | 'n'
  | 'N'
  | 'o'
  | 'O'
  | 'p'
  | 'P'
  | 'q'
  | 'Q'
  | 'r'
  | 'R'
  | 's'
  | 'S'
  | 't'
  | 'T'
  | 'u'
  | 'U'
  | 'v'
  | 'V'
  | 'w'
  | 'W'
  | 'x'
  | 'X'
  | 'y'
  | 'Y'
  | 'z'
  | 'Z';

type Number = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

type ValidKey = Letter | Number;

// Define modifiers
type ModifierKey = 'ctrl' | 'alt' | 'shift' | 'meta';

// Create recursive type for combinations: tis is an over kill
type KeyComboBase = ValidKey;
type WithModifier<T extends string> = `${ModifierKey}+${T}` | T;
type KeyCombo = WithModifier<
  WithModifier<WithModifier<WithModifier<KeyComboBase>>>
>;

type Modifiers = {
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean;
};

type Handler = (event: KeyboardEvent) => void;
type Bindings = Partial<Record<KeyCombo, Handler>>;

export const useKeyboardBindings = (initialBindings: Bindings) => {
  const bindingsRef = useRef<Bindings>({});

  const setBindings = useCallback((bindings: Bindings) => {
    bindingsRef.current = {};
    for (const [combo, handler] of Object.entries(bindings) as [
      string,
      Handler,
    ][]) {
      // Store both lowercase and uppercase variants
      const normalizedCombo = normalizeCombo(combo as KeyCombo);
      bindingsRef.current[normalizedCombo] = handler;

      // If it's a letter, also store the uppercase variant
      if (isLetter(combo)) {
        const uppercaseCombo = normalizeCombo(combo.toUpperCase() as KeyCombo);
        bindingsRef.current[uppercaseCombo] = handler;
      }
    }
  }, []);

  useEffect(() => {
    setBindings(initialBindings);
  }, [initialBindings, setBindings]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const combo = getComboFromEvent(event);
      const handler = bindingsRef.current[combo as KeyCombo];
      if (handler) {
        event.preventDefault();
        handler(event);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (newBindings: Bindings) => {
    setBindings(newBindings);
  };
};

// Helper to check if a key is a letter
const isLetter = (key: string): boolean => {
  // biome-ignore lint/performance/useTopLevelRegex: < this is initialized once see line 123 and 134>
  return /^[a-zA-Z]$/.test(key.split('+').pop() || '');
};

const normalizeCombo = (combo: KeyCombo): KeyCombo => {
  if (typeof combo === 'string') {
    const parts = combo.split('+');
    const key = parts.pop() as ValidKey;
    const modifiers = parts
      .map((mod) => mod.toLowerCase())
      .sort()
      .join('+');
    return (modifiers ? `${modifiers}+${key}` : key) as KeyCombo;
  }

  const { ctrl, alt, shift, meta, ...rest } = combo as unknown as Modifiers & {
    key: ValidKey;
  };
  const modifiers = [
    ctrl && 'ctrl',
    alt && 'alt',
    shift && 'shift',
    meta && 'meta',
  ]
    .filter(Boolean)
    .sort()
    .join('+');

  return (modifiers ? `${modifiers}+${rest.key}` : rest.key) as KeyCombo;
};

const getComboFromEvent = (event: KeyboardEvent): KeyCombo => {
  const modifiers: ModifierKey[] = [];
  //biome-ignore lint/style/useBlockStatements: <quick return statement>
  if (event.ctrlKey) modifiers.push('ctrl');
  //biome-ignore lint/style/useBlockStatements: <quick return statement>
  if (event.altKey) modifiers.push('alt');
  //biome-ignore lint/style/useBlockStatements: <quick return statement>
  if (event.shiftKey) modifiers.push('shift');
  //biome-ignore lint/style/useBlockStatements: <quick return statement>
  if (event.metaKey) modifiers.push('meta');

  // Preserve the original case of the key
  const key = event.key as ValidKey;
  return (
    modifiers.length > 0 ? `${modifiers.sort().join('+')}+${key}` : key
  ) as KeyCombo;
};

export default useKeyboardBindings;
