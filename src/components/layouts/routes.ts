import { type users } from "@/db/schemas/user"

import type { icons } from "./icons"

export interface Route {
  title: string
  roles?: (typeof users.$inferSelect.role)[]

  icon?: keyof typeof icons
  href?: string
  children?: {
    title: string
    href: string
    description: string
    icon?: keyof typeof icons
    roles: (typeof users.$inferSelect.role)[]
  }[]
}

export const routes: Route[] = [
  {
    title: "الرئيسية",
    href: "/overview",
    roles: ["admin", "project_manager"],
  },
  {
    title: "المشاريع",
    children: [
      {
        title: "المشاريع",
        icon: "Presentation",
        href: "/projects",
        description: "جميع المشاريع وأنشطة المنظمة",
        roles: ["admin", "project_manager"],
      },

      {
        title: "الدراسات المالية",
        icon: "SquareKanban",
        href: "/proposals",
        description: "جميع الدراسات المالية للمشاريع",
        roles: ["admin"],
      },
      {
        title: "التوثيق الرسمي",
        icon: "BriefcaseBusiness",
        href: "/official-documents/overview",
        description: "التوثيق الرسمي للحركات المالية",
        roles: ["admin"],
      },
      {
        title: "الموظفين",
        href: "/employees",
        icon: "Users",
        description: "جميع موظفين في المشاريع",
        roles: ["admin", "project_manager"],
      },
      {
        title: "المستفيدين",
        href: "/beneficiaries",
        icon: "UsersRound",
        description: "جميع المستفيدين من المشاريع",
        roles: ["admin"],
      },
    ],
  },
  {
    title: "الموارد المالية",
    roles: ["admin"],
    children: [
      {
        icon: "HandCoins",
        title: "المتبرعين",
        description: "معلومات المتبرعين للمنظمة",
        href: "/doners",
        roles: ["admin"],
      },
      {
        icon: "Coins",
        title: "التبرعات",
        description: "جميع التبرعات المالية للمنظمة",
        href: "/donations",
        roles: ["admin"],
      },
    ],
  },
  {
    title: "الحركات المالية",
    children: [
      {
        icon: "Wallet",
        title: "الصناديق",
        description: "جميع الصناديق المالية",
        href: "/funds",
        roles: ["admin"],
      },
      {
        icon: "Redo",
        title: "المصاريف",
        description: "جميع المصاريف المالية للمنظمة",
        href: "/expenses",
        roles: ["admin", "project_manager"],
      },
      {
        icon: "BookUser",
        title: "الرواتب",
        description: "رواتب الموظفين",
        href: "/salaries",
        roles: ["admin", "project_manager"],
      },
      {
        icon: "ClipboardList",
        title: "تصنيفات المصاريف",
        description: "جميع تصنيفات المصاريف المالية ",
        href: "/expenses-categories",
        roles: ["admin", "project_manager"],
      },
      {
        icon: "NotepadText",
        title: "القروض",
        description: "القروض المالية للموظفين",
        href: "/loans",
        roles: ["admin"],
      },
    ],
  },
  {
    title: "الحوالات المالية",
    children: [
      {
        icon: "MoveUpRight",
        title: "حوالات المشاريع",
        description: "تحويل من صندوق الى مشروع",
        href: "/transfers-from-fund-to-project",
        roles: ["admin"],
      },
      {
        icon: "MoveDownLeft",
        title: "حوالات الصناديق",
        description: "تحويل من مشروع الى صندوق",
        href: "/transfers-from-project-to-fund",
        roles: ["admin", "project_manager"],
      },
      {
        icon: "ArrowLeftRight",
        title: "حوالات بين المشاريع",
        description: "تحويل من مشروع الى مشروع",
        href: "/transfers-from-project-to-project",
        roles: ["admin", "project_manager"],
      },
      {
        icon: "ArrowLeftRight",
        title: "حوالات بين الصناديق",
        description: "تحويل من صندوق الى صندوق",
        href: "/transfers-from-fund-to-fund",
        roles: ["admin"],
      },
    ],
  },
  {
    title: "العملات",
    icon: "Coins",
    children: [
      {
        icon: "Banknote",
        title: "العملات",
        href: "/currencies",
        description: "جميع العملات المالية",
        roles: ["admin"],
      },
      {
        icon: "Coins",
        title: "أسعار الصرف",
        href: "/exchange-rates",
        description: "أسعار صرف العملات",
        roles: ["admin", "project_manager"],
      },
      {
        icon: "Boxes",
        title: "بين الصناديق",
        href: "/exchange-between-funds",
        description: "صرف عملات بين الصناديق",
        roles: ["admin"],
      },
      {
        icon: "BringToFront",
        title: "بين المشاريع",
        href: "/exchange-between-projects",
        description: "صرف عملات بين المشاريع",
        roles: ["admin", "project_manager"],
      },
    ],
  },
  {
    title: "المستخدمين",
    href: "/system-users",
    roles: ["admin"],
  },
]
