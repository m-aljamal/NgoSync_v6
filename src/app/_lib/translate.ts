import type {
  donations,
  doners,
  employees,
  fundTransactions,
  projects,
  projectsTransactions,
} from "@/db/schemas"
import type { studentsCourseNotes,  courses } from "@/db/schemas/course"
import { type loans } from "@/db/schemas/loan"
import { type students } from "@/db/schemas/student"

export const projectStatusTranslation: Record<
  typeof projects.$inferSelect.status,
  string
> = {
  "in-progress": "قيد التنفيذ",
  done: "منتهي",
  canceled: "ملغي",
}

export const transactionStatusTranslation: Record<
  typeof projectsTransactions.$inferSelect.transactionStatus,
  string
> = {
  pending: "قيد الانتظار",
  approved: "موافق",
  rejected: "مرفوض",
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

export const attendanceTranslation: Record<
  typeof studentsCourseNotes.$inferSelect.attendance,
  string
> = {
  present: "حضور",
  absent: "غياب",
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
export const studentStatusTranslation: Record<
  typeof students.$inferSelect.status,
  string
> = {
  active: "نشط",
  inactive: "غير نشط",
  graduated: "متخرج",
}

export const courseStatusTranslation: Record<
  typeof courses.$inferSelect.status,
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

export const donationPaymentTranslation: Record<
  typeof donations.$inferSelect.paymentType,
  string
> = {
  cash: "نقدي",
  debt: "دين",
}

export const fundTransactionCategoryTranslation: Record<
  typeof fundTransactions.$inferSelect.category,
  string
> = {
  currency_exchange: "صرف عملة",
  donation: "تبرع",
  fund_transaction: "حركة مالية",
  transfer_between_funds: "تحويل بين الصناديق",
  transfer_from_project: "تحويل من مشروع",
  transfer_to_project: "تحويل لمشروع",
}

export const projectTransactionCategoryTranslation: Record<
  typeof projectsTransactions.$inferSelect.category,
  string
> = {
  transfer_between_projects: "تحويل بين المشاريع",
  expense: "مصروف",
  transfer_from_fund: "تحويل من الصندوق",
  transfer_to_fund: "تحويل للصندوق",
  currency_exchange: "صرف عملة",
  loan: "قرض",
}
