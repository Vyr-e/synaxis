import { parseError } from '@repo/observability/error';
import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));

export const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const handleError = (error: unknown): void => {
  const message = parseError(error);

  toast.error(message);
};


// Type-safe utility functions for avatar generation

export const hashCode = (name: string): number => {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    const character = name.charCodeAt(i)
    hash = (hash << 5) - hash + character
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash)
}

export const getModulus = (num: number, max: number): number => {
  return num % max
}

export const getDigit = (number: number, ntn: number): number => {
  return Math.floor((number / Math.pow(10, ntn)) % 10)
}

export const getBoolean = (number: number, ntn: number): boolean => {
  return !(getDigit(number, ntn) % 2)
}

export const getAngle = (x: number, y: number): number => {
  return (Math.atan2(y, x) * 180) / Math.PI
}

export const getUnit = (number: number, range: number, index?: number): number => {
  const value = number % range

  if (index !== undefined && getDigit(number, index) % 2 === 0) {
    return -value
  } else return value
}

export const getRandomColor = (number: number, colors: string[], range: number): string => {
  return colors[number % range]
}

export const getContrast = (hexcolor: string): string => {
  if (hexcolor.slice(0, 1) === "#") {
    hexcolor = hexcolor.slice(1)
  }

  const r = Number.parseInt(hexcolor.substr(0, 2), 16)
  const g = Number.parseInt(hexcolor.substr(2, 2), 16)
  const b = Number.parseInt(hexcolor.substr(4, 2), 16)

  const yiq = (r * 299 + g * 587 + b * 114) / 1000

  return yiq >= 128 ? "#000000" : "#FFFFFF"
}

export const generateColorsFromUsername = (username: string): string[] => {
  const seed = hashCode(username || "default")

  const colors: string[] = []

  const baseHue = seed % 360

  for (let i = 0; i < 5; i++) {
    const hue = (baseHue + (i * 40 + getUnit(seed + i, 30))) % 360

    const saturation = 65 + getUnit(seed * (i + 1), 25)

    const lightness = 45 + getUnit(seed * (i + 2), 30)

    colors.push(hslToHex(hue, saturation, lightness))
  }

  return colors
}

// Helper function to convert HSL to Hex
function hslToHex(h: number, s: number, l: number): string {
  l /= 100
  const a = (s * Math.min(l, 1 - l)) / 100
  const f = (n: number): string => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0")
  }
  return `#${f(0)}${f(8)}${f(4)}`
}
