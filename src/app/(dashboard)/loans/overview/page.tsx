import React, { Fragment } from "react"

import { formatCurrency } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { getLoansBalance } from "@/app/_lib/queries/loans"

async function page() {
  const balance = await getLoansBalance()

  return (
    <div className="grid items-start gap-6 space-y-5 rounded-lg lg:grid-cols-2 xl:grid-cols-2">
      <div className="col-span-2 grid items-start gap-6 xl:col-span-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>بيانات القروض</CardTitle>
              <CardDescription className="mt-1">
                تفاصيل القرض و التسديد
              </CardDescription>
            </div>
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
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead></TableHead>
                    <TableHead>العملة</TableHead>
                    <TableHead>القرضة</TableHead>
                    <TableHead>التسديد</TableHead>
                    <TableHead>المتبقي</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {balance?.map((employeeLoan, index) => (
                    <Fragment key={index}>
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="bg-zinc-100 text-center font-bold"
                        >
                          {employeeLoan.employee}
                        </TableCell>
                      </TableRow>
                      {employeeLoan.loans.map((loan, loanIndex) => (
                        <TableRow key={loanIndex}>
                          <TableCell></TableCell>
                          <TableCell>{loan.currencyCode}</TableCell>
                          <TableCell>
                            {formatCurrency(loan.totalLoan, loan.currencyCode)}
                          </TableCell>
                          <TableCell>
                            {formatCurrency(
                              loan.totalRepayment,
                              loan.currencyCode
                            )}
                          </TableCell>
                          <TableCell>
                            {formatCurrency(loan.balance, loan.currencyCode)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </Fragment>
                  ))}
                </TableBody>
              </Table>
            </React.Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default page
