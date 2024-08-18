import "server-only"

import { unstable_noStore as noStore } from "next/cache"
import { db } from "@/db"
import { projects, type Project } from "@/db/schema"
import { type DrizzleWhere } from "@/types"
import { and, asc, count, desc, gte, lte, or, type SQL } from "drizzle-orm"

import { filterColumn } from "@/lib/filter-column"

import { type GetSearchSchema } from "../validations"
import { calculateOffset, calculatePageCount, convertToDate } from "./utils"

export async function getProjects(input: GetSearchSchema) {
  noStore()
  const { page, per_page, sort, name, status, operator, from, to, system } =
    input

  try {
    const offset = calculateOffset(page, per_page)

    const [column, order] = (sort?.split(".").filter(Boolean) ?? [
      "createdAt",
      "desc",
    ]) as [keyof Project | undefined, "asc" | "desc" | undefined]

    const { fromDay, toDay } = convertToDate(from, to)

    const expressions: (SQL<unknown> | undefined)[] = [
      name
        ? filterColumn({
            column: projects.name,
            value: name,
          })
        : undefined,

      !!status
        ? filterColumn({
            column: projects.status,
            value: status,
            isSelectable: true,
          })
        : undefined,
      !!system
        ? filterColumn({
            column: projects.system,
            value: system,
            isSelectable: true,
          })
        : undefined,

      fromDay && toDay
        ? and(gte(projects.createdAt, fromDay), lte(projects.createdAt, toDay))
        : undefined,
    ]

    const where: DrizzleWhere<Project> =
      !operator || operator === "and" ? and(...expressions) : or(...expressions)

    const { data, total } = await db.transaction(async (tx) => {
      const data = await tx
        .select()
        .from(projects)
        .limit(per_page)
        .offset(offset)
        .where(where)
        .orderBy(
          column && column in projects
            ? order === "asc"
              ? asc(projects[column])
              : desc(projects[column])
            : desc(projects.id)
        )

      const total = await tx
        .select({
          count: count(),
        })
        .from(projects)
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
