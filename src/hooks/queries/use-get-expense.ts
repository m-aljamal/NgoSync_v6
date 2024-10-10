import client from "@/server/client"
import { useQuery } from "@tanstack/react-query"

export const useGetExpenseById = (id: string | null) => {
  const query = useQuery({
    queryKey: ["expense", id],
    queryFn: async () => {
      if (!id) {
        return
      }
      const response = await client.api.expense[":id"].$get({
        param: { id },
      })
      if (!response.ok) {
        throw new Error("Failed to fetch expense")
      }
      const { data } = await response.json()
      return data
    },
  })
  return query
}
