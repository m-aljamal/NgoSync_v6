import { notFound } from "next/navigation"

import { formatCurrency } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CardItem, type CardItemProps } from "@/components/card-item"
import { getEmployee } from "@/app/_lib/queries/employees"
import {
  employeePosisionTranslation,
  employeeStatusTranslation,
  genderTranslation,
} from "@/app/_lib/translate"

async function Employee({ params }: { params: { employeeId: string } }) {
  const employee = await getEmployee({ id: params.employeeId })
  if (!employee) {
    notFound()
  }
  const {
    address,
    jobTitle,
    name,
    salary,
    gender,
    birthDate,
    project,
    description,
    position,
    phone,
    email,
    currency,
    status,
  } = employee

  const employeeDetails: CardItemProps[] = [
    { title: "الاسم", icon: "User", description: name },
    {
      title: "الراتب الشهري",
      icon: "Wallet",
      description: formatCurrency(salary, currency),
    },
    { title: "العملة", icon: "Coins", description: currency },
    {
      title: "الحالة",
      icon: "Boxes",
      description: employeeStatusTranslation[status],
    },
    { title: "الجنس", icon: "Users", description: genderTranslation[gender] },
    { title: "تاريخ الولادة", icon: "Calendar", description: birthDate },
    { title: "مكان العمل", icon: "Building", description: project },
    {
      title: "نوع الوظيفة",
      icon: "BriefcaseBusiness",
      description: employeePosisionTranslation[position],
    },
    { title: "المسمى الوظيفي", icon: "SpellCheck2", description: jobTitle },
    {
      title: "الهاتف",
      icon: "Phone",
      description: phone || "لا يوجد رقم هاتف",
    },
    {
      title: "ايميل",
      icon: "Mail",
      description: email || "لا يوجد بريد إلكتروني",
    },
    {
      title: "العنوان",
      icon: "MapPinned",
      description: address || "لا يوجد عنوان",
    },
    {
      title: "ملاحظات",
      icon: "NotebookPen",
      description: description || "لا يوجد ملاحظات",
    },
  ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          معلومات الموظف
          <CardDescription className="flex items-center gap-5">
            جميع المعلومات الخاصة بالموظف
          </CardDescription>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {employeeDetails.map((detail, index) => (
          <CardItem key={index} {...detail} />
        ))}
      </CardContent>
    </Card>
  )
}

export default Employee
