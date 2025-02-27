import "server-only"

import { cache } from "react"
import { unstable_noStore as noStore } from "next/cache"
import { db } from "@/db"
import { currencies, projects, projectsTransactions } from "@/db/schemas"
import {
  employees,
  employeesJobTitles,
  salaryPayments,
  type Employee,
  type SalaryPayment,
} from "@/db/schemas/employee"
import { type DrizzleWhere } from "@/types"
import { and, asc, count, desc, eq, gte, lte, or, type SQL } from "drizzle-orm"

import { filterColumn } from "@/lib/filter-column"

import { currentUser } from "../auth"
import { type GetSearchSchema } from "../validations"
import { calculateOffset, calculatePageCount, convertToDate } from "./utils"

export async function getEmployees(input: GetSearchSchema, projectId?: string) {
  noStore()
  const { page, per_page, sort, name, operator, from, to } = input
  const user = await currentUser()

  try {
    const offset = calculateOffset(page, per_page)

    const [column, order] = (sort?.split(".").filter(Boolean) ?? [
      "createdAt",
      "desc",
    ]) as [keyof Employee | undefined, "asc" | "desc" | undefined]

    const { fromDay, toDay } = convertToDate(from, to)

    const expressions: (SQL<unknown> | undefined)[] = [
      user && user.role === "project_manager" && user.id
        ? eq(projects.userId, user.id)
        : undefined,
      projectId ? eq(employees.projectId, projectId) : undefined,
      name
        ? filterColumn({
            column: employees.name,
            value: name,
          })
        : undefined,

      fromDay && toDay
        ? and(
            gte(employees.createdAt, fromDay),
            lte(employees.createdAt, toDay)
          )
        : undefined,
    ]

    const where: DrizzleWhere<Employee> =
      !operator || operator === "and" ? and(...expressions) : or(...expressions)

    const { data, total } = await db.transaction(async (tx) => {
      const data = await tx
        .select({
          name: employees.name,
          nameLatin: employees.nameLatin,
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
          userId: employees.userId,
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
        .innerJoin(projects, eq(projects.id, employees.projectId))
        .innerJoin(currencies, eq(currencies.id, employees.currencyId))
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

export const getEmployee = cache(
  async ({ id, name }: { id?: string; name?: string }) => {
    if (!id && !name) return
    try {
      const [employee] = await db
        .select({
          id: employees.id,
          name: employees.name,
          status: employees.status,
          projectId: employees.projectId,
          gender: employees.gender,
          email: employees.email,
          phone: employees.phone,
          description: employees.description,
          salary: employees.salary,
          currencyId: employees.currencyId,
          address: employees.address,
          birthDate: employees.birthDate,
          createdAt: employees.createdAt,
          updatedAt: employees.updatedAt,
          jobTitle: employeesJobTitles.name,
          position: employees.position,
          project: projects.name,
          currency: currencies.code,
          jobTitleId: employees.jobTitleId,
        })
        .from(employees)
        .where(
          and(
            id ? eq(employees.id, id) : undefined,
            name ? eq(employees.name, name) : undefined
          )
        )
        .innerJoin(projects, eq(employees.projectId, projects.id))
        .innerJoin(currencies, eq(employees.currencyId, currencies.id))
        .innerJoin(
          employeesJobTitles,
          eq(employees.jobTitleId, employeesJobTitles.id)
        )

      return employee
    } catch (error) {
      return null
    }
  }
)

export const getEmployeeName = cache(async (id: string) => {
  try {
    const [employee] = await db
      .select({
        name: employees.name,
        id: employees.id,
      })
      .from(employees)
      .where(eq(employees.id, id))

    return employee
  } catch (error) {
    return null
  }
})

export async function getSalariesPayments(
  input: GetSearchSchema,
  projectId?: string
) {
  noStore()
  const { page, per_page, sort, name, operator, from, to } = input
  try {
    const offset = calculateOffset(page, per_page)

    const [column, order] = (sort?.split(".").filter(Boolean) ?? [
      "createdAt",
      "desc",
    ]) as [keyof SalaryPayment, "asc" | "desc" | undefined]

    const { fromDay, toDay } = convertToDate(from, to)

    const expressions: (SQL<unknown> | undefined)[] = [
      projectId ? eq(employees.projectId, projectId) : undefined,
      name
        ? filterColumn({
            column: employees.name,
            value: name,
          })
        : undefined,

      fromDay && toDay
        ? and(
            gte(salaryPayments.createdAt, fromDay),
            lte(salaryPayments.createdAt, toDay)
          )
        : undefined,
    ]

    const where: DrizzleWhere<SalaryPayment> =
      !operator || operator === "and" ? and(...expressions) : or(...expressions)

    const { data, total } = await db.transaction(async (tx) => {
      const data = await tx
        .select({
          projectId: employees.projectId,
          createdAt: salaryPayments.createdAt,
          employeeName: employees.name,
        })
        .from(salaryPayments)
        .limit(per_page)
        .offset(offset)
        .where(where)
        .innerJoin(employees, eq(employees.id, salaryPayments.employeeId))
        .innerJoin(
          projectsTransactions,
          eq(salaryPayments.projectTransactionId, projectsTransactions.id)
        )
        .innerJoin(
          currencies,
          eq(projectsTransactions.currencyId, currencies.id)
        )

        .orderBy(
          column && column in employees
            ? order === "asc"
              ? asc(salaryPayments[column])
              : desc(salaryPayments[column])
            : desc(salaryPayments.id)
        )

      const total = await tx
        .select({
          count: count(),
        })
        .from(salaryPayments)
        .where(where)
        .execute()
        .then((res) => res[0]?.count ?? 0)

      console.log(data)

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
