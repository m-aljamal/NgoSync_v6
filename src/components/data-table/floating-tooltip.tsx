import { ReloadIcon } from "@radix-ui/react-icons"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface FloatingTooltipProps {
  onClick: () => void
  isLoading?: boolean
  icon: React.ElementType
  text: string
}

export function FloatingTooltip({
  onClick,
  isLoading,
  icon,
  text,
}: FloatingTooltipProps) {
  const Icon = icon
  return (
    <Tooltip delayDuration={250}>
      <TooltipTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className="size-7 border"
          onClick={onClick}
          disabled={isLoading}
        >
          {isLoading ? (
            <ReloadIcon className="size-3.5 animate-spin" aria-hidden="true" />
          ) : (
            <Icon className="size-3.5" aria-hidden="true" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent className="border bg-accent font-semibold text-foreground dark:bg-zinc-900">
        <p>{text}</p>
      </TooltipContent>
    </Tooltip>
  )
}
