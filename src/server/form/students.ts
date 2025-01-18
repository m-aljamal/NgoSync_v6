import { db } from "@/db"
import { studentsToCourses } from "@/db/schemas/course"
import { students } from "@/db/schemas/student"
import { zValidator } from "@hono/zod-validator"
import { and, desc, eq } from "drizzle-orm"
import { Hono } from "hono"
import { z } from "zod"

const app = new Hono()
  .get("/", async (c) => {
    const data = await db
      .select({
        id: students.id,
        name: students.name,
      })
      .from(students)
      .orderBy(desc(students.createdAt))
    return c.json({ data })
  })
  .get(
    "/:projectId",
    zValidator("param", z.object({ projectId: z.string() })),
    async (c) => {
      const { projectId } = c.req.valid("param")
      const data = await db
        .select({
          id: students.id,
          name: students.name,
        })
        .from(students)
        .where(eq(students.projectId, projectId))
        .orderBy(desc(students.createdAt))

      return c.json({ data })
    }
  )
  .get(
    "/:projectId/:courseId?",
    zValidator(
      "param",
      z.object({
        projectId: z.string(),
        courseId: z.string().optional(),
      })
    ),
    async (c) => {
      const { projectId, courseId } = c.req.valid("param")

      const data = await db
        .select({
          id: students.id,
          name: students.name,
        })
        .from(students)
        .where(
          and(
            projectId ? eq(students.projectId, projectId) : undefined,
            courseId ? eq(studentsToCourses.courseId, courseId) : undefined
          )
        )
        .leftJoin(
          studentsToCourses,
          eq(students.id, studentsToCourses.studentId)
        )
        .orderBy(desc(students.createdAt))

      return c.json({ data })
    }
  )

export default app
