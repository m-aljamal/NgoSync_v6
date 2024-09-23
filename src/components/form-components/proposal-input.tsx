"use client"

import {
  type FieldValues,
  type Path,
  type UseFormReturn,
} from "react-hook-form"

import { useGetProposals } from "@/hooks/use-get-form-data"
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { AppSelect } from "@/components/form-components/select"

export default function ProposalInput<T extends FieldValues>({
  form,
  projectId = "",
}: {
  form: UseFormReturn<T>
  projectId?: string | undefined
}) {
  const { data: proposals, isLoading: proposalsLoading } =
    useGetProposals(projectId)

  return (
    <FormField
      control={form.control}
      name={"proposalId" as Path<T>}
      render={({ field }) => (
        <FormItem>
          <FormLabel>الدراسة</FormLabel>
          <AppSelect
            isLoading={proposalsLoading}
            onChange={field.onChange}
            value={(field.value as string | undefined)?.toString()}
            options={proposals?.map((proposal) => ({
              value: proposal.id.toString(),
              label: proposal.name,
            }))}
            placeholder="أختر الدراسة"
          />
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
