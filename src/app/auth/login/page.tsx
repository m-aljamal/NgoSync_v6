// import { Button } from "@/components/ui/button"

// export default function AuthenticationPage() {
//   return (
//     <>
//       <div className="grid h-full grid-cols-2">
//         <div className="flex items-center justify-center">
//           <div className="space-y-4">
//             <div className="flex flex-col space-y-2 text-center">
//               <h1 className="text-2xl font-semibold tracking-tight">
//                 تسجيل الدخول
//               </h1>
//               <p className="text-sm text-muted-foreground">
//                 يمكنك تسجيل الدخول باستخدام حسابك على Google
//               </p>
//             </div>
//             <form
//               action={async () => {
//                 "use server"
//                 await signIn("google")
//               }}
//             >
//               <Button variant="outline" type="submit" className="w-full">
//                 Google
//               </Button>
//             </form>
//           </div>
//         </div>
//         <div className="bg-blue-300"> </div>
//       </div>
//     </>
//   )
// }

import Image from "next/image"
 
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { signIn } from "@/auth"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-center space-y-1">
          <div className="mb-4 flex size-16  items-center justify-center rounded-full bg-primary shadow-lg">
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
          {/* <Button
            className="w-full transform py-6 text-lg font-semibold transition-all duration-300 ease-in-out hover:scale-105"
            variant="outline"
          >
            <Google className="mr-2 h-5 w-5" />
            Sign in with Google
          </Button> */}

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
