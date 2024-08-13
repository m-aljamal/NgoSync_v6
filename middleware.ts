import authConfig from "@/auth.config"
import {
  API_AUTH_PREFIX,
  AUTH_ROUTES,
  DEFAULT_REDIRECT,
  PUBLIC_ROUTES,
} from "@/routes"
import NextAuth from "next-auth"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { nextUrl } = req
  const isAuthenticated = !!req.auth
  const isApiAuthRoute = nextUrl.pathname.startsWith(API_AUTH_PREFIX)
  const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname)
  const isAuthRoute = AUTH_ROUTES.includes(nextUrl.pathname)
  console.log({
    isAuthenticated,
    isApiAuthRoute,
    isPublicRoute,
    isAuthRoute,
    nextUrl,
    API_AUTH_PREFIX,
    PUBLIC_ROUTES,
    AUTH_ROUTES,
    DEFAULT_REDIRECT,
  })

  // public auth api routes are accessible to everyone
  if (isApiAuthRoute) {
    return
  }

  // public routes are accessible to everyone if they are not logged in
  if (isAuthRoute) {
    if (isAuthenticated) {
      return Response.redirect(new URL(DEFAULT_REDIRECT, nextUrl))
    }
    return
  }
  if (!isAuthenticated && !isPublicRoute) {
    return Response.redirect(new URL("/auth/login", nextUrl))
  }
  return
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
