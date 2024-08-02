"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes/dist/types"

import { TooltipProvider } from "@/components/ui/tooltip"

import { DirectionProvider } from "@radix-ui/react-direction"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <TooltipProvider>{children}</TooltipProvider>
    </NextThemesProvider>
  )
}

export function Direction({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <DirectionProvider dir="rtl">{children}</DirectionProvider>
}
