"use client"

import * as React from "react"
import { projects } from "@/db/schemas/project"
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
import InputGroup from "@/components/form-components/InputGroup"
import { AppSelect } from "@/components/form-components/select"
import SelectUsers from "@/components/form-components/select-users"
import {
  projectStatusTranslation,
  projectSystemTranslation,
} from "@/app/_lib/translate"
import { type CreateProjectSchema } from "@/app/_lib/validations"

interface CreateTaskFormProps
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode
  form: UseFormReturn<CreateProjectSchema>
  onSubmit: (data: CreateProjectSchema) => void
}

export function ProjectForm({ form, onSubmit, children }: CreateTaskFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <InputGroup>
          <FormField
            control={form.control}
            name="system"
            render={({ field }) => (
              <FormItem>
                <FormLabel>النظام</FormLabel>

                <AppSelect
                  onChange={field.onChange}
                  value={field.value}
                  options={projects.system.enumValues.map((system) => ({
                    value: system,
                    label: projectSystemTranslation[system],
                  }))}
                  placeholder="النظام"
                />

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>اسم المشروع</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="اسم المشروع" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nameTr"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adi</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Adi" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <SelectUsers form={form} withAdmin label="المسؤول" />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الحالة</FormLabel>
                <AppSelect
                  onChange={field.onChange}
                  value={field.value}
                  options={projects.status.enumValues.map((state) => ({
                    value: state,
                    label: projectStatusTranslation[state],
                  }))}
                  placeholder="الحالة"
                />

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
