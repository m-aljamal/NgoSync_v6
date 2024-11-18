import { notFound } from "next/navigation"
import { Building2, HandCoins, Mail, Phone, UserRound } from "lucide-react"

import { formatCurrency } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import ViewDataCardContent from "@/components/view-data-card-content"
import { getDoner, getDonerSummary } from "@/app/_lib/queries/doners"

async function DonerOverview({
  params,
}: {
  params: {
    donerId: string
  }
}) {
  const doner = await getDoner({ id: params.donerId })
  if (!doner) {
    notFound()
  }

  const { totalDonations, donationsCount } = await getDonerSummary({
    donerId: params.donerId,
  })

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {totalDonations?.map((item) => (
          <Card key={item.currency}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                إجمالي التبرعات
              </CardTitle>

              <span className="font-bold text-muted-foreground">
                {item.currency}
              </span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(item.totalDonations, item.currency)}
              </div>
              <p className="text-xs text-muted-foreground">
                مجموع التبرعات الكلي في {item.currency}
              </p>
            </CardContent>
          </Card>
        ))}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">عدد التبرعات</CardTitle>
            <HandCoins className="size-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{donationsCount.count}</div>
            <p className="text-xs text-muted-foreground">عدد التبرعات الكلي</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              معلومات المتبرع
              <CardDescription className="mt-2 flex items-center gap-5">
                {doner.type === "orgnization" ? (
                  <Building2 className="size-4 text-muted-foreground" />
                ) : (
                  <UserRound className="size-4 text-muted-foreground" />
                )}
                {doner.name}
              </CardDescription>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ViewDataCardContent
              content={[
                { label: "الاسم", value: doner.name },
                { label: "نوع المتبرع", value: doner.type },
                {
                  label: "حالة المتبرع",
                  value: <Badge variant={doner.status}>{doner.status}</Badge>,
                },
                {
                  label: <Phone className="size-5 text-muted-foreground" />,
                  value: doner.phone || "لا يوجد رقم هاتف",
                },
                {
                  label: <Mail className="size-5 text-muted-foreground" />,
                  value: doner.email || "لا يوجد بريد إلكتروني",
                },
                {
                  label: "ملاحظات",
                  value: doner.description || "لا يوجد ملاحظات",
                },
              ]}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default DonerOverview
