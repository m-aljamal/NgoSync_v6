import Hero from "./_components/landing-page"
import { currentUser } from "./_lib/auth"

export default async function page() {
  const user = await currentUser()
 
  return <Hero role={user?.role} />
}
