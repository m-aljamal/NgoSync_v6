import { env } from "@/env"
import { type NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"

export default {
  providers: [
    Google({
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
    }),
  ],
} satisfies NextAuthConfig
