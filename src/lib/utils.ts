import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function formatFractionDigits(value: number) {
  return value % 1 !== 0 ? 3 : 0
}

export function formatCurrency(value: string | number, currency: string) {
  const numericValue = typeof value === "string" ? parseFloat(value) : value
  return Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: formatFractionDigits(numericValue),
    maximumFractionDigits: 3,
  }).format(numericValue)
}
