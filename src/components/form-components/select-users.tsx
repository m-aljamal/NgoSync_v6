"use client"

import { useMemo } from "react"
import {
  type FieldValues,
  type Path,
  type UseFormReturn,
} from "react-hook-form"

import { useGetUsers } from "@/hooks/use-get-form-data"
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { AppSelect } from "@/components/form-components/select"

export default function SelectUsers<T extends FieldValues>({
  form,
  withAdmin = false,
  isMulti = false,
  label = "اسم المستخدم",
}: {
  form: UseFormReturn<T>
  withAdmin?: boolean
  isMulti?: boolean
  label?: string
}) {
  const { data, isLoading } = useGetUsers()

  const filteredOptions = useMemo(() => {
    if (!data) return []
    return data
      .filter((user) => withAdmin || user.role !== "admin")
      .map(({ id, name }) => ({
        value: id.toString(),
        label: name,
      }))
  }, [data, withAdmin])

  return (
    <FormField
      control={form.control}
      name={"userId" as Path<T>}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <AppSelect
            isMulti={isMulti}
            isLoading={isLoading}
            onChange={field.onChange}
            value={(field.value as string | undefined)?.toString()}
            options={filteredOptions}
            placeholder={label}
          />
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
