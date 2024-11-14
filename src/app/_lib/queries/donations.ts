import "server-only"

import { cache } from "react"
import { unstable_noStore as noStore } from "next/cache"
import { db } from "@/db"
import {
  currencies,
  funds,
  fundTransactions,
  projects,
  proposals,
} from "@/db/schemas"
import { donations, doners, type Donation } from "@/db/schemas/donation"
import { type DrizzleWhere } from "@/types"
import Decimal from "decimal.js"
import { and, asc, count, desc, eq, gte, lte, or, type SQL } from "drizzle-orm"
import { alias } from "drizzle-orm/pg-core"

import { filterColumn } from "@/lib/filter-column"

import { type GetSearchSchema } from "../validations"
import { calculateOffset, calculatePageCount, convertToDate } from "./utils"

type GetDonationsResponse = {
  input: GetSearchSchema
  proposalId?: string
  projectId?: string
  donerId?: string
}

export async function getDonations({
  input,
  proposalId,
  projectId,
  donerId,
}: GetDonationsResponse) {
  noStore()
  const {
    page,
    per_page,
    sort,
    operator,
    from,
    to,
    paymentType,
    amount,
    currencyCode,
    donerId: donerIdInput,
  } = input

  try {
    const offset = calculateOffset(page, per_page)

    const [column, order] = (sort?.split(".").filter(Boolean) ?? [
      "createdAt",
      "desc",
    ]) as [keyof Donation | undefined, "asc" | "desc" | undefined]

    const { fromDay, toDay } = convertToDate(from, to)

    const expressions: (SQL<unknown> | undefined)[] = [
      amount ? eq(donations.amount, new Decimal(amount).toFixed(4)) : undefined,
      donerIdInput ? eq(donations.donerId, donerIdInput) : undefined,
      proposalId ? eq(donations.proposalId, proposalId) : undefined,
      projectId ? eq(donations.projectId, projectId) : undefined,
      !!paymentType
        ? filterColumn({
            column: donations.paymentType,
            value: paymentType,
            isSelectable: true,
          })
        : undefined,

      !!donerId
        ? filterColumn({
            column: donations.donerId,
            value: donerId,
            isSelectable: true,
          })
        : undefined,

      !!currencyCode
        ? filterColumn({
            column: currencies.code,
            value: currencyCode,
            isSelectable: true,
          })
        : undefined,

      fromDay && toDay
        ? and(gte(donations.date, fromDay), lte(donations.date, toDay))
        : undefined,
    ]

    const where: DrizzleWhere<Donation> =
      !operator || operator === "and" ? and(...expressions) : or(...expressions)

    const { data, total } = await db.transaction(async (tx) => {
      const data = await tx
        .select({
          date: donations.date,
          id: donations.id,
          fundTransactionId: donations.fundTransactionId,
          amount: donations.amount,
          proposalId: donations.proposalId,
          paymentType: donations.paymentType,
          isOfficial: donations.isOfficial,
          receiptDescription: donations.receiptDescription,
          amountInText: donations.amountInText,
          projectId: donations.projectId,
          donerId: donations.donerId,
          description: fundTransactions.description,
          fundId: fundTransactions.fundId,
          currencyId: fundTransactions.currencyId,
          currencyCode: currencies.code,
          donerName: doners.name,
          createdAt: donations.createdAt,
          updatedAt: donations.updatedAt,
        })
        .from(donations)
        .limit(per_page)
        .offset(offset)
        .where(where)
        .innerJoin(
          fundTransactions,
          eq(donations.fundTransactionId, fundTransactions.id)
        )
        .innerJoin(currencies, eq(fundTransactions.currencyId, currencies.id))
        .innerJoin(doners, eq(donations.donerId, doners.id))
        .orderBy(
          column && column in donations
            ? order === "asc"
              ? asc(donations[column])
              : desc(donations[column])
            : desc(donations.id)
        )

      const total = await tx
        .select({
          count: count(),
        })
        .from(donations)
        .where(where)
        .innerJoin(
          fundTransactions,
          eq(donations.fundTransactionId, fundTransactions.id)
        )
        .innerJoin(currencies, eq(fundTransactions.currencyId, currencies.id))
        .innerJoin(doners, eq(donations.donerId, doners.id))
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

export const getDonation = cache(async (id: string) => {
  const officialCurrency = alias(currencies, "officialCurrency")
  const proposalCurrency = alias(currencies, "proposalCurrency")
  try {
    const [donation] = await db
      .select({
        id: donations.id,
        date: fundTransactions.date,
        amount: fundTransactions.amount,
        project: projects.name,
        proposal: proposals.name,
        currency: currencies.code,
        currencyName: currencies.name,
        doner: doners.name,
        description: fundTransactions.description,
        paymentType: donations.paymentType,
        isOfficial: donations.isOfficial,
        fund: funds.name,
        amountInUSD: fundTransactions.amountInUSD,
        proposalAmount: fundTransactions.proposalAmount,
        proposalCurrency: proposalCurrency.code,
        officialAmount: fundTransactions.officialAmount,
        officialAmountCurrency: officialCurrency.code,
        receiptDescription: donations.receiptDescription,
        amountInText: donations.amountInText,
      })
      .from(donations)
      .where(eq(donations.id, id))
      .leftJoin(projects, eq(donations.projectId, projects.id))
      .leftJoin(proposals, eq(donations.proposalId, proposals.id))
      .innerJoin(
        fundTransactions,
        eq(donations.fundTransactionId, fundTransactions.id)
      )
      .innerJoin(doners, eq(donations.donerId, doners.id))
      .innerJoin(funds, eq(fundTransactions.fundId, funds.id))
      .innerJoin(currencies, eq(fundTransactions.currencyId, currencies.id))
      .leftJoin(officialCurrency, eq(officialCurrency.isOfficial, true))
      .leftJoin(proposalCurrency, eq(proposalCurrency.id, proposals.currencyId))
    return donation
  } catch (error) {
    throw new Error("Error fetching donations")
  }
})
