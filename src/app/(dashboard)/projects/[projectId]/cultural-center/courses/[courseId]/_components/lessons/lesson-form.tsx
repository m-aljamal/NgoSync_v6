"use client"

import * as React from "react"
import { studentsCourseNotes } from "@/db/schemas/course"
import { useFieldArray, type UseFormReturn } from "react-hook-form"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
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
  AppSelect,
  DateInput,
  DescriptionInput,
} from "@/components/form-components"
import InputGroup from "@/components/form-components/InputGroup"
import NameInput from "@/components/form-components/name-input"
import { attendanceTranslation } from "@/app/_lib/translate"
import { type CreateLessonSchema } from "@/app/_lib/validations"

interface CreateLessonFormProps
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode
  form: UseFormReturn<CreateLessonSchema>
  onSubmit: (data: CreateLessonSchema) => void
  isLoading?: boolean
}

export function LessonForm({
  form,
  onSubmit,
  children,
  isLoading,
}: CreateLessonFormProps) {
  const { fields, remove } = useFieldArray({
    name: "students",
    control: form.control,
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <InputGroup>
          <NameInput
            form={form}
            labelName="عنوان الدرس"
            name="title"
            placeholder="عنوان الدرس"
          />
          <DateInput form={form} labelName="التاريخ" name="date" />
          <DescriptionInput form={form} />
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <div className="col-span-full my-7">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الطلاب</TableHead>
                    <TableHead>التفقد</TableHead>
                    <TableHead>الصفحة</TableHead>
                    <TableHead>العلامة / التقييم</TableHead>
                    <TableHead>ملاحظات</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {fields.map((field, index) => {
                    return (
                      <React.Fragment key={field.id}>
                        <TableRow>
                          <TableCell className="hidden">
                            <FormField
                              control={form.control}
                              name={`students.${index}.studentId`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input type="text" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell className="min-w-32">
                            <FormField
                              control={form.control}
                              name={`students.${index}.name`}
                              render={({ field }) => (
                                <FormItem className="">
                                  <FormControl>
                                    <Input disabled type="text" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell className="min-w-12">
                            <FormField
                              control={form.control}
                              name={`students.${index}.attendance`}
                              render={({ field }) => (
                                <FormItem className="w-36">
                                  <AppSelect
                                    onChange={field.onChange}
                                    value={field.value?.toString()}
                                    options={studentsCourseNotes.attendance.enumValues.map(
                                      (value) => ({
                                        value,
                                        label: attendanceTranslation[value],
                                      })
                                    )}
                                  />
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell className="min-w-32">
                            <FormField
                              control={form.control}
                              name={`students.${index}.pageNumber`}
                              render={({ field }) => (
                                <FormItem className=" ">
                                  <FormControl>
                                    <Input type="text" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell className="min-w-32">
                            <FormField
                              control={form.control}
                              name={`students.${index}.mark`}
                              render={({ field }) => (
                                <FormItem className=" ">
                                  <FormControl>
                                    <Input type="text" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell className="min-w-32">
                            <FormField
                              control={form.control}
                              name={`students.${index}.note`}
                              render={({ field }) => (
                                <FormItem className=" ">
                                  <FormControl>
                                    <Input type="text" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </InputGroup>
        {children}
      </form>
    </Form>
  )
}
