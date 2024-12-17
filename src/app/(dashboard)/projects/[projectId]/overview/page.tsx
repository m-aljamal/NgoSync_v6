import React from "react"
import { notFound } from "next/navigation"
import { Users } from "lucide-react"

import { cn, formatCurrency, months } from "@/lib/utils"
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
import CardSelect from "@/components/CardSelect"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import {
  getEmployeesCounts,
  getProject,
  getProjectExpensesByMonth,
  getProjectMonthlyExpenses,
  getProjectMonthlyIncome,
  getProjectRemainingBudget,
  getProjectTotalSummary,
} from "@/app/_lib/queries/projects"

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

  const expensesByMonth =
    (await getProjectExpensesByMonth({
      projectId: project.id,
      month: searchParams?.month,
    })) || []

  const employeesCounts = await getEmployeesCounts({
    projectId: project.id,
  })

  const monthlyExpenses = (await getProjectMonthlyExpenses(project.id)) || []

  const monthlyIncome = (await getProjectMonthlyIncome(project.id)) || []

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
        <div className="mt-8 grid items-start gap-6 rounded-lg lg:grid-cols-2 xl:grid-cols-2">
          <div className="col-span-2 grid items-start gap-6 xl:col-span-1">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>المصروف الشهري</CardTitle>
                  <CardDescription className="mt-1">
                    تفاصيل المصروفات الشهرية
                  </CardDescription>
                </div>
                <CardSelect
                  items={[{ label: "ALL", value: "ALL" }, ...months]}
                  name="month"
                />
              </CardHeader>
              <CardContent>
                <React.Suspense
                  fallback={
                    <DataTableSkeleton
                      columnCount={2}
                      searchableColumnCount={1}
                      filterableColumnCount={2}
                      cellWidths={["10rem", "12rem", "12rem", "8rem"]}
                      shrinkZero
                    />
                  }
                />
                {/* <DataTable
                    columns={expensesByMonthColumns}
                    data={expensesByMonth}
                    basic={true}
                  /> */}
              </CardContent>
            </Card>
          </div>
          <div className="col-span-2 grid items-start gap-6 xl:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle> مجموع الإنفاق</CardTitle>
                <CardDescription className="mt-1">
                  تفاصيل الإنفاق الشهري
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* <DataTable
                    columns={monthlyExpensesColumns}
                    data={monthlyExpenses}
                    basic={true}
                  /> */}
              </CardContent>
            </Card>
          </div>
          <div className="col-span-2 grid items-start gap-6 xl:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>الواردات</CardTitle>
                <CardDescription className="mt-1">
                  تفاصيل الواردات الشهرية
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* <DataTable
                    columns={monthlyIncomeColumns}
                    data={monthlyIncome}
                    basic={true}
                  /> */}
              </CardContent>
            </Card>
          </div>
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
                      <p>
                        {formatCurrency(totalExpenses?.totalUSD || 0, "USD")}
                      </p>
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
      </div>
    </>
  )
}
