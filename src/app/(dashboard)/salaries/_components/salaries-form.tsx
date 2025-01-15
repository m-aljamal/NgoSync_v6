"use client"

import * as React from "react"
import { Fragment } from "react"
import { projects } from "@/db/schemas/project"
import { useFieldArray, useWatch, type UseFormReturn } from "react-hook-form"

import { useGetEmployees, useGetUsers } from "@/hooks/use-get-form-data"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DateInput,
  IsOfficialInput,
  ProjectInput,
} from "@/components/form-components"
import InputGroup from "@/components/form-components/InputGroup"
import { AppSelect } from "@/components/form-components/select"
import {
  projectStatusTranslation,
  projectSystemTranslation,
} from "@/app/_lib/translate"
import { type CreateSalariesSchema } from "@/app/_lib/validations"

interface CreateTaskFormProps
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode
  form: UseFormReturn<CreateSalariesSchema>
  onSubmit: (data: CreateSalariesSchema) => void
}

export function SalariesForm({
  form,
  onSubmit,
  children,
}: CreateTaskFormProps) {
  const { fields, remove } = useFieldArray({
    name: "salaries",
    control: form.control,
  })

  const watchFields = useWatch({
    control: form.control,
    name: "salaries",
  })
  

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <InputGroup>
          <ProjectInput form={form} withProposals />
          <DateInput form={form} />
          <IsOfficialInput form={form} />
        </InputGroup>
        {children}
      </form>
    </Form>
  )
}
