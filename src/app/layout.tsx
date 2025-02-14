import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Direction, ThemeProvider } from "@/components/providers"
import { TailwindIndicator } from "@/components/tailwind-indicator"

import "@/styles/globals.css"

import type { Metadata, Viewport } from "next"
import { Tajawal } from "next/font/google"
import { QueryProvider } from "@/providers/query-provider"
import { SheetProvider } from "@/providers/sheet-provider"

import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "nextjs",
    "react",
    "react server components",
    "table",
    "react-table",
    "tanstack-table",
    "shadcn-table",
  ],
  authors: [
    {
      name: "sadmann7",
      url: "https://www.sadmn.com",
    },
  ],
  creator: "sadmann7",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${siteConfig.url}/og.jpg`],
    creator: "@sadmann17",
  },
  icons: {
    icon: "/icon.png",
  },
  // manifest: `${siteConfig.url}/site.webmanifest`,
}

export const viewport: Viewport = {
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}
const fontSans = Tajawal({
  subsets: ["arabic"],
  display: "block",
  variable: "--font-tajawal",
  weight: ["200", "300", "400", "500", "700", "800", "900"],
})

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
        dir="rtl"
      >
        <QueryProvider>
          <SheetProvider />
          <Direction>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <div className="relative flex min-h-screen flex-col">
                <main className="flex-1">{children}</main>
              </div>

              <TailwindIndicator />
            </ThemeProvider>
          </Direction>
          <Toaster position="bottom-right" dir="rtl" />
        </QueryProvider>
      </body>
    </html>
  )
}
