import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export async function UserNav({
  image,
  name,
}: {
  image: string
  name: string
}) {
  return (
    <div className="flex flex-1 items-center justify-start gap-1 lg:justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative size-8 rounded-full">
            <Avatar className="size-9">
              <AvatarImage src={image} alt="userImage" />

              <AvatarFallback>{name[0]}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40" align="end" forceMount>
          {/* <DropdownMenuItem asChild>
          <form
            action={async () => {
              "use server"
              await signOut({
                redirectTo: "/",
              })
            }}
          >
          <Button
              variant="ghost"
              size="sm"
              className="flex h-7 w-full justify-start text-gray-700"
            >
              تسجيل الخروج
            </Button>
          </form>
        </DropdownMenuItem> */}
          <DropdownMenuItem>Profile</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
