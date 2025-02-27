import React from "react"
import { ReloadIcon } from "@radix-ui/react-icons"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTriggerIcon,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface FloatingSelectProps<T extends string> {
  onValueChange: (value: T) => void
  isLoading?: boolean
  icon: React.ElementType
  text: string
  options: { value: string; label: string }[]
}

export function FloatingSelect<T extends string>({
  onValueChange,
  isLoading,
  icon,
  text,
  options,
}: FloatingSelectProps<T>) {
  const Icon = icon
  return (
    <Select onValueChange={onValueChange}>
      <Tooltip delayDuration={250}>
        <SelectTriggerIcon className="border-none focus:ring-0 focus:ring-offset-0">
          <TooltipTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="size-7 border data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
              disabled={isLoading}
            >
              {isLoading ? (
                <ReloadIcon
                  className="size-3.5 animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <Icon className="size-3.5" aria-hidden="true" />
              )}
            </Button>
          </TooltipTrigger>
        </SelectTriggerIcon>

        <TooltipContent className="border bg-accent font-semibold text-foreground dark:bg-zinc-900">
          <p>{text}</p>
        </TooltipContent>
      </Tooltip>
      <SelectContent align="center">
        <SelectGroup>
          {options.map(({ value, label }) => (
            <SelectItem key={value} value={value} className="capitalize">
              {label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
