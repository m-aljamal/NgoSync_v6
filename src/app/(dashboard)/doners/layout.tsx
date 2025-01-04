import { adminRouteProtection } from "@/app/_lib/auth"

export default async function page({
  children,
}: {
  children: React.ReactNode
}) {
  await adminRouteProtection()

  return <div>{children}</div>
}
