import { type users } from "@/db/schemas"
import { type SQL } from "drizzle-orm"

import { type icons } from "@/components/layouts/icons"

export interface SearchParams {
  [key: string]: string | string[] | undefined
}

export interface Option {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
  withCount?: boolean
}

export interface DataTableFilterField<TData> {
  label: string
  value: keyof TData
  placeholder?: string
  options?: Option[]
  isLoading?: boolean
}

export interface DataTableFilterOption<TData> {
  id: string
  label: string
  value: keyof TData
  options: Option[]
  filterValues?: string[]
  filterOperator?: string
  isMulti?: boolean
}

export type DrizzleWhere<T> =
  | SQL<unknown>
  | ((aliases: T) => SQL<T> | undefined)
  | undefined

export type PageLinks = {
  title: string
  roles?: (typeof users.$inferSelect.role)[]
  href?: string
  icon?: keyof typeof icons
  children?: {
    title: string
    href: string
    icon: keyof typeof icons
    roles: (typeof users.$inferSelect.role)[]
  }[]
}[]

type SidebarLink = {
  type: "dropdown" | "collapsible"
  title: string
  href?: string
  icon: keyof typeof icons
  children?: {
    title: string
    href: string
    icon?: keyof typeof icons
  }[]
}

export type SidebarLinks = {
  groupName?: string
  items: SidebarLink[]
}[]

export type ViewMoreDataDetails = {
  label: string
  value: string | number
  colSpan?: string
}[]
