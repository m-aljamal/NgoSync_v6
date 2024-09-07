import type { donations, doners, employees, projects } from "@/db/schemas"
import { loans } from "@/db/schemas/loan"

export const projectStatusTranslation: Record<
  typeof projects.$inferSelect.status,
  string
> = {
  "in-progress": "قيد التنفيذ",
  done: "منتهي",
  canceled: "ملغي",
}

export const projectSystemTranslation: Record<
  typeof projects.$inferSelect.system,
  string
> = {
  school: "مدرسة",
  cultural_center: "مركز ثقافي",
  health: "صحي",
  office: "مكتب",
  relief: "إغاثة",
}

export const donerStatusTranslation: Record<
  typeof doners.$inferSelect.status,
  string
> = {
  active: "نشط",
  inactive: "غير نشط",
}

export const genderTranslation: Record<
  typeof doners.$inferSelect.gender,
  string
> = {
  female: "أنثى",
  male: "ذكر",
}

export const donerTypeTranslation: Record<
  typeof doners.$inferSelect.type,
  string
> = {
  individual: "فرد",
  orgnization: "منظمة",
}

export const donationPaymentTypeTranslation: Record<
  typeof donations.$inferSelect.paymentType,
  string
> = {
  cash: "نقدي",
  debt: "دين",
}

export const employeeStatusTranslation: Record<
  typeof employees.$inferSelect.status,
  string
> = {
  active: "نشط",
  inactive: "غير نشط",
}

export const employeePosisionTranslation: Record<
  typeof employees.$inferSelect.position,
  string
> = {
  teacher: "معلم",
  manager: "مدير",
  volunteer: "متطوع",
}

export const loanTypeTranslation: Record<
  typeof loans.$inferSelect.type,
  string
> = {
  loan: "قرض",
  repayment: "سداد",
}
