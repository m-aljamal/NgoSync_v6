import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const colorSchemes = {
  blue: "border-transparent bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
  green:
    "border-transparent bg-green-500/10 text-green-500 hover:bg-green-500/20",
  yellow:
    "border-transparent bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
  red: "border-transparent bg-red-500/10 text-red-500 hover:bg-red-500/20",
  cyan: "border-transparent bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500/20",
  primary:
    "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
  secondary:
    "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
  destructive:
    "border-transparent bg-destructive/10 text-destructive-foreground hover:bg-destructive/80",
  outline: "text-foreground",
}

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        primary: colorSchemes.blue,
        TRY: colorSchemes.yellow,
        EUR: colorSchemes.blue,
        USD: colorSchemes.green,
        cash: colorSchemes.cyan,
        debt: colorSchemes.red,
        ACTIVE: colorSchemes.green,
        INACTIVE: colorSchemes.red,
        PENDING: colorSchemes.yellow,
        APPROVED: colorSchemes.green,
        REJECTED: colorSchemes.red,
        LOAN: colorSchemes.blue,
        REPAYMENT: colorSchemes.green,
        true: colorSchemes.green,
        false: colorSchemes.red,
        PRESENT: colorSchemes.green,
        ABSENT: colorSchemes.red,
        EXPENSE: colorSchemes.red,
        TRANSFER_FROM_FUND: colorSchemes.blue,
        TRANSFER_TO_FUND: colorSchemes.blue,
        CURRENCY_EXCHANGE: colorSchemes.cyan,
        TRANFER_BETWEEN_PROJECTS: colorSchemes.blue,
        DONATION: colorSchemes.green,
        FUND_TRANSACTION: colorSchemes.blue,
        TRANSFER_TO_PROJECT: colorSchemes.yellow,
        TRANSFER_BETWEEN_FUNDS: colorSchemes.blue,
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
