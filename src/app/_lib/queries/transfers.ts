import "server-only"

import { unstable_noStore as noStore } from "next/cache"
import { db } from "@/db"
import {
  currencies,
  funds,
  fundTransactions,
  projects,
  projectsTransactions,
} from "@/db/schemas"
import {
  transferBetweenFunds,
  transferBetweenProjects,
  transferFundToProject,
  transferProjectToFund,
} from "@/db/schemas/transfer"
import type {
  TransferBetweenFunds,
  TransferBetweenProjects,
  TransferFundToProject,
  TransferProjectToFund,
} from "@/db/schemas/transfer"
import { type DrizzleWhere } from "@/types"
import Decimal from "decimal.js"
import { and, asc, count, desc, eq, gte, lte, or, type SQL } from "drizzle-orm"
import { alias } from "drizzle-orm/pg-core"

import { currentUser } from "../auth"
import { type GetSearchSchema } from "../validations"
import { calculateOffset, convertToDate } from "./utils"

export async function getTransferBetweenFunds(input: GetSearchSchema) {
  noStore()
  const { page, per_page, sort, operator, from, to } = input

  try {
    const offset = calculateOffset(page, per_page)

    const [column, order] = (sort?.split(".").filter(Boolean) ?? [
      "createdAt",
      "desc",
    ]) as [keyof TransferBetweenFunds | undefined, "asc" | "desc" | undefined]

    const { fromDay, toDay } = convertToDate(from, to)

    const expressions: (SQL<unknown> | undefined)[] = [
      fromDay && toDay
        ? and(
            gte(transferBetweenFunds.date, fromDay),
            lte(transferBetweenFunds.date, toDay)
          )
        : undefined,
    ]

    const where: DrizzleWhere<TransferBetweenFunds> =
      !operator || operator === "and" ? and(...expressions) : or(...expressions)

    const senderTransaction = alias(fundTransactions, "senderTransaction")
    const recipientTransaction = alias(fundTransactions, "recipientTransaction")
    const senderFund = alias(funds, "senderFund")
    const recipientFund = alias(funds, "recipientFund")

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
          date: transferBetweenFunds.date,
          amount: recipientTransaction.amount,
          currencyId: senderTransaction.currencyId,
          currencyCode: currencies.code,
          senderName: senderFund.name,
          receiverName: recipientFund.name,
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
        .innerJoin(senderFund, eq(senderTransaction.fundId, senderFund.id))
        .innerJoin(
          recipientFund,
          eq(recipientTransaction.fundId, recipientFund.id)
        )
        .innerJoin(currencies, eq(senderTransaction.currencyId, currencies.id))
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
        .innerJoin(
          senderTransaction,
          eq(transferBetweenFunds.sender, senderTransaction.id)
        )
        .innerJoin(
          recipientTransaction,
          eq(transferBetweenFunds.receiver, recipientTransaction.id)
        )
        .innerJoin(currencies, eq(senderTransaction.currencyId, currencies.id))
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
  const user = await currentUser()

  const { page, per_page, sort, operator, from, to, amount } = input

  try {
    const offset = calculateOffset(page, per_page)

    const [column, order] = (sort?.split(".").filter(Boolean) ?? [
      "createdAt",
      "desc",
    ]) as [
      keyof TransferBetweenProjects | undefined,
      "asc" | "desc" | undefined,
    ]

    const senderTransaction = alias(projectsTransactions, "senderTransaction")
    const recipientTransaction = alias(
      projectsTransactions,
      "recipientTransaction"
    )
    const senderProject = alias(projects, "senderProject")
    const recipientProject = alias(projects, "recipientProject")

    const { fromDay, toDay } = convertToDate(from, to)

    const expressions: (SQL<unknown> | undefined)[] = [
      user && user.role === "project_manager" && user.id
        ? or(
            eq(senderProject.userId, user.id),
            eq(recipientProject.userId, user.id)
          )
        : undefined,

      amount
        ? eq(projectsTransactions.amount, new Decimal(amount).toFixed(4))
        : undefined,
      fromDay && toDay
        ? and(
            gte(transferBetweenProjects.date, fromDay),
            lte(transferBetweenProjects.date, toDay)
          )
        : undefined,
    ]

    const where: DrizzleWhere<TransferBetweenProjects> =
      !operator || operator === "and" ? and(...expressions) : or(...expressions)

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
          amount: recipientTransaction.amount,
          currencyId: senderTransaction.currencyId,
          currencyCode: currencies.code,
          senderName: senderProject.name,
          receiverName: recipientProject.name,
          senderUserId: senderProject.userId,
          receiverUserId: recipientProject.userId,
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
        .innerJoin(currencies, eq(senderTransaction.currencyId, currencies.id))
        .innerJoin(
          senderProject,
          eq(senderTransaction.projectId, senderProject.id)
        )
        .innerJoin(
          recipientProject,
          eq(recipientTransaction.projectId, recipientProject.id)
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
        .innerJoin(
          senderTransaction,
          eq(transferBetweenProjects.sender, senderTransaction.id)
        )
        .innerJoin(
          recipientTransaction,
          eq(transferBetweenProjects.receiver, recipientTransaction.id)
        )
        .innerJoin(currencies, eq(senderTransaction.currencyId, currencies.id))
        .innerJoin(
          senderProject,
          eq(senderTransaction.projectId, senderProject.id)
        )
        .innerJoin(
          recipientProject,
          eq(recipientTransaction.projectId, recipientProject.id)
        )
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
export async function getTransferFundToProject(
  input: GetSearchSchema,
  isOfficial?: boolean
) {
  noStore()
  const { page, per_page, sort, operator, from, to, amount } = input
  const officialCurrency = alias(currencies, "officialCurrency")
  try {
    const offset = calculateOffset(page, per_page)

    const [column, order] = (sort?.split(".").filter(Boolean) ?? [
      "createdAt",
      "desc",
    ]) as [keyof TransferFundToProject | undefined, "asc" | "desc" | undefined]

    const { fromDay, toDay } = convertToDate(from, to)

    const expressions: (SQL<unknown> | undefined)[] = [
      isOfficial ? eq(projectsTransactions.isOfficial, isOfficial) : undefined,
      amount
        ? eq(projectsTransactions.amount, new Decimal(amount).toFixed(4))
        : undefined,
      fromDay && toDay
        ? and(
            gte(transferFundToProject.date, fromDay),
            lte(transferFundToProject.date, toDay)
          )
        : undefined,
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
          amount: projectsTransactions.amount,
          officialAmount: projectsTransactions.officialAmount,
          currencyId: projectsTransactions.currencyId,
          isOfficial: projectsTransactions.isOfficial,
          currencyCode: currencies.code,
          senderName: funds.name,
          receiverName: projects.name,
          transactionStatus: projectsTransactions.transactionStatus,
          officialCurrency: officialCurrency.code,
        })
        .from(transferFundToProject)
        .limit(per_page)
        .offset(offset)
        .where(where)
        .leftJoin(officialCurrency, eq(officialCurrency.isOfficial, true))
        .innerJoin(
          fundTransactions,
          eq(transferFundToProject.sender, fundTransactions.id)
        )
        .innerJoin(
          projectsTransactions,
          eq(transferFundToProject.receiver, projectsTransactions.id)
        )
        .innerJoin(
          currencies,
          eq(projectsTransactions.currencyId, currencies.id)
        )

        .innerJoin(funds, eq(fundTransactions.fundId, funds.id))
        .innerJoin(projects, eq(projectsTransactions.projectId, projects.id))
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
        .innerJoin(
          fundTransactions,
          eq(transferFundToProject.sender, fundTransactions.id)
        )
        .innerJoin(
          projectsTransactions,
          eq(transferFundToProject.receiver, projectsTransactions.id)
        )
        .innerJoin(
          currencies,
          eq(projectsTransactions.currencyId, currencies.id)
        )
        .innerJoin(funds, eq(fundTransactions.fundId, funds.id))
        .innerJoin(projects, eq(projectsTransactions.projectId, projects.id))
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

// Transfer project to fund
export async function getTransferProjectToFund(input: GetSearchSchema) {
  noStore()
  const { page, per_page, sort, operator, from, to } = input

  try {
    const offset = calculateOffset(page, per_page)

    const [column, order] = (sort?.split(".").filter(Boolean) ?? [
      "createdAt",
      "desc",
    ]) as [keyof TransferProjectToFund | undefined, "asc" | "desc" | undefined]

    const { fromDay, toDay } = convertToDate(from, to)

    const expressions: (SQL<unknown> | undefined)[] = [
      fromDay && toDay
        ? and(
            gte(transferProjectToFund.date, fromDay),
            lte(transferProjectToFund.date, toDay)
          )
        : undefined,
    ]

    const where: DrizzleWhere<TransferProjectToFund> =
      !operator || operator === "and" ? and(...expressions) : or(...expressions)

    const { data, total } = await db.transaction(async (tx) => {
      const data = await tx
        .select({
          id: transferProjectToFund.id,
          sender: transferProjectToFund.sender,
          receiver: transferProjectToFund.receiver,
          updatedAt: transferProjectToFund.updatedAt,
          createdAt: transferProjectToFund.createdAt,
          description: fundTransactions.description,
          senderProjectId: projectsTransactions.projectId,
          receiverFundId: fundTransactions.fundId,
          date: fundTransactions.date,
          amount: fundTransactions.amount,
          currencyId: projectsTransactions.currencyId,
          isOfficial: projectsTransactions.isOfficial,
          currencyCode: currencies.code,
          senderName: projects.name,
          receiverName: funds.name,
          transactionStatus: projectsTransactions.transactionStatus,
        })
        .from(transferProjectToFund)
        .limit(per_page)
        .offset(offset)
        .where(where)
        .innerJoin(
          projectsTransactions,
          eq(transferProjectToFund.sender, projectsTransactions.id)
        )
        .innerJoin(
          fundTransactions,
          eq(transferProjectToFund.receiver, fundTransactions.id)
        )
        .innerJoin(
          currencies,
          eq(projectsTransactions.currencyId, currencies.id)
        )
        .innerJoin(projects, eq(projectsTransactions.projectId, projects.id))
        .innerJoin(funds, eq(fundTransactions.fundId, funds.id))
        .orderBy(
          column && column in transferProjectToFund
            ? order === "asc"
              ? asc(transferProjectToFund[column])
              : desc(transferProjectToFund[column])
            : desc(transferProjectToFund.id)
        )

      const total = await tx
        .select({
          count: count(),
        })
        .from(transferProjectToFund)
        .where(where)
        .innerJoin(
          projectsTransactions,
          eq(transferProjectToFund.sender, projectsTransactions.id)
        )
        .innerJoin(
          fundTransactions,
          eq(transferProjectToFund.receiver, fundTransactions.id)
        )
        .innerJoin(
          currencies,
          eq(projectsTransactions.currencyId, currencies.id)
        )
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
