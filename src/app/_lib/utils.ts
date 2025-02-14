import { tasks, type Project, type Task } from "@/db/schemas"
import { faker } from "@faker-js/faker"
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons"
import Decimal from "decimal.js"
import { customAlphabet } from "nanoid"

import { generateId } from "@/lib/id"

export function generateRandomTask(): Task {
  return {
    id: generateId(),
    code: `TASK-${customAlphabet("0123456789", 4)()}`,
    title: faker.hacker
      .phrase()
      .replace(/^./, (letter) => letter.toUpperCase()),
    status: faker.helpers.shuffle(tasks.status.enumValues)[0] ?? "todo",
    label: faker.helpers.shuffle(tasks.label.enumValues)[0] ?? "bug",
    priority: faker.helpers.shuffle(tasks.priority.enumValues)[0] ?? "low",
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

/**
 * Returns the appropriate status icon based on the provided status.
 * @param status - The status of the task.
 * @returns A React component representing the status icon.
 */
export function getStatusIcon(status: Project["status"]) {
  const statusIcons = {
    canceled: CrossCircledIcon,
    done: CheckCircledIcon,
    "in-progress": StopwatchIcon,
    todo: QuestionMarkCircledIcon,
  }

  return statusIcons[status] || CircleIcon
}

/**
 * Returns the appropriate priority icon based on the provided priority.
 * @param priority - The priority of the task.
 * @returns A React component representing the priority icon.
 */
export function getPriorityIcon(priority: Task["priority"]) {
  const priorityIcons = {
    high: ArrowUpIcon,
    low: ArrowDownIcon,
    medium: ArrowRightIcon,
  }

  return priorityIcons[priority] || CircleIcon
}

export function toDecimalFixed(
  amount: Decimal,
  decimalPlaces: number = 4
): string {
  return new Decimal(amount).toFixed(decimalPlaces)
}
