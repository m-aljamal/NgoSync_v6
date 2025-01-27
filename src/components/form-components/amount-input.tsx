import {
  type FieldValues,
  type Path,
  type UseFormReturn,
} from "react-hook-form"

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Input } from "../ui/input"

export default function AmountInput<T extends FieldValues>({
  form,
  name = "amount",
  labelName = "المبلغ",
  prefix,
  currency,
  disabled = false,
}: {
  form: UseFormReturn<T>
  name?: string
  labelName?: string
  prefix?: string
  currency?: string
  disabled?: boolean
}) {
  return (
    <FormField
      control={form.control}
      name={name as Path<T>}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{labelName}</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                className="pl-5"
                placeholder="0.00"
                onChange={field.onChange}
                value={field.value}
                disabled={disabled}
              />
              <span className="absolute left-2 top-2 text-gray-500">
                {prefix || currency}
              </span>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
