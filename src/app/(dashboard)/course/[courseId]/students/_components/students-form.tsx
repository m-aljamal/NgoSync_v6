"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import { Controller, type UseFormReturn } from "react-hook-form"
import Select from "react-select"

import { useGetStudents } from "@/hooks/use-get-form-data"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import InputGroup from "@/components/form-components/InputGroup"
import { type CreateStudentsToCourses } from "@/app/_lib/validations"

interface CreateStudentFormProps
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode
  form: UseFormReturn<CreateStudentsToCourses>
  onSubmit: (data: CreateStudentsToCourses) => void
}

export function StudentForm({
  form,
  onSubmit,
  children,
}: CreateStudentFormProps) {
   
 // todo projectId is static here update it to dynamiq
  const { data: students, isLoading: studentsLoading } =
    useGetStudents("uhYfLIsvwLUc")

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <InputGroup>
          <Controller
            name="students"
            control={form.control}
            render={({ field: { onChange, value }, fieldState: { error } }) => {
              return (
                <FormField
                  control={form.control}
                  name="students"
                  render={() => (
                    <FormItem className="col-span-full">
                      <FormLabel>الطلاب</FormLabel>
                      <FormControl>
                        <Select
                          isLoading={studentsLoading}
                          isMulti
                          options={students?.map((student) => ({
                            value: student.id,
                            label: student.name,
                          }))}
                          value={students
                            ?.filter((student) => value?.includes(student.id))
                            .map((student) => ({
                              value: student.id,
                              label: student.name,
                            }))}
                          onChange={(val) => onChange(val.map((v) => v.value))}
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
