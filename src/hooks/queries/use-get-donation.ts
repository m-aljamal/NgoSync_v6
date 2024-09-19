import client from "@/server/client"
import { useQuery } from "@tanstack/react-query"

export const useGetDonationById = (id: string | null) => {
  const query = useQuery({
    queryKey: ["donation", id],
    queryFn: async () => {
      if (!id) {
        return
      }
      const response = await client.api.donation[":id"].$get({
        param: { id },
      })
      if (!response.ok) {
        throw new Error("Failed to fetch donation")
      }
      const { data } = await response.json()
      return data
    },
  })
  return query
}
