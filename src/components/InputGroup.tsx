export default function InputGroup({
  children,
}: {
  children: React.ReactNode
}) {

    
  return (
    <div className="col-span-2 grid grid-cols-2 gap-x-2 gap-y-6">
      {children}
    </div>
  )
}
