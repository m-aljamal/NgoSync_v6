import "server-only"

import { unstable_noStore as noStore } from "next/cache"
import { db } from "@/db"
import { currencies, projects } from "@/db/schemas"
import { employees, type Employee } from "@/db/schemas/employee"
import { type DrizzleWhere } from "@/types"
import { and, asc, count, desc, eq, gte, lte, or, type SQL } from "drizzle-orm"

import { filterColumn } from "@/lib/filter-column"

import { type GetSearchSchema } from "../validations"
import { calculateOffset, calculatePageCount, convertToDate } from "./utils"

export async function getEmployees(input: GetSearchSchema) {
  noStore()
  const { page, per_page, sort, name, operator, from, to } = input

  try {
    const offset = calculateOffset(page, per_page)

    const [column, order] = (sort?.split(".").filter(Boolean) ?? [
      "createdAt",
      "desc",
    ]) as [keyof Employee | undefined, "asc" | "desc" | undefined]

    // Convert the date strings to date objects
    const { fromDay, toDay } = convertToDate(from, to)

    const expressions: (SQL<unknown> | undefined)[] = [
      name
        ? filterColumn({
            column: employees.name,
            value: name,
          })
        : undefined,

      // Filter by createdAt
      fromDay && toDay
        ? and(
            gte(employees.createdAt, fromDay),
            lte(employees.createdAt, toDay)
          )
        : undefined,
    ]

    const where: DrizzleWhere<Employee> =
      !operator || operator === "and" ? and(...expressions) : or(...expressions)

    // Transaction is used to ensure both queries are executed in a single transaction
    const { data, total } = await db.transaction(async (tx) => {
      const data = await tx
        .select({
          name: employees.name,
          projectName: projects.name,
          status: employees.status,
          createdAt: employees.createdAt,
          updatedAt: employees.updatedAt,
          description: employees.description,
          salary: employees.salary,
          currencyId: employees.currencyId,
          id: employees.id,
          position: employees.position,
          jobTitleId: employees.jobTitleId,
          projectId: employees.projectId,
          gender: employees.gender,
          email: employees.email,
          phone: employees.phone,
          address: employees.address,
          birthDate: employees.birthDate,
          currencyCode: currencies.code,
        })
        .from(employees)
        .limit(per_page)
        .offset(offset)
        .where(where)
        .innerJoin(projects, eq(projects.id, employees.projectId))
        .innerJoin(currencies, eq(currencies.id, employees.currencyId))
        .orderBy(
          column && column in employees
            ? order === "asc"
              ? asc(employees[column])
              : desc(employees[column])
            : desc(employees.id)
        )

      const total = await tx
        .select({
          count: count(),
        })
        .from(employees)
        .where(where)
        .execute()
        .then((res) => res[0]?.count ?? 0)

      return {
        data,
        total,
      }
    })

    const pageCount = calculatePageCount(total, per_page)

    return { data, pageCount }
  } catch (err) {
    return { data: [], pageCount: 0 }
  }
}
