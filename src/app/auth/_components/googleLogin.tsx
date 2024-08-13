import { signIn } from "@/auth"

export default function GoogleSignin() {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("google")
      }}
    >
      <button type="submit">Signin with Google</button>
    </form>
  )
}
