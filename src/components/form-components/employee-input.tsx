"use client"

import {
    type FieldValues,
    type Path,
    type UseFormReturn,
} from "react-hook-form"

import { AppSelect } from "@/components/form-components/select"
import {
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { useGetEmployees } from "@/hooks/use-get-form-data"

export default function EmployeeInput<T extends FieldValues>({
    form,
    projectId = "",
}: {
    form: UseFormReturn<T>
    projectId?: string | undefined
}) {
    const { data: employees, isLoading: employeesLoading } =
        useGetEmployees(projectId)

    return (
        <FormField
            control={form.control}
            name={"employeeId" as Path<T>}
            render={({ field }) => (
                <FormItem >
                    <FormLabel>الموظف</FormLabel>
                    <AppSelect
                        isLoading={employeesLoading}
                        onChange={field.onChange}
                        value={(field.value as string | undefined)?.toString()}
                        options={employees?.map(({ id, name }) => ({
                            value: id.toString(),
                            label: name,
                        }))}
                        placeholder="أختر الموظف"
                    />
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
