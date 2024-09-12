import { and, gte, lte, or, sql, type SQL } from "drizzle-orm"

import { filterColumn } from "@/lib/filter-column"

export function calculateOffset(page: number, perPage: number): number {
  return (page - 1) * perPage
}

export function convertToDate(
  from: string | undefined,
  to: string | undefined
) {
  const fromDay = from ? sql`to_date(${from}, 'yyyy-mm-dd')` : undefined
  const toDay = to ? sql`to_date(${to}, 'yyy-mm-dd')` : undefined
  return { fromDay, toDay }
}

export function calculatePageCount(total: number, per_page: number): number {
  return Math.ceil(total / per_page)
}

export function getPaginationAndSorting<T>(
  page: number,
  per_page: number,
  sort?: string
): { offset: number; column: keyof T | undefined; order: "asc" | "desc" } {
  const offset = calculateOffset(page, per_page)
  const [column, order] = (sort?.split(".").filter(Boolean) ?? [
    "createdAt",
    "desc",
  ]) as [keyof T | undefined, "asc" | "desc" | undefined]

  return { offset, column, order: order ?? "desc" }
}
