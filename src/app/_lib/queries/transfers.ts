import "server-only"

import { unstable_noStore as noStore } from "next/cache"
import { db } from "@/db"
import { fundTransactions, projectsTransactions, tasks } from "@/db/schemas"
import {
  transferBetweenFunds,
  transferBetweenProjects,
  TransferBetweenProjects,
  transferFundToProject,
  TransferFundToProject,
  type TransferBetweenFunds,
} from "@/db/schemas/transfer"
import { type DrizzleWhere } from "@/types"
import { and, asc, count, desc, eq, or, sql, type SQL } from "drizzle-orm"
import { alias } from "drizzle-orm/pg-core"

import { filterColumn } from "@/lib/filter-column"

import { type GetSearchSchema } from "../validations"

export async function getTransferBetweenFunds(input: GetSearchSchema) {
  noStore()
  const { page, per_page, sort, status, priority, operator, from, to } = input

  try {
    // Offset to paginate the results
    const offset = (page - 1) * per_page
    // Column and order to sort by
    // Spliting the sort string by "." to get the column and order
    // Example: "title.desc" => ["title", "desc"]
    const [column, order] = (sort?.split(".").filter(Boolean) ?? [
      "createdAt",
      "desc",
    ]) as [keyof TransferBetweenFunds | undefined, "asc" | "desc" | undefined]

    const fromDay = from
      ? sql`${transferBetweenFunds.createdAt} >= ${from}`
      : undefined
    const toDay = to
      ? sql`${transferBetweenFunds.createdAt} <= ${to}`
      : undefined

    const expressions: (SQL<unknown> | undefined)[] = [
      //   amount
      //     ? filterColumn({
      //         column: transferBetweenFunds.amount,
      //         value: amount.toString(),
      //       })
      //     : undefined,
      // Filter tasks by status
      !!status
        ? filterColumn({
            column: tasks.status,
            value: status,
            isSelectable: true,
          })
        : undefined,

      !!priority
        ? filterColumn({
            column: tasks.priority,
            value: priority,
            isSelectable: true,
          })
        : undefined,

      fromDay && toDay
        ? and(
            sql`${transferBetweenFunds.createdAt} >= ${from}`,
            sql`${transferBetweenFunds.createdAt} <= ${to}`
          )
        : undefined,
      fromDay ? fromDay : undefined,
    ]

    const where: DrizzleWhere<TransferBetweenFunds> =
      !operator || operator === "and" ? and(...expressions) : or(...expressions)

    const senderTransaction = alias(fundTransactions, "senderTransaction")
    const recipientTransaction = alias(fundTransactions, "recipientTransaction")

    const { data, total } = await db.transaction(async (tx) => {
      const data = await tx
        .select({
          id: transferBetweenFunds.id,
          sender: transferBetweenFunds.sender,
          receiver: transferBetweenFunds.receiver,
          updatedAt: transferBetweenFunds.updatedAt,
          createdAt: transferBetweenFunds.createdAt,
          description: senderTransaction.description,
          senderFundId: senderTransaction.fundId,
          receiverFundId: recipientTransaction.fundId,
          date: senderTransaction.date,
          amount: sql<number>`ABS(${senderTransaction.amount})/1000`,
          currencyId: senderTransaction.currencyId,
        })
        .from(transferBetweenFunds)
        .limit(per_page)
        .offset(offset)
        .where(where)
        .innerJoin(
          senderTransaction,
          eq(transferBetweenFunds.sender, senderTransaction.id)
        )
        .innerJoin(
          recipientTransaction,
          eq(transferBetweenFunds.receiver, recipientTransaction.id)
        )
        .orderBy(
          column && column in transferBetweenFunds
            ? order === "asc"
              ? asc(transferBetweenFunds[column])
              : desc(transferBetweenFunds[column])
            : desc(transferBetweenFunds.id)
        )

      const total = await tx
        .select({
          count: count(),
        })
        .from(transferBetweenFunds)
        .where(where)
        .execute()
        .then((res) => res[0]?.count ?? 0)

      return {
        data,
        total,
      }
    })

    const pageCount = Math.ceil(total / per_page)
    return { data, pageCount }
  } catch (err) {
    return { data: [], pageCount: 0 }
  }
}

// Transfer between projects
export async function getTransferBetweenProjects(input: GetSearchSchema) {
  noStore()
  const { page, per_page, sort, status, priority, operator, from, to } = input

  try {
    // Offset to paginate the results
    const offset = (page - 1) * per_page
    // Column and order to sort by
    // Spliting the sort string by "." to get the column and order
    // Example: "title.desc" => ["title", "desc"]
    const [column, order] = (sort?.split(".").filter(Boolean) ?? [
      "createdAt",
      "desc",
    ]) as [
      keyof TransferBetweenProjects | undefined,
      "asc" | "desc" | undefined,
    ]

    const fromDay = from
      ? sql`${transferBetweenProjects.createdAt} >= ${from}`
      : undefined
    const toDay = to
      ? sql`${transferBetweenProjects.createdAt} <= ${to}`
      : undefined

    const expressions: (SQL<unknown> | undefined)[] = [
      //   amount
      //     ? filterColumn({
      //         column: transferBetweenFunds.amount,
      //         value: amount.toString(),
      //       })
      //     : undefined,
      // Filter tasks by status

      fromDay && toDay
        ? and(
            sql`${transferBetweenProjects.createdAt} >= ${from}`,
            sql`${transferBetweenProjects.createdAt} <= ${to}`
          )
        : undefined,
      fromDay ? fromDay : undefined,
    ]

    const where: DrizzleWhere<TransferBetweenProjects> =
      !operator || operator === "and" ? and(...expressions) : or(...expressions)

    const senderTransaction = alias(projectsTransactions, "senderTransaction")
    const recipientTransaction = alias(
      projectsTransactions,
      "recipientTransaction"
    )

    const { data, total } = await db.transaction(async (tx) => {
      const data = await tx
        .select({
          id: transferBetweenProjects.id,
          sender: transferBetweenProjects.sender,
          receiver: transferBetweenProjects.receiver,
          updatedAt: transferBetweenProjects.updatedAt,
          createdAt: transferBetweenProjects.createdAt,
          description: senderTransaction.description,
          senderProjectId: senderTransaction.projectId,
          receiverProjectId: recipientTransaction.projectId,
          date: senderTransaction.date,
          amount: sql<number>`ABS(${senderTransaction.amount})/1000`,
          currencyId: senderTransaction.currencyId,
        })
        .from(transferBetweenProjects)
        .limit(per_page)
        .offset(offset)
        .where(where)
        .innerJoin(
          senderTransaction,
          eq(transferBetweenProjects.sender, senderTransaction.id)
        )
        .innerJoin(
          recipientTransaction,
          eq(transferBetweenProjects.receiver, recipientTransaction.id)
        )
        .orderBy(
          column && column in transferBetweenProjects
            ? order === "asc"
              ? asc(transferBetweenProjects[column])
              : desc(transferBetweenProjects[column])
            : desc(transferBetweenProjects.id)
        )

      const total = await tx
        .select({
          count: count(),
        })
        .from(transferBetweenProjects)
        .where(where)
        .execute()
        .then((res) => res[0]?.count ?? 0)

      return {
        data,
        total,
      }
    })

    const pageCount = Math.ceil(total / per_page)
    return { data, pageCount }
  } catch (err) {
    return { data: [], pageCount: 0 }
  }
}

// Transfer fund to project
export async function getTransferFundToProject(input: GetSearchSchema) {
  noStore()
  const { page, per_page, sort, operator, from, to } = input

  try {
    // Offset to paginate the results
    const offset = (page - 1) * per_page
    // Column and order to sort by
    // Spliting the sort string by "." to get the column and order
    // Example: "title.desc" => ["title", "desc"]
    const [column, order] = (sort?.split(".").filter(Boolean) ?? [
      "createdAt",
      "desc",
    ]) as [keyof TransferFundToProject | undefined, "asc" | "desc" | undefined]

    const fromDay = from
      ? sql`${transferFundToProject.createdAt} >= ${from}`
      : undefined
    const toDay = to
      ? sql`${transferFundToProject.createdAt} <= ${to}`
      : undefined

    const expressions: (SQL<unknown> | undefined)[] = [
      //   amount
      //     ? filterColumn({
      //         column: transferBetweenFunds.amount,
      //         value: amount.toString(),
      //       })
      //     : undefined,
      // Filter tasks by status

      fromDay && toDay
        ? and(
            sql`${transferFundToProject.createdAt} >= ${from}`,
            sql`${transferFundToProject.createdAt} <= ${to}`
          )
        : undefined,
      fromDay ? fromDay : undefined,
    ]

    const where: DrizzleWhere<TransferFundToProject> =
      !operator || operator === "and" ? and(...expressions) : or(...expressions)

    const { data, total } = await db.transaction(async (tx) => {
      const data = await tx
        .select({
          id: transferFundToProject.id,
          sender: transferFundToProject.sender,
          receiver: transferFundToProject.receiver,
          updatedAt: transferFundToProject.updatedAt,
          createdAt: transferFundToProject.createdAt,
          description: fundTransactions.description,
          senderFundId: fundTransactions.fundId,
          receiverProjectId: projectsTransactions.projectId,
          date: fundTransactions.date,
          amount: sql<number>`${projectsTransactions.amount}/1000`,
          currencyId: projectsTransactions.currencyId,
        })
        .from(transferFundToProject)
        .limit(per_page)
        .offset(offset)
        .where(where)
        .innerJoin(
          fundTransactions,
          eq(transferFundToProject.sender, fundTransactions.id)
        )
        .innerJoin(
          projectsTransactions,
          eq(transferFundToProject.receiver, projectsTransactions.id)
        )
        .orderBy(
          column && column in transferFundToProject
            ? order === "asc"
              ? asc(transferFundToProject[column])
              : desc(transferFundToProject[column])
            : desc(transferFundToProject.id)
        )

      const total = await tx
        .select({
          count: count(),
        })
        .from(transferFundToProject)
        .where(where)
        .execute()
        .then((res) => res[0]?.count ?? 0)

      return {
        data,
        total,
      }
    })

    const pageCount = Math.ceil(total / per_page)
    return { data, pageCount }
  } catch (err) {
    return { data: [], pageCount: 0 }
  }
}
