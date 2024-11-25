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

export default function NameInput<T extends FieldValues>({
  form,
  name,
  labelName = "الاسم",
  placeholder,
}: {
  form: UseFormReturn<T>
  name?: string
  labelName?: string
  prefix?: string
  currency?: string
  placeholder: string
}) {
  return (
    <FormField
      control={form.control}
      name={name as Path<T>}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{labelName}</FormLabel>
          <FormControl>
            <Input type="text" placeholder={placeholder} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
