"use client"

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

import { DatePicker } from "./date-picker"

export default function DateInput<T extends FieldValues>({
  form,
  name = "date",
  labelName = "التاريخ",
}: {
  form: UseFormReturn<T>
  name?: string
  labelName?: string
}) {
  return (
    <FormField
      control={form.control}
      name={name as Path<T>}
      render={({ field }) => (
        <FormItem className="mt-5">
          <FormLabel>{labelName}</FormLabel>
          <FormControl>
            <DatePicker onChange={field.onChange} value={field.value} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
