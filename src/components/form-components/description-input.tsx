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

import { Input } from "../ui/input"

export default function DescriptionInput<T extends FieldValues>({
  form,
}: {
  form: UseFormReturn<T>
}) {
  return (
    <FormField
      control={form.control}
      name={"description" as Path<T>}
      render={({ field }) => (
        <FormItem className="sm:col-span-full">
          <FormLabel> ملاحظات</FormLabel>
          <FormControl>
            <Input placeholder="ملاحظات" {...field} className="resize-none" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
