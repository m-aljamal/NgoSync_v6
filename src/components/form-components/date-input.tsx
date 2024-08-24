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
}: {
  form: UseFormReturn<T>
}) {
  return (
    <FormField
      control={form.control}
      name={"date" as Path<T>}
      render={({ field }) => (
        <FormItem>
          <FormLabel>التاريخ</FormLabel>
          <FormControl>
            <DatePicker onChange={field.onChange} value={field.value} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
