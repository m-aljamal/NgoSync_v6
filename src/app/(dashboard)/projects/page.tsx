import React from "react"

import Heading from "@/components/Heading"

export default function page() {
  return (
    <div>
      <Heading
        title="المشاريع"
        description="المشاريع الخاصة بالمنظمة"
        icon="Presentation"
        breadcrumList={[
          { href: "/dashboard", name: "الرئيسية" },
          { href: "/dashboard", name: "الرئيسية" },
        ]}
      />
      In this updated version, the Icon type is defined as
      ForwardRefExoticComponent & RefAttributes which matches the type of the
      components from lucide-react. This should resolve the TypeScript and
      ESLint errors
    </div>
  )
}
