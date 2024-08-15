"use client"

import * as React from "react"
import { projects } from "@/db/schema"
import { type UseFormReturn } from "react-hook-form"

import { useGetUsers } from "@/hooks/use-get-users"
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

export function CreateProjectForm({
  form,
  onSubmit,
  children,
}: CreateTaskFormProps) {
  const { data: users, isLoading } = useGetUsers()

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <InputGroup>
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
                  <Input type="text" placeholder="اسم المشروع" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="userId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>المسؤول عن المشروع</FormLabel>

                <AppSelect
                  isLoading={isLoading}
                  onChange={field.onChange}
                  value={field.value}
                  options={users?.map((user) => ({
                    value: user.id.toString(),
                    label: user.name,
                  }))}
                  placeholder="المسؤول عن المشروع"
                />

                <FormMessage />
              </FormItem>
            )}
          />

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
                  placeholder="أختر حالة المشروع"
                />

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="system"
            render={({ field }) => (
              <FormItem>
                <FormLabel>نظام إدارة المشروع</FormLabel>

                <AppSelect
                  onChange={field.onChange}
                  value={field.value}
                  options={projects.system.enumValues.map((system) => ({
                    value: system,
                    label: projectSystemTranslation[system],
                  }))}
                  placeholder="نظام إدارة المشروع"
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
