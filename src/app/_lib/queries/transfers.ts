import "server-only"

import { unstable_noStore as noStore } from "next/cache"
import { db } from "@/db"
import { fundTransactions, tasks } from "@/db/schemas"
import {
  transferBetweenFunds,
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
