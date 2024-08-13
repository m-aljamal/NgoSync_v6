"use client"

import * as React from "react"
import { projects } from "@/db/schema"
import { type UseFormReturn } from "react-hook-form"
import useSWR from "swr"

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
  Select as SelectComponent,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AppSelect } from "@/components/select"
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
  const fetcher = (...args: [RequestInfo | URL, RequestInit?]) => 
    fetch(...args).then((res) => res.json());

  const { data, error, isLoading } = useSWR<
    Array<{ id: number; name: string }>,
    Error
  >(`/api/form-data/users`, fetcher);

  console.log({
    data,
    error,
    isLoading,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                onChange={field.onChange}
                value={field.value}
                options={
                  data &&
                  !error &&
                  data?.map((user) => ({
                    value: user.id.toString(),
                    label: user.name,
                  }))
                }
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
              <FormLabel>Status</FormLabel>
              <SelectComponent
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="capitalize">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    {projects.status.enumValues.map((item) => (
                      <SelectItem
                        key={item}
                        value={item}
                        className="capitalize"
                      >
                        {item}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </SelectComponent>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="system"
          render={({ field }) => (
            <FormItem>
              <FormLabel>system</FormLabel>
              <SelectComponent
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="capitalize">
                    <SelectValue placeholder="Select a priority" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    {projects.system.enumValues.map((item) => (
                      <SelectItem
                        key={item}
                        value={item}
                        className="capitalize"
                      >
                        {item}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </SelectComponent>
              <FormMessage />
            </FormItem>
          )}
        />
        {children}
      </form>
    </Form>
  )
}
