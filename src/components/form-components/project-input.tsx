"use client"

import {
  type FieldValues,
  type Path,
  type UseFormReturn,
} from "react-hook-form"

import { useGetProjects } from "@/hooks/use-get-form-data"
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { AppSelect } from "@/components/form-components/select"

import ExpenseCategoriesInput from "./expense-categories-input"
import ProposalInput from "./proposal-input"

export default function ProjectInput<T extends FieldValues>({
  form,
  withProposals = false,
  withExpensesCategories = false,
  name = "projectId",
  label = "الصندوق",
}: {
  form: UseFormReturn<T>
  withProposals?: boolean
  withExpensesCategories?: boolean
  name?: string
  label?: string
}) {
  const { data: projects, isLoading: projectsLoading } = useGetProjects()

  const selectedProject = form.watch("projectId" as Path<T>)

  return (
    <>
      <FormField
        control={form.control}
        name={name as Path<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <AppSelect
              isLoading={projectsLoading}
              onChange={field.onChange}
              value={(field.value as string | undefined)?.toString()}
              options={projects?.map((project) => ({
                value: project.id.toString(),
                label: project.name,
              }))}
              placeholder="أختر المشروع"
            />
            <FormMessage />
          </FormItem>
        )}
      />
      {withProposals ? (
        <ProposalInput form={form} projectId={selectedProject || "null"} />
      ) : null}
      {withExpensesCategories ? (
        <ExpenseCategoriesInput
          form={form}
          projectId={selectedProject || "null"}
        />
      ) : null}
    </>
  )
}
