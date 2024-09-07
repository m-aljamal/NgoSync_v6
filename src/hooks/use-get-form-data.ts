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
export const useGetProposalExpensesCategories = (proposalId: string) => {
  const query = useQuery({
    queryKey: ["proposalExpensesCategories", proposalId],
    queryFn: async () => {
      const response = await client.api.form["proposals-expenses"][
        ":proposalId"
      ].$get({
        param: { proposalId },
      })
      if (!response.ok) {
        throw new Error("Failed to fetch proposal expenses categories")
      }
      const { data } = await response.json()
      return data
    },
  })
  return query
}

export const useGetFunds = () => {
  const query = useQuery({
    queryKey: ["funds"],
    queryFn: async () => {
      const response = await client.api.form.funds.$get()
      if (!response.ok) {
        throw new Error("Failed to fetch funds")
      }
      const { data } = await response.json()
      return data
    },
  })
  return query
}

export const useGetDoners = () => {
  const query = useQuery({
    queryKey: ["doners"],
    queryFn: async () => {
      const response = await client.api.form.doners.$get()
      if (!response.ok) {
        throw new Error("Failed to fetch doners")
      }
      const { data } = await response.json()
      return data
    },
  })
  return query
}

export const useGetProposals = (projectId: string) => {
  const query = useQuery({
    queryKey: ["proposals", projectId],
    queryFn: async () => {
      const response = await client.api.form.proposals[":projectId"].$get({
        param: { projectId },
      })
      if (!response.ok) {
        throw new Error("Failed to fetch proposals")
      }
      const { data } = await response.json()
      return data
    },
  })
  return query
}

export const useGetjobTitle = () => {
  const query = useQuery({
    queryKey: ["jobTtile"],
    queryFn: async () => {
      const response = await client.api.form["job-titles"].$get()
      if (!response.ok) {
        throw new Error("Failed to fetch job titles")
      }
      const { data } = await response.json()
      return data
    },
  })
  return query
}

export const useGetEmployees = (projectId: string) => {
  const query = useQuery({
    queryKey: ["employees", projectId],
    queryFn: async () => {
      const response = await client.api.form.employees[":projectId"].$get({
        param: { projectId },
      })
      if (!response.ok) {
        throw new Error("Failed to fetch employees")
      }
      const { data } = await response.json()
      return data
    },
  })
  return query
}
