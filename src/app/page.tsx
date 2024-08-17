 import { currentUser } from './_lib/auth';

export default async function page() {
  const user = await currentUser();
 
  return (
    <div>page</div>
  )
}
