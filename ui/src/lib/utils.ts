import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function truncate(str: string, maxChars: number = 50) {
  if (str.length <= maxChars) {
    return str
  }

  return `${str.slice(0, maxChars)}...`
}