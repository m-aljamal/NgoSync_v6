import Image from "next/image"
import { signIn } from "@/auth"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-center space-y-1">
          <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-primary shadow-lg">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={40}
              height={40}
              className="text-primary-foreground"
            />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>
        <CardContent>
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
          <p className="mt-4 text-center text-sm text-muted-foreground">
            By signing in, you agree to our{" "}
            <a
              href="#"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </a>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
