import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";
 
export default function SigninBtn() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google", {
          redirectTo: "/overview",
        });
      }}
    >
      <Button type="submit">
        دخول
        <span className="mr-1" aria-hidden="true">
          &larr;
        </span>
      </Button>
    </form>
  );
}
