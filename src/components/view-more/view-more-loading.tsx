import { Skeleton } from "@/components/ui/skeleton"

export default function ViewMoreLoading() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
        <Skeleton className="h-[100px]" />
        <Skeleton className="h-[100px]" />
        <Skeleton className="h-[100px]" />
      </div>
      <Skeleton className="h-[300px]" />
    </div>
  )
}
