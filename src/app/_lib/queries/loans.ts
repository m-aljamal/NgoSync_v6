import "server-only"

import { cache } from "react"
import { unstable_noStore as noStore } from "next/cache"
import { db } from "@/db"
import {
  currencies,
  employees,
  projects,
  projectsTransactions,
} from "@/db/schemas"
import { loans, type Loan } from "@/db/schemas/loan"
import { type DrizzleWhere } from "@/types"
import {
  and,
  asc,
  count,
  desc,
  eq,
  gte,
  lte,
  or,
  sql,
  type SQL,
} from "drizzle-orm"

import { type GetSearchSchema } from "../validations"
import { calculateOffset, calculatePageCount, convertToDate } from "./utils"

export async function getLoans(input: GetSearchSchema) {
  noStore()
  const { page, per_page, sort, operator, from, to } = input

  try {
    const offset = calculateOffset(page, per_page)

    const [column, order] = (sort?.split(".").filter(Boolean) ?? [
      "createdAt",
      "desc",
    ]) as [keyof Loan | undefined, "asc" | "desc" | undefined]

    // Convert the date strings to date objects
    const { fromDay, toDay } = convertToDate(from, to)

    const expressions: (SQL<unknown> | undefined)[] = [
      // name
      //   ? filterColumn({
      //       column: doners.name,
      //       value: name,
      //     })
      //   : undefined,

      // Filter by createdAt
      fromDay && toDay
        ? and(gte(loans.createdAt, fromDay), lte(loans.createdAt, toDay))
        : undefined,
    ]

    const where: DrizzleWhere<Loan> =
      !operator || operator === "and" ? and(...expressions) : or(...expressions)

    const { data, total } = await db.transaction(async (tx) => {
      const data = await tx
        .select({
          id: loans.id,
          employeeId: loans.employeeId,

          type: loans.type,
          projectTransactionId: loans.projectTransactionId,
          amount: sql<number>`ABS(${projectsTransactions.amount})`,
          date: projectsTransactions.date,
          projectId: projectsTransactions.projectId,
          description: projectsTransactions.description,
          currencyId: projectsTransactions.currencyId,
          currencyCode: currencies.code,
          projectName: projects.name,
          employeeName: employees.name,
        })
        .from(loans)
        .limit(per_page)
        .offset(offset)
        .where(where)
        .innerJoin(
          projectsTransactions,
          eq(loans.projectTransactionId, projectsTransactions.id)
        )
        .innerJoin(
          currencies,
          eq(projectsTransactions.currencyId, currencies.id)
        )
        .innerJoin(projects, eq(projectsTransactions.projectId, projects.id))
        .innerJoin(employees, eq(loans.employeeId, employees.id))
        .orderBy(
          column && column in loans
            ? order === "asc"
              ? asc(loans[column])
              : desc(loans[column])
            : desc(loans.createdAt)
        )

      const total = await tx
        .select({
          count: count(),
        })
        .from(loans)
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

interface LoanBalance {
  totalLoan: number
  currencyCode: string
  totalRepayment: number
  balance: number
}

export interface EmployeeLoan {
  employee: string
  loans: LoanBalance[]
}

export const getLoansBalance = cache(async (): Promise<EmployeeLoan[]> => {
  try {
    const results = await db
      .select({
        employee: employees.name,
        currencyCode: currencies.code,
        totalLoan: sql<number>`SUM(CASE WHEN ${loans.type} = 'loan' THEN ABS(${projectsTransactions.amount}) ELSE 0 END)`,
        totalRepayment: sql<number>`SUM(CASE WHEN ${loans.type} = 'repayment' THEN ABS(${projectsTransactions.amount}) ELSE 0 END)`,
      })
      .from(loans)
      .innerJoin(employees, sql`${loans.employeeId} = ${employees.id}`)
      .innerJoin(
        projectsTransactions,
        sql`${loans.projectTransactionId} = ${projectsTransactions.id}`
      )
      .innerJoin(
        currencies,
        sql`${projectsTransactions.currencyId} = ${currencies.id}`
      )
      .groupBy(employees.name, currencies.code)

    const employeeLoansMap = new Map<string, LoanBalance[]>()

    for (const row of results) {
      const loan: LoanBalance = {
        totalLoan: Number(row.totalLoan),
        currencyCode: row.currencyCode,
        totalRepayment: Number(row.totalRepayment),
        balance: Number(row.totalLoan) - Number(row.totalRepayment),
      }

      if (!employeeLoansMap.has(row.employee)) {
        employeeLoansMap.set(row.employee, [])
      }
      employeeLoansMap.get(row.employee)!.push(loan)
    }

    return Array.from(employeeLoansMap, ([employee, loans]) => ({
      employee,
      loans,
    }))
  } catch (error) {
    console.error("Error in getLoansBalance:", error)
    return []
  }
})
