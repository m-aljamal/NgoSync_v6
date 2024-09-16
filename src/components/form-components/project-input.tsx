"use client"

import { useEffect } from "react"
import {
  PathValue,
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

import EmployeeInput from "./employee-input"
import ExpenseCategoriesInput from "./expense-categories-input"
import ProposalInput from "./proposal-input"

export default function ProjectInput<T extends FieldValues>({
  form,
  withProposals = false,
  withExpensesCategories = false,
  withEmployees = false,
  name = "projectId",
  label = "المشروع",
}: {
  form: UseFormReturn<T>
  withProposals?: boolean
  withExpensesCategories?: boolean
  withEmployees?: boolean
  name?: string
  label?: string
}) {
  const { data: projects, isLoading: projectsLoading } = useGetProjects()

  const selectedProject = form.watch("projectId" as Path<T>)

  useEffect(() => {
    form.setValue(
      "proposalId" as Path<T>,
      null as unknown as PathValue<T, Path<T>>
    )
  }, [selectedProject, form])

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
      {withEmployees ? (
        <EmployeeInput form={form} projectId={selectedProject || "null"} />
      ) : null}
    </>
  )
}
