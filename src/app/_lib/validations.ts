import { donations, doners, projects, tasks } from "@/db/schemas"
import { courses, studentsCourseNotes } from "@/db/schemas/course"
import { employees } from "@/db/schemas/employee"
import { loans } from "@/db/schemas/loan"
import { students } from "@/db/schemas/student"
import Decimal from "decimal.js"
import * as z from "zod"

const currencyId = z.string().min(2)

const decimalSchema = z.instanceof(Decimal).or(
  z
    .string()
    .or(z.number())
    .transform((val) => new Decimal(val))
)
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
  amount: z.string().optional(),
  currencyCode: z.string().optional(),
  paymentType: z.string().optional(),
  type: z.string().optional(),
  donerId: z.string().optional(),
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

export const createSalariesSchema = z.object({
  date,
  projectId: z.string().min(2),
  proposalId: z.string().optional(),
  isOfficial: z.boolean().optional(),
  salaries: z.array(
    z.object({
      employeeName: z.string().optional(),
      discount: decimalSchema.optional(),
      extra: decimalSchema.optional(),
      employeeId: z.string().min(2),
      salary: decimalSchema,
      currencyId,
      netSalary: decimalSchema,
      description: z.string().optional(),
      paymentCurrencyId: currencyId,
    })
  ),
  id: z.string().optional(),
})
export type CreateSalariesSchema = z.infer<typeof createSalariesSchema>

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
  isOfficial: z.boolean().optional(),
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
  amount: decimalSchema,
  projectId: z.string().min(2),
  currencyId,
  proposalExpenseCategories: z.array(
    z.object({
      amount: decimalSchema,
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
  amount: decimalSchema,
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
  amount: decimalSchema,
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
  amount: decimalSchema,
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
  rate: decimalSchema,
  date,
})

export type CreateExchangeRateSchema = z.infer<typeof createExchangeRateSchema>

export const createExchangeSchema = z.object({
  date,
  id: z.string().optional(),
  rate: decimalSchema,
  fromAmount: decimalSchema,
  fromCurrencyId: currencyId,
  senderId: z.string().min(2),
  receiverId: z.string().min(2),
  toAmount: decimalSchema,
  description: z.string().optional(),
  toCurrencyId: currencyId,
})

export type CreateExchangeSchema = z.infer<typeof createExchangeSchema>

export const createEmployeeSchema = z.object({
  name: z.string().min(2).max(120),
  projectId: z.string().min(2),
  gender: z.enum(employees.gender.enumValues),
  position: z.enum(employees.position.enumValues),
  jobTitleId: z.string().min(2),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  salary: decimalSchema,
  currencyId,
  status: z.enum(employees.status.enumValues),
  description: z.string().optional(),
  birthDate: date,
  id: z.string().optional(),
  userId: z.string().optional(),
})

export type CreateEmployeeSchema = z.infer<typeof createEmployeeSchema>

export const createEmployeesToCourses = z.object({
  courseId: z.string().min(2),
  teachers: z.array(z.string().min(2)),
})

export type CreateEmployeesToCourses = z.infer<typeof createEmployeesToCourses>

export const createStudentsToCourses = z.object({
  courseId: z.string().min(2),
  students: z.array(z.string().min(2)),
})

export type CreateStudentsToCourses = z.infer<typeof createStudentsToCourses>

export const createJobTitleSchema = z.object({
  name: z.string().min(2).max(120),
  id: z.string().optional(),
})

export type CreateJobTitleSchema = z.infer<typeof createJobTitleSchema>

export const createLoanSchema = z.object({
  projectId: z.string().min(2),
  employeeId: z.string().min(2),
  amount: decimalSchema,
  currencyId,
  type: z.enum(loans.type.enumValues),
  date,
  description: z.string().optional(),
  id: z.string().optional(),
})

export type CreateLoanSchema = z.infer<typeof createLoanSchema>

export const createStudentSchema = z.object({
  name: z.string().min(2).max(120),
  projectId: z.string().min(2),
  nID: z.string(),
  gender: z.enum(students.gender.enumValues),
  status: z.enum(students.status.enumValues),
  phone: z.string().min(6).max(20),
  description: z.string().optional(),
  address: z.string().optional(),
  dateOfBirth: date,
  fatherName: z.string().min(2).max(120),
  motherName: z.string().min(2).max(120),
  registrationDate: date,
  id: z.string().optional(),
})

export type CreateStudentSchema = z.infer<typeof createStudentSchema>

export const createCourseSchema = z.object({
  name: z.string().min(2).max(120),
  description: z.string().optional(),
  projectId: z.string().min(2),
  status: z.enum(courses.status.enumValues),
  id: z.string().optional(),
})

export type CreateCourseSchema = z.infer<typeof createCourseSchema>

export const createLessonSchema = z.object({
  title: z.string().min(2).max(120),
  courseId: z.string().min(6),
  date,
  description: z.string().optional(),
  students: z.array(
    z.object({
      studentId: z.string().min(2),
      name: z.string().optional(),
      note: z.string().optional(),
      attendance: z.enum(studentsCourseNotes.attendance.enumValues, {
        required_error: "الرجاء اختيار حالة الحضور",
      }),
      pageNumber: z.string().optional(),
      mark: z.string().optional(),
    })
  ),
})

export type CreateLessonSchema = z.infer<typeof createLessonSchema>
