import React from "react"
import { notFound } from "next/navigation"
import { Users } from "lucide-react"

import { cn, formatCurrency,   } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import {
  getEmployeesCounts,
  getProject,
  getProjectRemainingBudget,
  getProjectTotalSummary,
} from "@/app/_lib/queries/projects"

import ExpensesMonthlyTotal from "./_components/expenses-monthly-total"
import ExpensesStatistics from "./_components/expenses-statistics"
import IncomeStatistics from "./_components/income-statistics"

export default async function Project({
  params,
  searchParams,
}: {
  params: {
    projectId: string
  }
  searchParams?: {
    month: string
  }
}) {
  const project = await getProject({
    id: params.projectId,
  })
  if (!project) {
    notFound()
  }

  const remainigBudget = await getProjectRemainingBudget(project.id)

  const employeesCounts = await getEmployeesCounts({
    projectId: project.id,
  })

  const totalIncome = await getProjectTotalSummary({
    projectId: project.id,
    type: "income",
  })

  const totalExpenses = await getProjectTotalSummary({
    projectId: project.id,
    type: "outcome",
  })

  const balance =
    Number(totalIncome?.totalUSD) - Number(totalExpenses?.totalUSD)

  return (
    <>
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {remainigBudget?.map((item) => (
            <Card key={item.currency}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  رصيد المشروع
                </CardTitle>

                <span className="font-bold text-muted-foreground">
                  {item.currency}
                </span>
              </CardHeader>
              <CardContent>
                <div
                  className={cn(
                    "text-2xl font-bold",
                    item.amount < 0 && "text-red-500"
                  )}
                >
                  {formatCurrency(item.amount, item.currency)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {item.amount < 0
                    ? "المشروع يعاني من نقص في الرصيد"
                    : "الرصيد المتبقي في صندوق المشروع"}
                </p>
              </CardContent>
            </Card>
          ))}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">الموظفين</CardTitle>
              <Users className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {employeesCounts?.total} موظف
              </div>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {employeesCounts?.male} ذكور
                </p>
                <p className="text-xs text-pink-600">
                  {employeesCounts?.female} إناث
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <ExpensesStatistics
          projectId={project.id}
          month={searchParams?.month}
        />
        <ExpensesMonthlyTotal projectId={project.id} />
        <IncomeStatistics projectId={project.id} />

        <div className="col-span-2 grid items-start gap-6 xl:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>إجمالي الإيرادات / المصروفات</CardTitle>
              <CardDescription>
                تفاصيل الإيرادات والمصروفات الشهرية
              </CardDescription>
            </CardHeader>
            <CardContent>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <div className="flex justify-between border-t py-3">
                    <p>إجمالي الواردات</p>
                    <p>{formatCurrency(totalIncome?.totalUSD || 0, "USD")}</p>
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="">
                    <p className="py-3 font-semibold">تفاصيل الواردات </p>
                    {totalIncome?.totalCurrencies.map((item) => (
                      <div
                        className="flex gap-5 border-t py-3"
                        key={item.currency}
                      >
                        <p>{item.currency}: </p>
                        <p>{formatCurrency(item.amount, item.currency)}</p>
                        {item.currency !== "USD" && (
                          <>
                            <p>يعادل</p>
                            <p>{formatCurrency(item.amountInUSD, "USD")}</p>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </HoverCardContent>
              </HoverCard>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <div className="flex justify-between border-t py-3">
                    <p>إجمالي المصروفات</p>
                    <p>{formatCurrency(totalExpenses?.totalUSD || 0, "USD")}</p>
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div>
                    <p className="py-3 font-semibold">تفاصيل المصروفات </p>
                    {totalExpenses?.totalCurrencies.map((item) => (
                      <div
                        className="flex gap-5 border-t py-3"
                        key={item.currency}
                      >
                        <p>{item.currency}: </p>
                        <p>{formatCurrency(item.amount, item.currency)}</p>
                        {item.currency !== "USD" && (
                          <>
                            <p>يعادل</p>
                            <p>{formatCurrency(item.amountInUSD, "USD")}</p>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </HoverCardContent>
              </HoverCard>
              <div className="flex justify-between border-t py-3 font-bold">
                <p>الرصيد</p>
                <p className={cn(balance < 0 && "text-red-500")}>
                  {formatCurrency(balance, "USD")}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
