import type { icons } from "./icons";


export interface Route {
  title: string
  // roles?: (typeof users.$inferSelect.role)[];
  roles?: string[];

  icon?: keyof typeof icons
  href?: string
  children?: {
    title: string
    href: string
    description: string
    icon?: keyof typeof icons
      roles?: string[];
    //   roles: (typeof users.$inferSelect.role)[];
  }[]
}

export const routes: Route[] = [
  {
    title: "الرئيسية",
    href: "/overview",
    roles: ["ADMIN", "PROJECT_MANAGER"],
  },
  {
    title: "المشاريع",
    children: [
      {
        title: "المشاريع",
        icon: "Presentation",
        href: "/projects",
        description: "جميع المشاريع وأنشطة المنظمة",
        roles: ["ADMIN", "PROJECT_MANAGER"],
      },

      {
        title: "الدراسات المالية",
        icon: "SquareKanban",
        href: "/proposals",
        description: "جميع الدراسات المالية للمشاريع",
        roles: ["ADMIN"],
      },
      {
        title: "التوثيق الرسمي",
        icon: "BriefcaseBusiness",
        href: "/official-documents/overview",
        description: "التوثيق الرسمي للحركات المالية",
        roles: ["ADMIN"],
      },
      {
        title: "الموظفين",
        href: "/employees",
        icon: "Users",
        description: "جميع موظفين في المشاريع",
        roles: ["ADMIN", "PROJECT_MANAGER"],
      },
      {
        title: "المستفيدين",
        href: "/beneficiaries",
        icon: "UsersRound",
        description: "جميع المستفيدين من المشاريع",
        roles: ["ADMIN"],
      },
    ],
  },
  {
    title: "الموارد المالية",
    roles: ["ADMIN"],
    children: [
      {
        icon: "HandCoins",
        title: "المتبرعين",
        description: "معلومات المتبرعين للمنظمة",
        href: "/doners",
        roles: ["ADMIN"],
      },
      {
        icon: "Coins",
        title: "التبرعات",
        description: "جميع التبرعات المالية للمنظمة",
        href: "/donations",
        roles: ["ADMIN"],
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
        roles: ["ADMIN"],
      },
      {
        icon: "Redo",
        title: "المصاريف",
        description: "جميع المصاريف المالية للمنظمة",
        href: "/expenses",
        roles: ["ADMIN", "PROJECT_MANAGER"],
      },
      {
        icon: "BookUser",
        title: "الرواتب",
        description: "رواتب الموظفين",
        href: "/salaries",
        roles: ["ADMIN", "PROJECT_MANAGER"],
      },
      {
        icon: "ClipboardList",
        title: "تصنيفات المصاريف",
        description: "جميع تصنيفات المصاريف المالية ",
        href: "/expenses-categories",
        roles: ["ADMIN", "PROJECT_MANAGER"],
      },
      {
        icon: "NotepadText",
        title: "القروض",
        description: "القروض المالية للموظفين",
        href: "/loans/overview",
        roles: ["ADMIN"],
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
        roles: ["ADMIN"],
      },
      {
        icon: "MoveDownLeft",
        title: "حوالات الصناديق",
        description: "تحويل من مشروع الى صندوق",
        href: "/transfers-from-project-to-fund",
        roles: ["ADMIN", "PROJECT_MANAGER"],
      },
      {
        icon: "ArrowLeftRight",
        title: "حوالات بين المشاريع",
        description: "تحويل من مشروع الى مشروع",
        href: "/transfers-from-project-to-project",
        roles: ["ADMIN", "PROJECT_MANAGER"],
      },
      {
        icon: "ArrowLeftRight",
        title: "حوالات بين الصناديق",
        description: "تحويل من صندوق الى صندوق",
        href: "/transfers-from-fund-to-fund",
        roles: ["ADMIN"],
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
        roles: ["ADMIN"],
      },
      {
        icon: "Coins",
        title: "أسعار الصرف",
        href: "/exchange-rates",
        description: "أسعار صرف العملات",
        roles: ["ADMIN", "PROJECT_MANAGER"],
      },
      {
        icon: "Boxes",
        title: "بين الصناديق",
        href: "/exchange-between-funds",
        description: "صرف عملات بين الصناديق",
        roles: ["ADMIN"],
      },
      {
        icon: "BringToFront",
        title: "بين المشاريع",
        href: "/exchange-between-projects",
        description: "صرف عملات بين المشاريع",
        roles: ["ADMIN", "PROJECT_MANAGER"],
      },
    ],
  },
  {
    title: "المستخدمين",
    href: "/system-users",
    roles: ["ADMIN"],
  },
]
