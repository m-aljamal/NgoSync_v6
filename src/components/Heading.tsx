import BreadcrumList from "./BreadcrumList"
import { icons } from "./layouts/icons"

interface HeadingProps {
  title: string
  description: string
  icon: keyof typeof icons
}

export default function Heading({ description, title, icon }: HeadingProps) {
  const Component = icons[icon || "Users"]
  return (
    <div className="mb-12 space-y-3">
      <BreadcrumList
        links={[
          { href: "/projects", name: "المشاريع" },
          { href: "/w", name: "واجدو الطريق" },
        ]}
      />
      <div className="grid grid-cols-2">
        <div className="flex items-center justify-start gap-5">
          <Component className="hidden size-6 sm:flex" />
          <div className="space-y-3">
            <h2 className="text-2xl font-bold tracking-tighter">{title}</h2>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
