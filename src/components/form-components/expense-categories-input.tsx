"use client"

import {
  type FieldValues,
  type Path,
  type UseFormReturn,
} from "react-hook-form"

import { useGetExpensesCategoriesByProjectId } from "@/hooks/use-get-form-data"
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { AppSelect } from "@/components/form-components/select"

export default function ExpenseCategoriesInput<T extends FieldValues>({
  form,
  projectId = "",
}: {
  form: UseFormReturn<T>
  projectId?: string | undefined
}) {
  const { data: categories, isLoading: categoriesLoading } =
    useGetExpensesCategoriesByProjectId(projectId)

  return (
    <FormField
      control={form.control}
      name={"expensesCategoryId" as Path<T>}
      render={({ field }) => (
        <FormItem>
          <FormLabel>الفئة</FormLabel>
          <AppSelect
            isLoading={categoriesLoading}
            onChange={field.onChange}
            value={(field.value as string | undefined)?.toString()}
            options={categories?.map((categorie) => ({
              value: categorie.id.toString(),
              label: categorie.name,
            }))}
            placeholder="أختر الفئة"
          />
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
