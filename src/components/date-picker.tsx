import { format } from "date-fns"
import { CalendarDays } from "lucide-react"
import { type SelectSingleEventHandler } from "react-day-picker"

import { cn } from "@/lib/utils"

import { Button } from "./ui/button"
import { Calendar } from "./ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"

type Props = {
  value?: Date
  onChange: SelectSingleEventHandler
  disabled?: boolean
}

export const DatePicker = ({ value, onChange, disabled }: Props) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full text-right font-normal",
            !value && "text-muted-foreground"
          )}
        >
          {value ? format(value, "dd/MM/yyyy") : <span>إختر تاريخ</span>}
          <CalendarDays className="mr-auto size-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          disabled={disabled}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
