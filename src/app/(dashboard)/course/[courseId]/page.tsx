import React from "react"

import Heading from "@/components/Heading"
import { getCourse } from "@/app/_lib/queries/course"

async function Course({ params }: { params: { courseId: string } }) {
  const course = await getCourse({ courseId: params.courseId })

  return (
    <div>
      <Heading
        title={course?.name || ""}
        description={course?.description || ""}
        icon="BookA"
      />
    </div>
  )
}

export default Course
