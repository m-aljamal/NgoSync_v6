"use client"

import * as React from "react"
import { Fragment } from "react"
import Decimal from "decimal.js"
import { Loader2, Trash2 } from "lucide-react"
import { useFieldArray, useWatch, type UseFormReturn } from "react-hook-form"

import { Button } from "@/components/ui/button"
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
  AmountInput,
  CurrencyAmountInput,
  DateInput,
  IsOfficialInput,
  ProjectInput,
} from "@/components/form-components"
import InputGroup from "@/components/form-components/InputGroup"
import { type CreateSalariesSchema } from "@/app/_lib/validations"

interface CreateTaskFormProps
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode
  form: UseFormReturn<CreateSalariesSchema>
  onSubmit: (data: CreateSalariesSchema) => void
  isLoading: boolean
}

export function SalariesForm({
  form,
  onSubmit,
  children,
  isLoading,
}: CreateTaskFormProps) {
  const { fields, remove } = useFieldArray({
    name: "salaries",
    control: form.control,
  })

  const watchFields = useWatch({
    control: form.control,
    name: "salaries",
  })

  React.useEffect(() => {
    watchFields.forEach((salary, index) => {
      const extra = new Decimal(salary.extra || 0)
      const discount = new Decimal(salary.discount || "0")
      const salaryAmount = new Decimal(salary.salary || 0)
      const netSalary = Decimal.sub(Decimal.add(salaryAmount, extra), discount)
      const selectedNetSalary = form.getValues(`salaries.${index}.netSalary`)
      if (+selectedNetSalary !== +netSalary) {
        form.setValue(`salaries.${index}.netSalary`, netSalary)
      }
    })
  }, [form, watchFields])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <InputGroup>
          <ProjectInput form={form} withProposals />
          <DateInput form={form} />
          <IsOfficialInput form={form} />
          <div className="col-span-full my-7">
            {isLoading ? (
              <div className="flex h-32 items-center justify-center">
                <Loader2 className="size-8 animate-spin" />
              </div>
            ) : (
              <Table className="mb-20">
                <TableHeader>
                  <TableRow>
                    <TableHead>اسم الموظف</TableHead>
                    <TableHead>الراتب</TableHead>
                    <TableHead>العملة</TableHead>
                    <TableHead>التسليم</TableHead>
                    <TableHead>الإضافي</TableHead>
                    <TableHead>الحسم</TableHead>
                    <TableHead>ملاحظات</TableHead>
                    <TableHead>صافي الراتب</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fields.length ? (
                    fields?.map((field, index) => (
                      <Fragment key={field.id}>
                        <TableRow>
                          <TableCell className="hidden">
                            <FormField
                              control={form.control}
                              name={`salaries.${index}.employeeId`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input disabled type="text" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <FormField
                              disabled
                              control={form.control}
                              name={`salaries.${index}.employeeName`}
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
                          <TableCell>
                            <AmountInput
                              disabled
                              name={`salaries.${index}.salary`}
                              form={form}
                              labelName=""
                            />
                          </TableCell>
                          <TableCell className="w-36">
                            <CurrencyAmountInput
                              form={form}
                              disabled
                              currencyLabel=""
                              currencyName={`salaries.${index}.currencyId`}
                              withAmount={false}
                            />
                          </TableCell>
                          <TableCell className="w-36">
                            <CurrencyAmountInput
                              form={form}
                              currencyLabel=""
                              currencyName={`salaries.${index}.paymentCurrencyId`}
                              withAmount={false}
                            />
                          </TableCell>

                          <TableCell>
                            <AmountInput
                              name={`salaries.${index}.extra`}
                              form={form}
                              labelName=""
                            />
                          </TableCell>
                          <TableCell>
                            <AmountInput
                              name={`salaries.${index}.discount`}
                              form={form}
                              labelName=""
                            />
                          </TableCell>

                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`salaries.${index}.description`}
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

                          <TableCell>
                            <AmountInput
                              name={`salaries.${index}.netSalary`}
                              form={form}
                              labelName=""
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => remove(index)}
                            >
                              <Trash2 className="size-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      </Fragment>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="h-32 text-center text-gray-600"
                      >
                        لا يوجد بيانات.
                        <br />
                        <span>
                          اختر المشروع لعرض الموظفين أو أضف موظف جديد.
                        </span>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </InputGroup>
        {children}
      </form>
    </Form>
  )
}
