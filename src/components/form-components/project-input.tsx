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

import ProposalInput from "./proposal-input"

export default function ProjectInput<T extends FieldValues>({
  form,
  withProposals = false,
}: {
  form: UseFormReturn<T>
  withProposals?: boolean
}) {
  const { data: projects, isLoading: projectsLoading } = useGetProjects()

  const selectedProject = form.watch("projectId" as Path<T>)

  return (
    <>
      <FormField
        control={form.control}
        name={"projectId" as Path<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>المشروع</FormLabel>
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
    </>
  )
}
