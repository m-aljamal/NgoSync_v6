import { donations, doners, projects, tasks } from "@/db/schemas"
import { employees } from "@/db/schemas/employee"
import * as z from "zod"

const currencyId = z.string().min(2)
const amount = z.coerce.number().positive()
const date = z.date()
export const searchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional(),
  title: z.string().optional(),
  name: z.string().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  system: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  operator: z.enum(["and", "or"]).optional(),
  amount: z.coerce.number().optional(),
  donerType: z.enum(doners.type.enumValues).optional(),
})

export const getTasksSchema = searchParamsSchema

export type GetTasksSchema = z.infer<typeof getTasksSchema>

export const createTaskSchema = z.object({
  title: z.string(),
  label: z.enum(tasks.label.enumValues),
  status: z.enum(tasks.status.enumValues),
  priority: z.enum(tasks.priority.enumValues),
})

export type CreateTaskSchema = z.infer<typeof createTaskSchema>

export const updateTaskSchema = z.object({
  title: z.string().optional(),
  label: z.enum(tasks.label.enumValues).optional(),
  status: z.enum(tasks.status.enumValues).optional(),
  priority: z.enum(tasks.priority.enumValues).optional(),
  system: z.enum(projects.system.enumValues).optional(),
})

export type UpdateTaskSchema = z.infer<typeof updateTaskSchema>

export type GetSearchSchema = z.infer<typeof searchParamsSchema>

export const createProjectSchema = z.object({
  name: z.string(),
  nameTr: z.string(),
  status: z.enum(projects.status.enumValues),
  system: z.enum(projects.system.enumValues),
  userId: z.string(),
  id: z.string().optional(),
})
export type CreateProjectSchema = z.infer<typeof createProjectSchema>

export const deleteSchema = z.object({
  id: z.string(),
})
export type DeleteSchema = z.infer<typeof deleteSchema>

export const deleteArraySchema = z.object({
  ids: z.array(z.string()),
})

export type DeleteArraySchema = z.infer<typeof deleteArraySchema>

export const createDonerSchema = z.object({
  name: z.string().min(2).max(120),
  gender: z.enum(doners.gender.enumValues),
  type: z.enum(doners.type.enumValues),
  status: z.enum(doners.status.enumValues),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  description: z.string().optional(),
  address: z.string().optional(),
  id: z.string().optional(),
})

export type CreateDonerSchema = z.infer<typeof createDonerSchema>

export const createFundSchema = z.object({
  name: z.string().min(2),
  id: z.string().optional(),
})
export type CreateFundSchema = z.infer<typeof createFundSchema>

export const createCurrencySchema = z.object({
  code: z.string().min(2),
  official: z.boolean().optional(),
  id: z.string().optional(),
})
export type CreateCurrencySchema = z.infer<typeof createCurrencySchema>

export const createExpenseCategorySchema = z.object({
  name: z.string().min(2),
  projectId: z.string().min(2),
  id: z.string().optional(),
})

export type CreateExpenseCategorySchema = z.infer<
  typeof createExpenseCategorySchema
>

export const createProposalSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  amount,
  projectId: z.string().min(2),
  currencyId,
  proposalExpenseCategories: z.array(
    z.object({
      amount,
      expensesCategoryId: z.string().min(2),
      id: z.string().optional(),
    })
  ),
})

export type CreateProposalSchema = z.infer<typeof createProposalSchema>

export const createDonationSchema = z.object({
  date,
  donerId: z.string().min(2),
  fundId: z.string().min(1),
  amount,
  currencyId,
  id: z.string().optional(),
  fundTransactionId: z.string().optional(),
  proposalId: z.string().nullable().optional(),
  paymentType: z.enum(donations.paymentType.enumValues),
  isOfficial: z.boolean().optional(),
  receiptDescription: z.string().optional(),
  amountInText: z.string().optional(),
  projectId: z.string().nullable().optional(),
  description: z.string().optional(),
})

export type CreateDonationSchema = z.infer<typeof createDonationSchema>

export const createExpenseSchema = z.object({
  id: z.string().optional(),
  projectId: z.string().min(2),
  currencyId,
  amount,
  description: z.string().optional(),
  isOfficial: z.boolean().optional(),
  expensesCategoryId: z.string().min(2),
  date,
  proposalId: z.string().nullable().optional(),
})

export type CreateExpenseSchema = z.infer<typeof createExpenseSchema>

export const createTransferSchema = z.object({
  id: z.string().optional(),
  senderId: z.string().min(2),
  receiverId: z.string().min(2),
  amount,
  date,
  description: z.string().optional(),
  currencyId,
  isOfficial: z.boolean().optional(),
})

export type CreateTransferSchema = z.infer<typeof createTransferSchema>

export const createExchangeRateSchema = z.object({
  id: z.string().optional(),
  fromCurrencyId: z.string().min(2),
  toCurrencyId: z.string().min(2),
  rate: amount,
  date,
})

export type CreateExchangeRateSchema = z.infer<typeof createExchangeRateSchema>

export const createExchangeSchema = z.object({
  id: z.string().optional(),
  senderId: z.string().min(2),
  receiverId: z.string().min(2),
  fromAmount: amount,
  toAmount: amount,
  rate: amount,
  date,
  description: z.string().optional(),
  fromCurrencyId: currencyId,
  toCurrencyId: currencyId,
})

export type CreateExchangeSchema = z.infer<typeof createExchangeSchema>

export const createEmployeeSchema = z.object({
  name: z.string().min(2).max(120),
  gender: z.enum(employees.gender.enumValues),
  status: z.enum(employees.status.enumValues),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  description: z.string().optional(),
  address: z.string().optional(),
  id: z.string().optional(),
  projectId: z.string().min(2),
  salary: amount,
  currencyId,
  
})

export type CreateEmployeeSchema = z.infer<typeof createEmployeeSchema>
