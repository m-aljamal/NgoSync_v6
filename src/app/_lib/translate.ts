import { doners, type projects } from "@/db/schema"

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
