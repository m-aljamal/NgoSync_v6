 import { currentUser } from './_lib/auth';

export default async function page() {
  const user = await currentUser();
console.log(user);

  return (
    <div>page</div>
  )
}
