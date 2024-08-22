"use client"

import * as React from "react"
import { doners } from "@/db/schemas/donation"
import { type UseFormReturn } from "react-hook-form"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import InputGroup from "@/components/InputGroup"
import { AppSelect } from "@/components/select"
import {
  donerStatusTranslation,
  donerTypeTranslation,
  genderTranslation,
} from "@/app/_lib/translate"
import { type CreateDonerSchema } from "@/app/_lib/validations"

interface CreateDonerFormProps
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode
  form: UseFormReturn<CreateDonerSchema>
  onSubmit: (data: CreateDonerSchema) => void
  isUpdate?: boolean
}

export function DonerForm({
  form,
  onSubmit,
  children,
  isUpdate,
}: CreateDonerFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <InputGroup isUpdate={isUpdate}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>اسم المتبرع</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="اسم المتبرع" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الجنس</FormLabel>
                <AppSelect
                  onChange={field.onChange}
                  value={field.value}
                  options={doners.gender.enumValues?.map((gender) => ({
                    value: gender,
                    label: genderTranslation[gender],
                  }))}
                  placeholder="الجنس"
                />

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>النوع</FormLabel>
                <AppSelect
                  onChange={field.onChange}
                  value={field.value}
                  options={doners.type.enumValues?.map((type) => ({
                    value: type,
                    label: donerTypeTranslation[type],
                  }))}
                  placeholder="النوع"
                />

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الايميل</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="com..@.." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>العنوان</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="اسطنبول - تركيا" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>رقم الهاتف</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="0090536..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>حالة المتبرع</FormLabel>
                <AppSelect
                  onChange={field.onChange}
                  value={field.value?.toString()}
                  options={doners.status.enumValues?.map((status) => ({
                    value: status,
                    label: donerStatusTranslation[status],
                  }))}
                  placeholder="حالة المتبرع"
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ملاحظات</FormLabel>
                <FormControl>
                  <Input placeholder="متبرع مميز يتبرع بشكل دوري." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </InputGroup>
        {children}
      </form>
    </Form>
  )
}
