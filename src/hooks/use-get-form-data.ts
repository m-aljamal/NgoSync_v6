import client from "@/server/client"
import { useQuery } from "@tanstack/react-query"

export const useGetUsers = () => {
  const query = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await client.api.form.users.$get()
      if (!response.ok) {
        throw new Error("Failed to fetch users")
      }
      const { data } = await response.json()
      return data
    },
  })
  return query
}

export const useGetProjects = () => {
  const query = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await client.api.form.projects.$get()
      if (!response.ok) {
        throw new Error("Failed to fetch projects")
      }
      const { data } = await response.json()
      return data
    },
  })
  return query
}

export const useGetCurrencies = () => {
  const query = useQuery({
    queryKey: ["currencies"],
    queryFn: async () => {
      const response = await client.api.form.currencies.$get()
      if (!response.ok) {
        throw new Error("Failed to fetch currencies")
      }
      const { data } = await response.json()
      return data
    },
  })
  return query
}

export const useGetExpensesCategoriesByProjectId = (projectId: string) => {
  const query = useQuery({
    queryKey: ["expensesCategoriesByProjectId", projectId],
    queryFn: async () => {
      const response = await client.api.form["expenses-categories"][
        ":projectId"
      ].$get({
        param: { projectId },
      })
      if (!response.ok) {
        throw new Error("Failed to fetch expenses categories")
      }
      const { data } = await response.json()
      return data
    },
  })
  return query
}
