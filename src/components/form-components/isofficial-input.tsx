"use client"

import {
  type FieldValues,
  type Path,
  type UseFormReturn,
} from "react-hook-form"

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"

import { Switch } from "../ui/switch"

export default function IsOfficialInput<T extends FieldValues>({
  form,
}: {
  form: UseFormReturn<T>
}) {
  return (
    <FormField
      control={form.control}
      name={"isOfficial" as Path<T>}
      render={({ field }) => (
        <FormItem className="flex flex-col items-center justify-between rounded-lg border p-3 shadow-sm sm:flex-row">
          <div className="space-y-0.5">
            <FormLabel>توثيق رسمي</FormLabel>
            <FormDescription>توثيق التبرع بشكل رسمي</FormDescription>
          </div>
          <FormControl>
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
        </FormItem>
      )}
    />
  )
}
