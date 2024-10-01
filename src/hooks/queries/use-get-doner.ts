import client from "@/server/client"
import { useQuery } from "@tanstack/react-query"

export const useGetDonerById = (id: string | null) => {
  const query = useQuery({
    queryKey: ["doner", id],
    queryFn: async () => {
      if (!id) {
        return
      }
      const response = await client.api.doner[":id"].$get({
        param: { id },
      })
      if (!response.ok) {
        throw new Error("Failed to fetch doner")
      }
      const { data } = await response.json()
      return data
    },
  })
  return query
}
