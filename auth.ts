import { db } from "@/db"
import { type users } from "@/db/schema"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import NextAuth, { type DefaultSession, type Session } from "next-auth"
import { type JWT } from "next-auth/jwt"

import { getUser } from "@/app/_lib/queries/user"

import authConfig from "./auth.config"

export type ExtendedUser = DefaultSession["user"] & {
  role: typeof users.$inferSelect.role
  isTwoFactorEnabled: boolean
}

declare module "next-auth" {
  interface Session {
    user: ExtendedUser
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },

  callbacks: {
    async session({ token, session }: { session: Session; token?: JWT }) {
      if (token?.sub && session.user) {
        session.user.id = token.sub
      }

      // session.user.customField = "customField";
      if (token?.role && session.user) {
        session.user.role = token.role as typeof users.$inferSelect.role
      }
      if (session.user) {
        session.user.isTwoFactorEnabled = token?.isTwoFactorEnabled as boolean
        session.user.name = token?.name
        session.user.email = token?.email
        session.user.role = token?.role as typeof users.$inferSelect.role
      }

      return session
    },
    async jwt({ token, user }) {
      if (!token.sub) return token
      const existingUser = await getUser({ id: token.sub })
      if (!existingUser) return token
      token.name = existingUser.name
      token.email = existingUser.email
      token.role = existingUser.role
      return token
    },
  },
  adapter: DrizzleAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
})
