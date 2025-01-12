"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import { Controller, type UseFormReturn } from "react-hook-form"
import Select from "react-select"

import { useGetEmployees } from "@/hooks/use-get-form-data"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import InputGroup from "@/components/form-components/InputGroup"
import { CreateEmployeesToCourses } from "@/app/_lib/validations"

interface CreateEmployeeFormProps
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode
  form: UseFormReturn<CreateEmployeesToCourses>
  onSubmit: (data: CreateEmployeesToCourses) => void
}

export function EmployeeForm({
  form,
  onSubmit,
  children,
}: CreateEmployeeFormProps) {
  const { projectId } = useParams<{ projectId: string }>()

  const { data: employees, isLoading: employeesLoading } =
    useGetEmployees(projectId)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <InputGroup>
          <Controller
            name="teachers"
            control={form.control}
            render={({ field: { onChange, value }, fieldState: { error } }) => {
              return (
                <FormField
                  control={form.control}
                  name="teachers"
                  render={() => (
                    <FormItem className="col-span-full">
                      <FormLabel>المدرسين</FormLabel>
                      <FormControl>
                        <Select
                          isLoading={employeesLoading}
                          isMulti
                          options={employees?.map((teacher) => ({
                            value: teacher.id,
                            label: teacher.name,
                          }))}
                          value={employees?.filter((teacher) => 
                            value?.includes(teacher.id)
                          ).map((teacher) => ({
                            value: teacher.id,
                            label: teacher.name,
                          }))}
                          onChange={(val) =>
                            onChange(val.map((v) => v.value))
                          }
                        />
                      </FormControl>
                      <FormMessage>{error?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              )
            }}
          />
        </InputGroup>
        {children}
      </form>
    </Form>
  )
}

