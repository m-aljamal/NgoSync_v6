 
import Heading from "@/components/Heading"
 
export default async function OutcomePage({
  params,
}: {
  params: { projectId: string }
}) {
  
  return (
    <>
      <Heading
        title={`المصروفات`}
        description="جميع مصروفات المشروع."
        icon="ArrowUpRight"
      />
      
    </>
  )
}
