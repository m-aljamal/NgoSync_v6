import { signIn } from "@/auth"

import { Button } from "@/components/ui/button"

export default function AuthenticationPage() {
  return (
    <>
      <div className="grid h-full grid-cols-2">
        <div className="flex items-center justify-center">
          <div className="space-y-4">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                تسجيل الدخول
              </h1>
              <p className="text-sm text-muted-foreground">
                يمكنك تسجيل الدخول باستخدام حسابك على Google
              </p>
            </div>
            <form
              action={async () => {
                "use server"
                await signIn("google")
              }}
            >
              <Button variant="outline" type="submit" className="w-full">
                Google
              </Button>
            </form>
          </div>
        </div>
        <div className="bg-blue-300"> </div>
      </div>
    </>
  )
}
