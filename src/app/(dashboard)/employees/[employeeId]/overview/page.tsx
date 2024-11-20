import React from "react"
import { notFound } from "next/navigation"
import { formatDate } from "date-fns"
import { LucideIcon, Mail, Phone } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getEmployee } from "@/app/_lib/queries/employees"
import {
  employeePosisionTranslation,
  genderTranslation,
} from "@/app/_lib/translate"

async function Employee({ params }: { params: { employeeId: string } }) {
  const employee = await getEmployee({ id: params.employeeId })
  if (!employee) {
    notFound()
  }
  return (
    <div>
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
          <ViewDataCardContent
            content={[
              {
                label: "الاسم",
                value: employee.name,
              },
              {
                label: "الجنس",
                value: genderTranslation[employee.gender],
              },
              {
                label: "تاريخ الولادة",
                value: "employee.birthDate",
              },
              {
                label: "مكان العمل",
                value: employee.project,
              },
              {
                label: "نوع الوظيفة",
                value: employeePosisionTranslation[employee.position],
              },
              {
                label: "المسمى الوظيفي",
                value: employee.jobTitle,
              },
              {
                label: <Phone className="h-5 w-5 text-muted-foreground" />,
                value: employee.phone || "لا يوجد رقم هاتف",
              },
              {
                label: <Mail className="h-5 w-5 text-muted-foreground" />,
                value: employee.email || "لا يوجد بريد إلكتروني",
              },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default Employee

type ViewDataCardContentProps = {
  title: string
  icon: React.ElementType
  description: string
}

function ViewDataCardContent({
  title,
  icon,
  description,
}: ViewDataCardContentProps) {
  const Icon = icon
  return (
    <div className="mt-6 border-t border-gray-100">
      <dl className="divide-y divide-gray-100">
        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt className="text-sm font-medium leading-6 text-gray-900">
            <Icon className="size-5" />

            {title}
          </dt>
          <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
            {description}
          </dd>
        </div>
      </dl>
    </div>
    // <div className="mt-6 border-t border-gray-100">
    //   <dl className="divide-y divide-gray-100">
    //     {content.map((item, index) => (
    //       <div
    //         className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
    //         key={index}
    //       >
    //         <dt className="text-sm font-medium leading-6 text-gray-900">
    //           {typeof item.label === "string" ||
    //           typeof item.label === "number" ? (
    //             item.label
    //           ) : typeof item.label === "function" ? (
    //             <item.label className="size-5" />
    //           ) : (
    //             item.label
    //           )}
    //         </dt>
    //         <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
    //           {item.value}
    //         </dd>
    //       </div>
    //     ))}
    //   </dl>
    // </div>
  )
}
