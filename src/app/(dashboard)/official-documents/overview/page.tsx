import React from "react"

import { months } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import CardSelect from "@/components/CardSelect"

async function Overview() {
  return (
    <div className="grid items-start gap-6 space-y-5 rounded-lg lg:grid-cols-2 xl:grid-cols-2">
      <div className="col-span-2 grid items-start gap-6 xl:col-span-3">
        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle> التحويل / المصروف</CardTitle>
              <CardDescription className="mt-1">
                تفاصيل التحويل و المصروف الشهري للمشاريع
              </CardDescription>
            </div>
            <CardSelect items={months} name="month" />
          </CardHeader>
          <CardContent></CardContent>
        </Card> */}
      </div>
    </div>
  )
}

export default Overview
