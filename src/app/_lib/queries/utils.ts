import { sql } from "drizzle-orm"

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
