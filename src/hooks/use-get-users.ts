import { useQuery } from "@tanstack/react-query"

import { client } from "@/lib/hono"

export const useGetFormData = (form:string) => {
  const query = useQuery({
    queryKey: ["form", form],
    queryFn: async () => {
      const response = await client.api.form[":form"].$get({ param: { form: form } })
      if (!response.ok) {
        throw new Error("Failed to fetch users")
      }
      const { data } = await response.json()
       
      
      return data
    },
  })
  return query
}
